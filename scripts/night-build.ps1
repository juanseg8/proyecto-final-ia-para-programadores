param(
  [ValidateSet("03","04","05","10","11","12","13","14","15","16","17","18")]
  [string]$StartFrom = "03",
  [int]$MaxCompileRepairAttempts = 2
)

$ErrorActionPreference = "Stop"

function Fail([string]$message) { throw $message }

$branch = (git branch --show-current).Trim()
if (-not $branch) { Fail "Not inside a git repository." }
if ($branch -eq "master" -or $branch -eq "main" -or $branch -eq "lean-agentic-refactor") {
  Fail "Use dedicated night-build branch."
}
if (git status --porcelain) {
  Fail "Working tree is not clean. Commit/stash/restore changes before Night Build."
}

if (-not (Get-Command aider -ErrorAction SilentlyContinue)) {
  Fail @"
Aider is not installed.

Install once:
  python -m pip install aider-install
  aider-install

Then rerun this script.
"@
}

if (-not (Get-Command ollama -ErrorAction SilentlyContinue)) {
  Fail "Ollama is not installed or not available in PATH."
}

& ollama show agro-coder *> $null
if ($LASTEXITCODE -ne 0) {
  Fail "Ollama model 'agro-coder' is not available. Run scripts/setup-local-ai.ps1 first."
}

$env:OLLAMA_API_BASE = "http://127.0.0.1:11434"

$tasks = @(
  @{ Id="03"; File="night-tasks/03-georef-searchable-select.md"; Gate="mobile"; Commit="night: consolidate GeoRef searchable selectors" },
  @{ Id="04"; File="night-tasks/04-ui-foundation-cleanup.md"; Gate="mobile"; Commit="night: normalize mobile UI foundation" },
  @{ Id="05"; File="night-tasks/05-map-sanity.md"; Gate="mobile"; Commit="night: harden map flow code" },
  @{ Id="10"; File="night-tasks/10-f03-backend.md"; Gate="backend"; Commit="night: implement F03 livestock backend" },
  @{ Id="11"; File="night-tasks/11-f03-mobile.md"; Gate="mobile"; Commit="night: implement F03 livestock mobile" },
  @{ Id="12"; File="night-tasks/12-f04-indicators.md"; Gate="backend"; Commit="night: implement deterministic indicators" },
  @{ Id="13"; File="night-tasks/13-f05-benchmark.md"; Gate="backend"; Commit="night: implement anonymous benchmark" },
  @{ Id="14"; File="night-tasks/14-f06-alerts.md"; Gate="backend"; Commit="night: implement deterministic alerts" },
  @{ Id="15"; File="night-tasks/15-f07-weather.md"; Gate="both"; Commit="night: integrate weather context" },
  @{ Id="16"; File="night-tasks/16-f08-ai.md"; Gate="both"; Commit="night: implement Agro AI assistant" },
  @{ Id="17"; File="night-tasks/17-f09-dashboard.md"; Gate="both"; Commit="night: integrate intelligence dashboard" },
  @{ Id="18"; File="night-tasks/18-mvp-polish.md"; Gate="both"; Commit="night: finalize MVP integration" }
)

function Get-TaskContext([string]$taskFile) {
  $lines = Get-Content $taskFile
  $section = ""
  $editable = New-Object System.Collections.Generic.List[string]
  $readOnly = New-Object System.Collections.Generic.List[string]

  $readOnly.Add("AGENTS.md")
  $readOnly.Add($taskFile)

  foreach ($line in $lines) {
    if ($line -match '^##\s+Leer') { $section = "read"; continue }
    if ($line -match '^##\s+Crear') { $section = "create"; continue }
    if ($line -match '^##\s+') { $section = ""; continue }

    if (($section -eq "read" -or $section -eq "create") -and $line -match '^\s*-\s+(.+?)\s*$') {
      $path = $Matches[1].Trim().Trim([char]96)
      if ($path -notmatch '^[A-Za-z0-9_.\-/]+$') { continue }

      $isProduction = $path.StartsWith("backend/") -or $path.StartsWith("mobile/") -or $path -eq "README.md"
      if ($isProduction) {
        if (-not $editable.Contains($path)) { $editable.Add($path) }
      } else {
        if (-not $readOnly.Contains($path)) { $readOnly.Add($path) }
      }
    }
  }

  return @{ Editable = @($editable); ReadOnly = @($readOnly) }
}

function Get-ChangedPaths([string]$before) {
  $paths = New-Object System.Collections.Generic.List[string]
  foreach ($p in @(git diff --name-only $before)) {
    if ($p) { $paths.Add($p.Trim()) }
  }
  foreach ($line in @(git status --porcelain)) {
    if ($line.Length -lt 4) { continue }
    $p = $line.Substring(3).Trim()
    if ($p -match " -> ") { $p = ($p -split " -> ")[-1] }
    if ($p) { $paths.Add($p) }
  }
  return @($paths | Sort-Object -Unique)
}

