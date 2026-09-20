param(
  [string]$StartFrom = "05",
  [int]$MaxCompileRepairAttempts = 2,
  [int]$MaxRescueAttempts = 1
)

$ErrorActionPreference = "Stop"
function Fail([string]$message) { throw $message }

$repoRoot = (& git rev-parse --show-toplevel 2>$null).Trim()
if (-not $repoRoot) { Fail "Not inside a git repository." }

Push-Location $repoRoot
try {
  $branch = (git branch --show-current).Trim()
  if (-not $branch) { Fail "Not inside a git repository." }
  if ($branch -in @("master","main","lean-agentic-refactor")) { Fail "Use a dedicated build branch." }
  if (git status --porcelain --untracked-files=all) { Fail "Working tree is not clean. Commit/stash/restore changes before Night Build." }

  if (-not (Get-Command aider -ErrorAction SilentlyContinue)) { Fail "Aider is not installed or not available in PATH." }
  if (-not (Get-Command ollama -ErrorAction SilentlyContinue)) { Fail "Ollama is not installed or not available in PATH." }

  $WorkerAiderModel = "ollama_chat/agro-coder"
  $WorkerOllamaModel = "agro-coder"
  $RescueAiderModel = "ollama_chat/deepseek-coder-v2:16b"
  $RescueOllamaModel = "deepseek-coder-v2:16b"

  & ollama show $WorkerOllamaModel *> $null
  if ($LASTEXITCODE -ne 0) { Fail "Ollama model '$WorkerOllamaModel' is not available." }
  & ollama show $RescueOllamaModel *> $null
  if ($LASTEXITCODE -ne 0) { Fail "Ollama rescue model '$RescueOllamaModel' is not available." }

  $env:OLLAMA_API_BASE = "http://127.0.0.1:11434"

  function B([string]$Id,[string]$Task,[string]$Name,[string]$TaskFile,[string]$Gate,[string[]]$Editable,[string[]]$Read,[string]$Goal,[bool]$AllowNoChanges=$false) {
    @{ Id=$Id; Task=$Task; Name=$Name; TaskFile=$TaskFile; Gate=$Gate; Editable=$Editable; Read=$Read; Goal=$Goal; AllowNoChanges=$AllowNoChanges }
  }

  $blocks = @(
    B "05A" "05" "map behavior" "night-tasks/05-map-sanity.md" "mobile" @(
      "mobile/src/components/MapLocationPicker.tsx","mobile/src/screens/EstablishmentFormScreen.tsx"
    ) @(
      "specs/features/F02-Establecimiento.md","specs/ui/UX01-Design-System.md","mobile/src/theme/theme.ts","mobile/src/components/SearchableSelect.tsx","mobile/package.json"
    ) "Harden the existing map/GPS flow only. Keep manual marker selection and GPS functional. Use Google provider where the existing component supports it. Permission denial must keep manual selection usable. Remove duplicated/dead GPS controls. Do not hardcode keys. Preserve F02 payload and GeoRef behavior."

    B "05B" "05" "map platform config" "night-tasks/05-map-sanity.md" "mobile" @(
      "mobile/app.config.js","mobile/app.json","mobile/.env.example","NIGHT_REPORT.md"
    ) @(
      "specs/features/F02-Establecimiento.md","mobile/src/components/MapLocationPicker.tsx","mobile/package.json"
    ) "Finish map platform configuration using environment/platform configuration only. No secrets or API keys hardcoded. Do not add dependencies. Record in NIGHT_REPORT that real-device verification is still required."

    B "10A" "10" "F03 entities" "night-tasks/10-f03-backend.md" "backend" @(
      "backend/src/entities/herd.entity.ts","backend/src/entities/animal.entity.ts","backend/src/entities/weighing.entity.ts","backend/src/entities/livestock-event.entity.ts"
    ) @(
      "specs/features/F03-gestion-ganadera.md","specs/features/F02-Establecimiento.md","backend/src/entities/establishment.entity.ts"
    ) "Implement only the F03 TypeORM entities and exact relations/columns from the spec. Preserve nested ownership. Do not invent fields."

    B "10B" "10" "F03 DTOs" "night-tasks/10-f03-backend.md" "backend" @(
      "backend/src/livestock/dto/herd.dto.ts","backend/src/livestock/dto/animal.dto.ts","backend/src/livestock/dto/weighing.dto.ts","backend/src/livestock/dto/livestock-event.dto.ts"
    ) @(
      "specs/features/F03-gestion-ganadera.md","backend/src/entities/herd.entity.ts","backend/src/entities/animal.entity.ts","backend/src/entities/weighing.entity.ts","backend/src/entities/livestock-event.entity.ts"
    ) "Implement only F03 DTOs and validation from the spec. Keep benchmark settings separate from canonical F02."

    B "10C" "10" "F03 service herds animals" "night-tasks/10-f03-backend.md" "backend" @(
      "backend/src/livestock/livestock.service.ts"
    ) @(
      "specs/features/F03-gestion-ganadera.md","backend/src/entities/herd.entity.ts","backend/src/entities/animal.entity.ts","backend/src/livestock/dto/herd.dto.ts","backend/src/livestock/dto/animal.dto.ts","backend/src/establishments/establishment.service.ts","backend/src/establishments/guards/establishment-ownership.guard.ts"
    ) "Implement the herd and animal portions of the F03 service. Foreign or absent nested resources must behave as 404. Deleting a herd with animals must satisfy the F03 conflict rule. Keep the service compileable and do not implement weighings/events yet."

    B "10D" "10" "F03 service weighings events" "night-tasks/10-f03-backend.md" "backend" @(
      "backend/src/livestock/livestock.service.ts"
    ) @(
      "specs/features/F03-gestion-ganadera.md","backend/src/entities/weighing.entity.ts","backend/src/entities/livestock-event.entity.ts","backend/src/livestock/dto/weighing.dto.ts","backend/src/livestock/dto/livestock-event.dto.ts","backend/src/entities/animal.entity.ts"
    ) "Extend the existing F03 service with weighing and livestock-event operations exactly as specified. Preserve the herd/animal behavior already implemented. No fake data."

    B "10E" "10" "F03 controller module" "night-tasks/10-f03-backend.md" "backend" @(
      "backend/src/livestock/livestock.controller.ts","backend/src/livestock/livestock.module.ts"
    ) @(
      "specs/features/F03-gestion-ganadera.md","backend/src/livestock/livestock.service.ts","backend/src/establishments/guards/establishment-ownership.guard.ts"
    ) "Implement only the F03 controller and module around the existing livestock service. Expose exact F03 routes/status behavior and ownership semantics."

    B "10F" "10" "F03 migration wiring" "night-tasks/10-f03-backend.md" "backend" @(
      "backend/src/db/migrations/1790000000000-F03Livestock.ts","backend/src/app.module.ts","backend/src/data-source.ts"
    ) @(
      "specs/features/F03-gestion-ganadera.md","backend/src/livestock/livestock.module.ts","backend/src/entities/herd.entity.ts","backend/src/entities/animal.entity.ts","backend/src/entities/weighing.entity.ts","backend/src/entities/livestock-event.entity.ts"
    ) "Create the F03 migration and register F03 entities/module in AppModule/data-source. Do not rewrite unrelated modules."

    B "11A" "11" "F03 mobile herds" "night-tasks/11-f03-mobile.md" "mobile" @(
      "mobile/src/screens/LivestockScreen.tsx","mobile/src/screens/HerdDetailScreen.tsx","mobile/src/screens/CreateHerdScreen.tsx"
    ) @(
      "specs/features/F03-gestion-ganadera.md","specs/ui/UX01-Design-System.md","mobile/src/apiClient.ts","mobile/src/theme/theme.ts","mobile/src/components/index.ts"
    ) "Implement herd list/create/detail against the real backend. Spanish UX01 UI only. No fake data or placeholder metrics. Do not wire global navigation yet."

    B "11B" "11" "F03 mobile animal events" "night-tasks/11-f03-mobile.md" "mobile" @(
      "mobile/src/screens/CreateAnimalScreen.tsx","mobile/src/screens/RegisterWeighingScreen.tsx","mobile/src/screens/RegisterLivestockEventScreen.tsx"
    ) @(
      "specs/features/F03-gestion-ganadera.md","specs/ui/UX01-Design-System.md","mobile/src/apiClient.ts","mobile/src/theme/theme.ts","mobile/src/components/index.ts","mobile/src/screens/HerdDetailScreen.tsx"
    ) "Implement create animal, register weighing and livestock event screens against the real backend. Spanish UX01 UI. No fake data."

    B "11C" "11" "F03 mobile navigation" "night-tasks/11-f03-mobile.md" "mobile" @(
      "mobile/App.tsx","mobile/src/screens/EstablishmentDetailScreen.tsx"
    ) @(
      "specs/features/F03-gestion-ganadera.md","mobile/src/screens/LivestockScreen.tsx","mobile/src/screens/HerdDetailScreen.tsx","mobile/src/screens/CreateHerdScreen.tsx","mobile/src/screens/CreateAnimalScreen.tsx","mobile/src/screens/RegisterWeighingScreen.tsx","mobile/src/screens/RegisterLivestockEventScreen.tsx"
    ) "Wire completed F03 screens into existing navigation and add entry from establishment detail. Preserve F01/F02 auth/navigation. No dead tabs."

    B "12A" "12" "F04 entity service" "night-tasks/12-f04-indicators.md" "backend" @(
      "backend/src/entities/indicator-snapshot.entity.ts","backend/src/indicators/indicators.service.ts"
    ) @(
      "specs/features/F04-indicadores.md","backend/src/entities/establishment.entity.ts","backend/src/entities/herd.entity.ts","backend/src/entities/animal.entity.ts","backend/src/entities/weighing.entity.ts","backend/src/entities/livestock-event.entity.ts","backend/src/livestock/livestock.service.ts"
    ) "Implement deterministic F04 calculations and snapshot entity exactly as specified: GMD, active heads, stocking rate, mortality and cost/kg. INV-01: no LLM-derived visible numbers."

    B "12B" "12" "F04 API migration" "night-tasks/12-f04-indicators.md" "backend" @(
      "backend/src/indicators/indicators.controller.ts","backend/src/indicators/indicators.module.ts","backend/src/db/migrations/1790000001000-F04Indicators.ts"
    ) @(
      "specs/features/F04-indicadores.md","backend/src/indicators/indicators.service.ts","backend/src/entities/indicator-snapshot.entity.ts"
    ) "Expose F04 through controller/module and create its migration. Do not duplicate calculations in controller."

    B "12C" "12" "F04 wiring" "night-tasks/12-f04-indicators.md" "backend" @(
      "backend/src/app.module.ts","backend/src/data-source.ts"
    ) @(
      "backend/src/indicators/indicators.module.ts","backend/src/entities/indicator-snapshot.entity.ts"
    ) "Register the F04 module/entity in the existing app/data-source only. Preserve prior modules."

    B "13A" "13" "F05 benchmark core" "night-tasks/13-f05-benchmark.md" "backend" @(
      "backend/src/entities/benchmark-snapshot.entity.ts","backend/src/benchmark/benchmark.config.ts","backend/src/benchmark/benchmark.service.ts"
    ) @(
      "specs/features/F05-benchmark-anonimo.md","backend/src/entities/establishment.entity.ts","backend/src/entities/indicator-snapshot.entity.ts","backend/src/indicators/indicators.service.ts"
    ) "Implement F05 benchmark core with k>=10, reversible opt-in, self-exclusion, progressive relaxation and no individual third-party data. Keep thresholds in config."

    B "13B" "13" "F05 API migration" "night-tasks/13-f05-benchmark.md" "backend" @(
      "backend/src/benchmark/benchmark.controller.ts","backend/src/benchmark/benchmark.module.ts","backend/src/db/migrations/1790000002000-F05Benchmark.ts"
    ) @(
      "specs/features/F05-benchmark-anonimo.md","backend/src/benchmark/benchmark.service.ts","backend/src/entities/benchmark-snapshot.entity.ts"
    ) "Expose F05 through controller/module and create migration. Preserve privacy invariants."

    B "13C" "13" "F05 wiring" "night-tasks/13-f05-benchmark.md" "backend" @(
      "backend/src/app.module.ts","backend/src/data-source.ts"
    ) @(
      "backend/src/benchmark/benchmark.module.ts","backend/src/entities/benchmark-snapshot.entity.ts"
    ) "Register F05 module/entity in the existing app/data-source only."

    B "14A" "14" "F06 alert rules" "night-tasks/14-f06-alerts.md" "backend" @(
      "backend/src/alerts/alerts.config.ts","backend/src/alerts/alerts.service.ts"
    ) @(
      "specs/features/F06-alertas.md","backend/src/indicators/indicators.service.ts","backend/src/benchmark/benchmark.service.ts","backend/src/livestock/livestock.service.ts"
    ) "Implement deterministic configurable F06 alert rules. Missing data is not zero. No LLM."

    B "14B" "14" "F06 API wiring" "night-tasks/14-f06-alerts.md" "backend" @(
      "backend/src/alerts/alerts.controller.ts","backend/src/alerts/alerts.module.ts","backend/src/app.module.ts"
    ) @(
      "specs/features/F06-alertas.md","backend/src/alerts/alerts.service.ts"
    ) "Expose F06 via controller/module and register it in AppModule. Preserve prior modules."

    B "15A" "15" "F07 weather core" "night-tasks/15-f07-weather.md" "backend" @(
      "backend/src/weather/open-meteo.provider.ts","backend/src/weather/weather.service.ts"
    ) @(
      "specs/features/F07-clima.md","backend/src/entities/establishment.entity.ts","backend/src/establishments/establishment.service.ts"
    ) "Implement Open-Meteo provider plus weather service with ownership, timeout and UNAVAILABLE fallback. No fake weather."

    B "15B" "15" "F07 backend wiring" "night-tasks/15-f07-weather.md" "backend" @(
      "backend/src/weather/weather.controller.ts","backend/src/weather/weather.module.ts","backend/src/app.module.ts"
    ) @(
      "specs/features/F07-clima.md","backend/src/weather/weather.service.ts"
    ) "Expose weather via controller/module and register it in AppModule."

    B "15C" "15" "F07 mobile weather" "night-tasks/15-f07-weather.md" "mobile" @(
      "mobile/src/components/WeatherCard.tsx","mobile/src/components/index.ts","mobile/src/screens/EstablishmentDetailScreen.tsx"
    ) @(
      "specs/features/F07-clima.md","specs/ui/UX01-Design-System.md","mobile/src/apiClient.ts","mobile/src/theme/theme.ts"
    ) "Implement WeatherCard and integrate it into establishment detail using only backend weather. Handle UNAVAILABLE gracefully. Spanish UX01 UI."

    B "16A" "16" "F08 audit persistence" "night-tasks/16-f08-ai.md" "backend" @(
      "backend/src/entities/ai-interaction.entity.ts","backend/src/ai-audit/ai-audit.module.ts","backend/src/ai-audit/ai-audit.service.ts","backend/src/db/migrations/1790000003000-F08AiAudit.ts"
    ) @(
      "specs/features/F08-agro-ia.md","specs/constitution.md"
    ) "Implement AI interaction persistence plus separate audit module/service and migration. INV-08. Keep persistence out of backend/src/ai."

    B "16B" "16" "F08 provider guardrails" "night-tasks/16-f08-ai.md" "backend" @(
      "backend/src/ai/ai-provider.service.ts","backend/src/ai/ai-guardrails.service.ts"
    ) @(
      "specs/features/F08-agro-ia.md","specs/constitution.md"
    ) "Implement configurable OpenAI-compatible provider and F08 numeric/scope guardrails. No direct DB. No diagnosis. Deterministic fallback when AI fails."

    B "16C" "16" "F08 orchestration base" "night-tasks/16-f08-ai.md" "backend" @(
      "backend/src/ai/ai.service.ts"
    ) @(
      "specs/features/F08-agro-ia.md","specs/constitution.md","backend/src/ai/ai-provider.service.ts","backend/src/ai/ai-guardrails.service.ts","backend/src/ai-audit/ai-audit.service.ts","backend/src/establishments/establishment.service.ts","backend/src/indicators/indicators.service.ts"
    ) "Create the compileable F08 orchestration service base using provider, guardrails, audit, establishment and indicators context. backend/src/ai must not import Repository/DataSource/QueryBuilder. Preserve INV-06/07/08/11. Do not integrate benchmark/alerts/weather yet."

    B "16D" "16" "F08 orchestration context tools" "night-tasks/16-f08-ai.md" "backend" @(
      "backend/src/ai/ai.service.ts"
    ) @(
      "specs/features/F08-agro-ia.md","specs/constitution.md","backend/src/ai/ai-provider.service.ts","backend/src/ai/ai-guardrails.service.ts","backend/src/benchmark/benchmark.service.ts","backend/src/alerts/alerts.service.ts","backend/src/weather/weather.service.ts"
    ) "Extend the existing F08 orchestration service with benchmark, alerts and weather context tools exactly as specified. Preserve the existing audit/guardrail/fallback behavior and INV-06/07/08/11."

    B "16E" "16" "F08 controller module" "night-tasks/16-f08-ai.md" "backend" @(
      "backend/src/ai/ai.controller.ts","backend/src/ai/ai.module.ts"
    ) @(
      "specs/features/F08-agro-ia.md","backend/src/ai/ai.service.ts","backend/src/ai-audit/ai-audit.module.ts"
    ) "Expose F08 through controller/module. Keep audit persistence separated from AI module."

    B "16F" "16" "F08 backend wiring" "night-tasks/16-f08-ai.md" "backend" @(
      "backend/src/app.module.ts","backend/src/data-source.ts"
    ) @(
      "backend/src/ai/ai.module.ts","backend/src/ai-audit/ai-audit.module.ts","backend/src/entities/ai-interaction.entity.ts"
    ) "Register F08 modules/entity in app/data-source without changing unrelated config."

    B "16G" "16" "F08 mobile screen" "night-tasks/16-f08-ai.md" "mobile" @(
      "mobile/src/screens/AgroAiScreen.tsx","mobile/App.tsx"
    ) @(
      "specs/features/F08-agro-ia.md","specs/ui/UX01-Design-System.md","mobile/src/apiClient.ts","mobile/src/theme/theme.ts","mobile/src/components/index.ts"
    ) "Implement and wire Agro IA screen against real backend. Show fallback states clearly. No diagnosis or fake metrics. Spanish UX01 UI."

    B "17A" "17" "F09 dashboard service core" "night-tasks/17-f09-dashboard.md" "backend" @(
      "backend/src/dashboard/dashboard.service.ts"
    ) @(
      "specs/features/F09-dashboard.md","backend/src/establishments/establishment.service.ts","backend/src/indicators/indicators.service.ts","backend/src/benchmark/benchmark.service.ts"
    ) "Create the compileable F09 dashboard service core using establishment, indicators and benchmark. It must tolerate partial failures. No fake metrics and no AgroScore. Do not integrate alerts/weather yet."

    B "17B" "17" "F09 dashboard service alerts weather" "night-tasks/17-f09-dashboard.md" "backend" @(
      "backend/src/dashboard/dashboard.service.ts"
    ) @(
      "specs/features/F09-dashboard.md","backend/src/alerts/alerts.service.ts","backend/src/weather/weather.service.ts"
    ) "Extend the existing dashboard service with alerts and weather while preserving partial-failure tolerance. No fake metrics and no AgroScore."

    B "17C" "17" "F09 dashboard API" "night-tasks/17-f09-dashboard.md" "backend" @(
      "backend/src/dashboard/dashboard.controller.ts","backend/src/dashboard/dashboard.module.ts","backend/src/app.module.ts"
    ) @(
      "specs/features/F09-dashboard.md","backend/src/dashboard/dashboard.service.ts"
    ) "Expose F09 dashboard through controller/module and register it in AppModule. Preserve prior modules."

    B "17D" "17" "F09 dashboard cards" "night-tasks/17-f09-dashboard.md" "mobile" @(
      "mobile/src/components/KpiCard.tsx","mobile/src/components/BenchmarkCard.tsx","mobile/src/components/AlertsCard.tsx"
    ) @(
      "specs/features/F09-dashboard.md","specs/ui/UX01-Design-System.md","mobile/src/theme/theme.ts"
    ) "Implement F09 dashboard cards with UX01. Display only real backend values and explicit unavailable states."

    B "17E" "17" "F09 home integration" "night-tasks/17-f09-dashboard.md" "mobile" @(
      "mobile/src/screens/HomeScreen.tsx","mobile/src/components/index.ts"
    ) @(
      "specs/features/F09-dashboard.md","specs/ui/UX01-Design-System.md","mobile/src/apiClient.ts","mobile/App.tsx","mobile/src/components/KpiCard.tsx","mobile/src/components/BenchmarkCard.tsx","mobile/src/components/AlertsCard.tsx","mobile/src/components/WeatherCard.tsx"
    ) "Integrate real F09 dashboard into Home for selected establishment: KPIs, benchmark, alerts, weather, livestock and Agro IA entry points. No fake metrics or AgroScore."

    B "18A" "18" "final integration code" "night-tasks/18-mvp-polish.md" "both" @(
      "backend/src/app.module.ts","backend/src/data-source.ts","mobile/App.tsx","mobile/src/apiClient.ts"
    ) @(
      "specs/000-index.md","night-tasks/18-mvp-polish.md"
    ) "Final integration pass on these wiring files only. Fix broken imports/routes and remove debug-only code in these files. Preserve all features. It is valid to make no changes if already correct." $true

    B "18B" "18" "final docs env" "night-tasks/18-mvp-polish.md" "both" @(
      "backend/.env.example","mobile/.env.example","README.md"
    ) @(
      "specs/000-index.md","night-tasks/18-mvp-polish.md"
    ) "Align env examples and README with the MVP actually implemented. No secrets and no invented features. It is valid to make no changes if already accurate." $true
  )

  function N([string]$p) { $p.Replace("\","/").Trim() }

  function Get-ChangedPaths([string]$before) {
    $paths = New-Object System.Collections.Generic.List[string]
    foreach ($p in @(git diff --name-only $before)) {
      if ($p) { $paths.Add((N $p)) }
    }
    foreach ($line in @(git status --porcelain --untracked-files=all)) {
      if ($line.Length -lt 4) { continue }
      $p = $line.Substring(3).Trim()
      if ($p -match " -> ") { $p = ($p -split " -> ")[-1] }
      if ($p) { $paths.Add((N $p)) }
    }
    @($paths | Sort-Object -Unique)
  }

  function Get-ForbiddenChanges([hashtable]$block,[string]$before) {
    $allowed = @($block.Editable | ForEach-Object { N $_ })
    @((Get-ChangedPaths $before) | Where-Object { $_ -notin $allowed })
  }

  function Restore-ForbiddenChanges([hashtable]$block,[string]$before) {
    $bad = @(Get-ForbiddenChanges $block $before)
    if ($bad.Count -eq 0) {
      return @{ HadViolation=$false; Restored=@() }
    }

    Write-Host "Scope violation detected in block $($block.Id). Restoring forbidden paths..." -ForegroundColor Yellow
    foreach ($p in $bad) {
      Write-Host "RESTORE FORBIDDEN: $p" -ForegroundColor Red

      & git ls-files --error-unmatch -- "$p" *> $null
      $tracked = ($LASTEXITCODE -eq 0)

      if ($tracked) {
        & git restore --source=HEAD --staged --worktree -- "$p"
        if ($LASTEXITCODE -ne 0) { Fail "Could not restore forbidden tracked path '$p'." }
      }
      elseif (Test-Path -LiteralPath $p) {
        Remove-Item -LiteralPath $p -Force -Recurse
      }
    }

    $stillBad = @(Get-ForbiddenChanges $block $before)
    if ($stillBad.Count -gt 0) {
      $stillBad | ForEach-Object { Write-Host "STILL FORBIDDEN: $_" -ForegroundColor Red }
      Fail "Could not restore all forbidden changes for block $($block.Id)."
    }

    @{ HadViolation=$true; Restored=$bad }
  }

  function Invoke-Cmd([string]$working,[string]$command) {
    Push-Location $working
    try {
      $out = @(& cmd.exe /d /s /c "$command 2>&1")
      $code = $LASTEXITCODE
      $out | ForEach-Object { Write-Host $_ }
      @{ Success=($code -eq 0); Output=($out -join [Environment]::NewLine) }
    }
    finally { Pop-Location }
  }

  function Invoke-Gate([string]$gate) {
    $all=@(); $ok=$true
    if ($gate -eq "backend" -or $gate -eq "both") {
      Write-Host "Backend build..." -ForegroundColor Cyan
      $r=Invoke-Cmd "backend" "npm run build"
      $all += "BACKEND:`n"+$r.Output
      if (-not $r.Success) { $ok=$false }
    }
    if ($ok -and ($gate -eq "mobile" -or $gate -eq "both")) {
      Write-Host "Mobile TypeScript..." -ForegroundColor Cyan
      $r=Invoke-Cmd "mobile" "npx tsc --noEmit -p tsconfig.night.json"
      $all += "MOBILE:`n"+$r.Output
      if (-not $r.Success) { $ok=$false }
    }
    @{ Success=$ok; Output=($all -join "`n") }
  }

  function Invoke-StaticChecks([hashtable]$block,[string]$before) {
    $errors = New-Object System.Collections.Generic.List[string]
    $changed = @(Get-ChangedPaths $before)

    foreach ($p in $changed) {
      if (-not (Test-Path -LiteralPath $p -PathType Leaf)) { continue }
      if ($p -notmatch '\.(ts|tsx|js|jsx)$') { continue }

      $content = Get-Content -Raw -LiteralPath $p

      if ($content -match '@nestjs/typeORM') {
        $errors.Add("$p contains invalid @nestjs/typeORM casing; use @nestjs/typeorm.")
      }

      if ($p.StartsWith("mobile/") -and $content -match 'styled-components') {
        $errors.Add("$p introduces styled-components, which is not part of this mobile project.")
      }
    }

    if ($block.Id -in @("10C","10D")) {
      $servicePath = "backend/src/livestock/livestock.service.ts"
      if (Test-Path $servicePath) {
        $service = Get-Content -Raw $servicePath
        if ($service -match ':\s*any\b') { $errors.Add("F03 livestock service contains ': any'.") }
        if ($service -match '\bdeleteAnimal\s*\(') { $errors.Add("F03 livestock service contains deleteAnimal(), which is outside F03.") }
      }
    }

    if ($block.Id -in @("16B","16C","16D","16E")) {
      foreach ($p in @(Get-ChildItem "backend/src/ai" -Filter "*.ts" -File -ErrorAction SilentlyContinue | ForEach-Object { N ($_.FullName.Substring($repoRoot.Length + 1)) })) {
        $content = Get-Content -Raw -LiteralPath $p
        if ($content -match '@InjectRepository|Repository\s*<|\bDataSource\b|\bQueryBuilder\b|from\s+["'']typeorm["'']') {
          $errors.Add("$p violates INV-06: backend/src/ai must not access TypeORM/DB directly.")
        }
      }
    }

    if ($errors.Count -gt 0) {
      $errors | ForEach-Object { Write-Host "STATIC CHECK: $_" -ForegroundColor Red }
      return @{ Success=$false; Output=($errors -join [Environment]::NewLine) }
    }

    @{ Success=$true; Output="Static checks passed." }
  }

  function Invoke-Validation([hashtable]$block,[string]$before) {
    $gate = Invoke-Gate $block.Gate
    if (-not $gate.Success) { return $gate }

    $checks = Invoke-StaticChecks $block $before
    if (-not $checks.Success) {
      return @{ Success=$false; Output=("STATIC CHECKS:`n" + $checks.Output) }
    }

    @{ Success=$true; Output=$gate.Output }
  }

  function New-PromptFile([string]$id,[string]$body) {
    $dir=Join-Path $env:TEMP "agro-night-build"
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
    $file=Join-Path $dir "block-$id-$([Guid]::NewGuid().ToString('N')).txt"
    [System.IO.File]::WriteAllText($file,$body,[System.Text.UTF8Encoding]::new($false))
    $file
  }

  function Switch-LocalModel([string]$role) {
    if ($role -eq "worker") {
      & ollama stop $RescueOllamaModel *> $null
      Start-Sleep -Seconds 1
      return
    }
    if ($role -eq "rescue") {
      & ollama stop $WorkerOllamaModel *> $null
      Start-Sleep -Seconds 1
      return
    }
    Fail "Unknown model role '$role'."
  }

  function Invoke-AiderBlock(
    [hashtable]$block,
    [string]$prompt,
    [string]$role="worker",
    [string[]]$editableOverride=@()
  ) {
    $promptFile=New-PromptFile $block.Id $prompt
    $editable=if($editableOverride.Count -gt 0){$editableOverride}else{@($block.Editable)}

    if ($role -eq "worker") {
      $model=$WorkerAiderModel
    }
    elseif ($role -eq "rescue") {
      $model=$RescueAiderModel
    }
    else {
      Fail "Unknown Aider role '$role'."
    }

    Switch-LocalModel $role

    $args=@(
      "--model",$model,
      "--model-settings-file","local-ai/aider-model-settings.yml",
      "--message-file",$promptFile,
      "--yes-always",
      "--no-auto-commits",
      "--no-dirty-commits",
      "--no-auto-lint",
      "--no-auto-test",
      "--no-gitignore",
      "--no-check-update",
      "--no-show-release-notes",
      "--no-show-model-warnings",
      "--analytics-disable",
      "--no-suggest-shell-commands",
      "--map-tokens","0",
      "--encoding","utf-8",
      "--edit-format","whole"
    )

    # Deliberately DO NOT read the broad night-task file here.
    # Each micro-block receives only AGENTS.md + its narrow read-only context.
    $readPaths=@("AGENTS.md")+@($block.Read)
    foreach($p in @($readPaths|Sort-Object -Unique)) {
      if(Test-Path $p){$args+=@("--read",$p)}
    }
    foreach($p in @($editable|Sort-Object -Unique)) {
      $args+=@("--file",$p)
    }

    Write-Host "Aider $role block $($block.Id): $($block.Name)" -ForegroundColor DarkCyan
    Write-Host "Model: $model" -ForegroundColor DarkCyan
    Write-Host "Editable: $($editable.Count) | Read-only: $(@($readPaths|Sort-Object -Unique).Count)" -ForegroundColor DarkCyan

    try {
      & aider @args
      $code=$LASTEXITCODE
    }
    finally {
      Remove-Item $promptFile -Force -ErrorAction SilentlyContinue
    }

    @{ Success=($code -eq 0); ExitCode=$code }
  }

  function Get-EditableList([hashtable]$block) {
    (@($block.Editable | ForEach-Object { "- $(N $_)" })) -join "`n"
  }

  function Invoke-Implementation([hashtable]$block) {
    $editableList=Get-EditableList $block
    $prompt=@"
You are implementing one small isolated code block for Agro Intelligence Network.

ABSOLUTE EDIT ALLOWLIST:
$editableList

Hard constraints:
- Work ONLY on the files in the edit allowlist above.
- Do not request, create, edit, rename or delete any other file.
- Do not create alternate folders or duplicate paths.
- Preserve unrelated behavior.
- Do not edit tests, commit, push or install packages.
- React Native: existing project patterns/theme only; never add styled-components.
- NestJS: existing TypeORM architecture.
- No fake data, fake metrics, dead UI or production emoji iconography.
- User-facing text in Spanish.
- Apply real code changes; do not only explain.
- Follow the feature spec/read-only files in this session, but ONLY implement the narrow GOAL below.
- Ignore broader future work that may be mentioned in specs.
- This block is intentionally small to stay under the local model context window.

Block $($block.Id) - $($block.Name)

GOAL:
$($block.Goal)
"@
    Invoke-AiderBlock $block $prompt "worker"
  }

  function Invoke-WorkerRepair([hashtable]$block,[string]$failureOutput,[string]$before) {
    $allowed=@($block.Editable|ForEach-Object{N $_})
    $changed=@(Get-ChangedPaths $before)
    $editable=@($changed|Where-Object{$_ -in $allowed})
    if($editable.Count -eq 0){$editable=@($block.Editable)}

    $err=[string]$failureOutput
    if($err.Length -gt 7000){$err=$err.Substring($err.Length-7000)}
    $editableList=(@($editable | ForEach-Object { "- $(N $_)" })) -join "`n"

    $prompt=@"
Repair ONLY the current block. Do not broaden scope or redesign.

ABSOLUTE EDIT ALLOWLIST:
$editableList

Block $($block.Id) - $($block.Name)
GOAL:
$($block.Goal)

Rules:
- Fix the smallest valid set of issues.
- Do not create/edit files outside the allowlist.
- Do not add dependencies, edit tests, commit or push.
- Preserve already-correct behavior and spec invariants.

CURRENT FAILURE:
$err
"@
    Invoke-AiderBlock $block $prompt "worker" $editable
  }

  function Invoke-Rescue([hashtable]$block,[string]$failureOutput,[string]$before,[string[]]$scopeRestored=@()) {
    $allowed=@($block.Editable|ForEach-Object{N $_})
    $changed=@(Get-ChangedPaths $before)
    $editable=@($changed|Where-Object{$_ -in $allowed})
    if($editable.Count -eq 0){$editable=@($block.Editable)}

    $err=[string]$failureOutput
    if($err.Length -gt 9000){$err=$err.Substring($err.Length-9000)}
    $editableList=(@($editable | ForEach-Object { "- $(N $_)" })) -join "`n"
    $scopeText=if($scopeRestored.Count -gt 0){($scopeRestored -join ", ")}else{"none"}

    $prompt=@"
You are the LOCAL RESCUE MODEL for one failed micro-block. Repair it conservatively.

ABSOLUTE EDIT ALLOWLIST:
$editableList

Block $($block.Id) - $($block.Name)
GOAL:
$($block.Goal)

Critical rules:
- Edit ONLY the allowlisted files. Never ask to add another file.
- The broad night-task file is intentionally NOT provided. Do not infer future work.
- Follow the feature spec/read-only context exactly.
- Fix only what is required for this block to satisfy its goal, compile/type-check, and preserve invariants.
- Do not redesign architecture, add dependencies, edit tests, commit or push.
- Do not use 'any' to silence TypeScript errors when a real project type/DTO exists.
- NestJS uses @nestjs/typeorm in lowercase.
- Preserve ownership/security checks; foreign nested resources must not leak across establishments.
- No fake data or fake metrics.

Forbidden paths automatically restored before rescue: $scopeText

FAILURE TO REPAIR:
$err
"@
    Invoke-AiderBlock $block $prompt "rescue" $editable
  }

  function Complete-Block([hashtable]$block,[string]$before) {
    $scopeRestored = New-Object System.Collections.Generic.List[string]

    $impl=Invoke-Implementation $block
    $scope=Restore-ForbiddenChanges $block $before
    foreach($p in @($scope.Restored)){[void]$scopeRestored.Add($p)}

    $changed=@(Get-ChangedPaths $before)
    $failure=""

    if(-not $impl.Success){
      $failure="Worker Aider exited with code $($impl.ExitCode)."
    }
    elseif($changed.Count -eq 0 -and -not $block.AllowNoChanges){
      $failure="Worker produced no changes for a block that requires changes."
    }
    else {
      $result=Invoke-Validation $block $before
      if($result.Success){
        Write-Host "GREEN: block $($block.Id)" -ForegroundColor Green
        return
      }
      $failure=$result.Output
    }

    for($attempt=1;$attempt -le $MaxCompileRepairAttempts;$attempt++){
      Write-Host "Worker repair $attempt/$MaxCompileRepairAttempts for $($block.Id)..." -ForegroundColor Yellow
      $repair=Invoke-WorkerRepair $block $failure $before
      $scope=Restore-ForbiddenChanges $block $before
      foreach($p in @($scope.Restored)){if(-not $scopeRestored.Contains($p)){[void]$scopeRestored.Add($p)}}

      if(-not $repair.Success){
        $failure="Worker repair exited with code $($repair.ExitCode). Previous failure:`n$failure"
        continue
      }

      $changed=@(Get-ChangedPaths $before)
      if($changed.Count -eq 0 -and -not $block.AllowNoChanges){
        $failure="Worker repair produced no valid in-scope changes."
        continue
      }

      $result=Invoke-Validation $block $before
      if($result.Success){
        Write-Host "GREEN after worker repair: block $($block.Id)" -ForegroundColor Green
        return
      }
      $failure=$result.Output
    }

    for($attempt=1;$attempt -le $MaxRescueAttempts;$attempt++){
      Write-Host "Rescue model $attempt/$MaxRescueAttempts for $($block.Id)..." -ForegroundColor Magenta
      $rescue=Invoke-Rescue $block $failure $before @($scopeRestored)
      $scope=Restore-ForbiddenChanges $block $before
      foreach($p in @($scope.Restored)){if(-not $scopeRestored.Contains($p)){[void]$scopeRestored.Add($p)}}

      if(-not $rescue.Success){
        $failure="Rescue Aider exited with code $($rescue.ExitCode). Previous failure:`n$failure"
        continue
      }

      $changed=@(Get-ChangedPaths $before)
      if($changed.Count -eq 0 -and -not $block.AllowNoChanges){
        $failure="Rescue model produced no valid in-scope changes."
        continue
      }

      $result=Invoke-Validation $block $before
      if($result.Success){
        Write-Host "GREEN after rescue: block $($block.Id)" -ForegroundColor Green
        return
      }
      $failure=$result.Output
    }

    Fail "Block $($block.Id) failed after worker repairs and rescue. Last failure:`n$failure"
  }

  $startIndex=-1
  for($i=0;$i -lt $blocks.Count;$i++){
    if($blocks[$i].Id -eq $StartFrom -or $blocks[$i].Task -eq $StartFrom){$startIndex=$i;break}
  }
  if($startIndex -lt 0){Fail "Unknown StartFrom '$StartFrom'. Use 05,10,11,12,13,14,15,16,17,18 or a block id such as 10C."}
  $blocks=$blocks[$startIndex..($blocks.Count-1)]

  Write-Host "== AGRO INTELLIGENCE NIGHT BUILD - DUAL LOCAL MODELS ==" -ForegroundColor Cyan
  Write-Host "Repo root: $repoRoot"
  Write-Host "Branch: $branch"
  Write-Host "Worker: $WorkerAiderModel"
  Write-Host "Rescue: $RescueAiderModel"
  Write-Host "Context: repo-map OFF / map-tokens 0 / narrow read-only context"
  Write-Host "Starting from: $StartFrom"
  Write-Host "No tests. No push.`n"

  foreach($block in $blocks){
    Write-Host "== Block $($block.Id): $($block.Name) ==" -ForegroundColor Cyan

    if (git status --porcelain --untracked-files=all) {
      Fail "Working tree became dirty before block $($block.Id). Previous block should have committed cleanly."
    }

    $before=(git rev-parse HEAD).Trim()
    Complete-Block $block $before

    # One final scope enforcement before staging.
    $scope=Restore-ForbiddenChanges $block $before
    if($scope.HadViolation){
      $finalCheck=Invoke-Validation $block $before
      if(-not $finalCheck.Success){Fail "Block $($block.Id) failed after final scope restoration.`n$($finalCheck.Output)"}
    }

    $changed=@(Get-ChangedPaths $before)
    if($changed.Count -gt 0){
      git add -- $changed
      if($LASTEXITCODE -ne 0){Fail "git add failed on block $($block.Id)."}

      git commit -m "night: $($block.Id) $($block.Name)"
      if($LASTEXITCODE -ne 0){Fail "Commit failed on block $($block.Id)."}
      Write-Host "COMMITTED: block $($block.Id)" -ForegroundColor Green
    }
    else {
      if(-not $block.AllowNoChanges){Fail "Block $($block.Id) ended with no changes."}
      Write-Host "NO-OP GREEN: block $($block.Id)" -ForegroundColor Green
    }
    Write-Host ""
  }

  Write-Host "== FINAL MVP COMPILE ==" -ForegroundColor Cyan
  $final=Invoke-Gate "both"; if(-not $final.Success){Fail "Final MVP compile failed."}
  Write-Host "NIGHT BUILD FINISHED GREEN." -ForegroundColor Green
  Write-Host "No tests were run. No push was performed."
}
finally { Pop-Location }