function Assert-Paths([string[]]$paths, [string]$taskId) {
  $bad = @()
  foreach ($p in $paths) {
    $n = $p.Replace("\","/")
    $ok =
      $n -eq "NIGHT_REPORT.md" -or
      ($n.StartsWith("backend/") -and -not $n.Contains(".spec.ts") -and -not $n.StartsWith("backend/test/")) -or
      ($n.StartsWith("mobile/") -and -not $n.StartsWith("mobile/__tests__/")) -or
      ($taskId -eq "18" -and $n -eq "README.md")
    if (-not $ok) { $bad += $n }
  }
  if ($bad.Count -gt 0) {
    $bad | ForEach-Object { Write-Host "FORBIDDEN CHANGE: $_" -ForegroundColor Red }
    Fail "Aider changed files outside the allowed production scope."
  }
}

function Has-ProductionChanges([string]$before) {
  $paths = @(Get-ChangedPaths $before)
  $prod = @($paths | Where-Object {
    $n = $_.Replace("\","/")
    $n.StartsWith("backend/") -or ($n.StartsWith("mobile/") -and -not $n.StartsWith("mobile/__tests__/"))
  })
  return $prod.Count -gt 0
}

function Invoke-Cmd([string]$working, [string]$command) {
  Push-Location $working
  try {
    $out = @(& cmd.exe /d /s /c "$command 2>&1")
    $code = $LASTEXITCODE
    $out | ForEach-Object { Write-Host $_ }
    return @{ Success = ($code -eq 0); Output = ($out -join [Environment]::NewLine) }
  } finally { Pop-Location }
}

function Invoke-Gate([string]$gate) {
  $all = @(); $ok = $true
  if ($gate -eq "backend" -or $gate -eq "both") {
    Write-Host "Backend build..." -ForegroundColor Cyan
    $r = Invoke-Cmd "backend" "npm run build"
    $all += "BACKEND:" + [Environment]::NewLine + $r.Output
    if (-not $r.Success) { $ok = $false }
  }
  if ($ok -and ($gate -eq "mobile" -or $gate -eq "both")) {
    Write-Host "Mobile TypeScript..." -ForegroundColor Cyan
    $r = Invoke-Cmd "mobile" "npx tsc --noEmit -p tsconfig.night.json"
    $all += "MOBILE:" + [Environment]::NewLine + $r.Output
    if (-not $r.Success) { $ok = $false }
  }
  return @{ Success = $ok; Output = ($all -join [Environment]::NewLine) }
}

function New-PromptFile([string]$taskId, [string]$body) {
  $dir = Join-Path $env:TEMP "agro-night-build"
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
  $file = Join-Path $dir "task-$taskId-$([Guid]::NewGuid().ToString('N')).txt"
  [System.IO.File]::WriteAllText($file, $body, [System.Text.UTF8Encoding]::new($false))
  return $file
}

function Invoke-Aider(
  [hashtable]$task,
  [hashtable]$context,
  [string]$prompt,
  [bool]$architectFallback = $false,
  [string[]]$overrideEditable = @()
) {
  $promptFile = New-PromptFile $task.Id $prompt
  $editable = if ($overrideEditable.Count -gt 0) { $overrideEditable } else { @($context.Editable) }

  $args = @(
    "--model", "ollama_chat/agro-coder",
    "--model-settings-file", "local-ai/aider-model-settings.yml",
    "--message-file", $promptFile,
    "--yes-always",
    "--no-auto-commits",
    "--no-dirty-commits",
    "--no-auto-lint",
    "--no-auto-test",
    "--no-gitignore",
    "--no-check-update",
    "--no-show-release-notes",
    "--analytics-disable",
    "--no-suggest-shell-commands",
    "--map-tokens", "768",
    "--encoding", "utf-8",
    "--edit-format", "whole"
  )

  if ($architectFallback) {
    $args += @("--architect", "--editor-model", "ollama_chat/agro-coder", "--editor-edit-format", "editor-whole")
  }

  foreach ($p in @($context.ReadOnly)) {
    if (Test-Path $p) { $args += @("--read", $p) }
  }
  foreach ($p in @($editable)) { $args += @("--file", $p) }

  $mode = if ($architectFallback) { "architect + editor-whole" } else { "whole" }
  Write-Host "Aider mode: $mode" -ForegroundColor DarkCyan
  Write-Host "Editable files: $($editable.Count) | Read-only context: $($context.ReadOnly.Count)" -ForegroundColor DarkCyan

  try {
    & aider @args
    $code = $LASTEXITCODE
  } finally {
    Remove-Item $promptFile -Force -ErrorAction SilentlyContinue
  }
  if ($code -ne 0) { Fail "Aider failed on Task $($task.Id) with exit code $code." }
}

function Invoke-Task([hashtable]$task, [hashtable]$context, [string]$taskText, [bool]$fallback) {
  $modeNote = if ($fallback) {
    "Previous whole-file attempt produced no implementation. Solve the task now using architect reasoning and editor-whole output."
  } else {
    "Implement the task now. Do not only explain or plan. Produce the actual code changes."
  }

  $prompt = @"
You are implementing one isolated production task for Agro Intelligence Network.

$modeNote

Authoritative rules:
- Follow AGENTS.md and the task/specs exactly.
- Only edit the files explicitly added as editable by this session.
- Preserve unrelated existing behavior.
- Do not edit or run tests.
- Do not create fake data, placeholder metrics, dead UI or production emoji iconography.
- React Native only for mobile UI; NestJS + TypeORM for backend.
- Keep user-facing text in Spanish.
- Do not commit or push; the runner handles git.
- Finish by applying code changes, not by describing them.

TASK $($task.Id):
$taskText
"@
  Invoke-Aider $task $context $prompt $fallback
}

function Gate-With-Repair([hashtable]$task, [hashtable]$context, [string]$before) {
  for ($attempt = 0; $attempt -le $MaxCompileRepairAttempts; $attempt++) {
    $result = Invoke-Gate $task.Gate
    if ($result.Success) {
      Write-Host "GREEN: Task $($task.Id)" -ForegroundColor Green
      return
    }
    if ($attempt -eq $MaxCompileRepairAttempts) {
      Fail "Task $($task.Id) still fails after $MaxCompileRepairAttempts repair attempts."
    }

    $changed = @(Get-ChangedPaths $before | Where-Object {
      $n = $_.Replace("\","/")
      $n.StartsWith("backend/") -or $n.StartsWith("mobile/")
    })
    Assert-Paths $changed $task.Id

    $err = [string]$result.Output
    if ($err.Length -gt 12000) { $err = $err.Substring($err.Length - 12000) }

    $repairPrompt = @"
Repair ONLY the compile/type errors below for Task $($task.Id).
Make actual code changes. Keep scope limited to the editable changed production files.
Do not edit tests, broaden the feature, commit or push.

COMPILER OUTPUT:
$err
"@
    Write-Host "Compile repair $($attempt + 1)/$MaxCompileRepairAttempts..." -ForegroundColor Yellow
    Invoke-Aider $task $context $repairPrompt $false $changed
  }
}

$start = -1
for ($i = 0; $i -lt $tasks.Count; $i++) {
  if ($tasks[$i].Id -eq $StartFrom) { $start = $i; break }
}
if ($start -lt 0) { Fail "Unknown StartFrom task." }
$tasks = $tasks[$start..($tasks.Count - 1)]

Write-Host "== AGRO INTELLIGENCE NIGHT BUILD ==" -ForegroundColor Cyan
Write-Host "Runner: Aider (OpenCode removed from autonomous path)"
Write-Host "Model: ollama_chat/agro-coder"
Write-Host "Edit strategy: whole-file, architect fallback"
Write-Host "Branch: $branch"
Write-Host "Starting task: $StartFrom"
Write-Host ""

foreach ($task in $tasks) {
  Write-Host "== Task $($task.Id): $($task.File) ==" -ForegroundColor Cyan

  $before = (git rev-parse HEAD).Trim()
  $taskText = Get-Content $task.File -Raw
  $context = Get-TaskContext $task.File

  Invoke-Task $task $context $taskText $false
  Assert-Paths @(Get-ChangedPaths $before) $task.Id

  if (-not (Has-ProductionChanges $before)) {
    Write-Host "No production implementation from whole mode; retrying once with architect mode..." -ForegroundColor Yellow
    Invoke-Task $task $context $taskText $true
    Assert-Paths @(Get-ChangedPaths $before) $task.Id
  }

  if (-not (Has-ProductionChanges $before)) {
    Fail "Task $($task.Id) produced no production changes after both Aider modes."
  }

  Gate-With-Repair $task $context $before
  Assert-Paths @(Get-ChangedPaths $before) $task.Id

  git add backend mobile NIGHT_REPORT.md
  if ($task.Id -eq "18") { git add README.md }

  $staged = @(git diff --cached --name-only)
  if ($staged.Count -eq 0) { Fail "Task $($task.Id) has no staged production changes after a green gate." }

  git commit -m $task.Commit
  if ($LASTEXITCODE -ne 0) { Fail "Commit failed on Task $($task.Id)." }

  Write-Host "COMMITTED: Task $($task.Id)" -ForegroundColor Green
  Write-Host ""
}

Write-Host "== FINAL MVP COMPILE ==" -ForegroundColor Cyan
$final = Invoke-Gate "both"
if (-not $final.Success) { Fail "Final MVP compile failed." }

Write-Host "NIGHT BUILD FINISHED GREEN." -ForegroundColor Green
Write-Host "No tests were run. No push was performed."
