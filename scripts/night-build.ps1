param(
  [ValidateSet("02","03","04","05")]
  [string]$StartFrom = "02",
  [int]$MaxRepairAttempts = 3
)

$ErrorActionPreference = "Stop"

$branch = git branch --show-current
if (-not $branch) { throw "Not inside a git repository." }
if ($branch -eq "master" -or $branch -eq "main" -or $branch -eq "lean-agentic-refactor") {
  throw "Run Night Build only on a dedicated night-build branch."
}

if (git status --porcelain) {
  throw "Working tree is not clean. Commit/discard existing work first."
}

$tasks = @(
  @{ Id = "02"; File = "night-tasks/02-navigation-refresh.md"; Commit = "night: stabilize establishment navigation and refresh"; Tests = @("__tests__/EstablishmentNavigationRefresh.test.tsx","__tests__/navigation.test.tsx","__tests__/EstablishmentListScreen.test.tsx","__tests__/EstablishmentDetailScreen.test.tsx","__tests__/EstablishmentFormScreen.test.tsx") },
  @{ Id = "03"; File = "night-tasks/03-georef-searchable-select.md"; Commit = "night: consolidate GeoRef searchable selectors"; Tests = @("__tests__/georefService.test.ts","__tests__/EstablishmentFormScreen.test.tsx","__tests__/components.test.tsx") },
  @{ Id = "04"; File = "night-tasks/04-ui-foundation-cleanup.md"; Commit = "night: normalize mobile UI foundation"; Tests = @("__tests__/HomeScreen.test.tsx","__tests__/LoginScreen.test.tsx","__tests__/RegisterScreen.test.tsx","__tests__/EstablishmentListScreen.test.tsx","__tests__/EstablishmentDetailScreen.test.tsx","__tests__/components.test.tsx","__tests__/theme.test.ts") },
  @{ Id = "05"; File = "night-tasks/05-map-sanity.md"; Commit = "night: harden map flow code"; Tests = @("__tests__/MapLocationPicker.test.tsx","__tests__/EstablishmentFormScreen.test.tsx") }
)

function Get-ChangedPaths([string]$beforeSha) {
  $paths = @()
  $committed = git diff --name-only "$beforeSha..HEAD"
  if ($committed) { $paths += $committed }
  $status = git status --porcelain
  foreach ($line in $status) {
    if ($line.Length -lt 4) { continue }
    $p = $line.Substring(3).Trim()
    if ($p -match " -> ") { $p = ($p -split " -> ")[-1] }
    $paths += $p
  }
  return $paths | Where-Object { $_ } | Sort-Object -Unique
}

function Assert-AllowedPaths([string[]]$paths) {
  $forbidden = @()
  foreach ($p in $paths) {
    $normalized = $p.Replace("\", "/")
    $allowed = $normalized.StartsWith("mobile/") -or $normalized -eq "NIGHT_REPORT.md"
    if (-not $allowed) { $forbidden += $normalized }
  }
  if ($forbidden.Count -gt 0) {
    Write-Host "FORBIDDEN PATH CHANGES DETECTED:" -ForegroundColor Red
    $forbidden | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
    throw "Night Build stopped because the agent changed files outside the allowlist."
  }
}

function Invoke-MobileGate([string[]]$testFiles, [bool]$fullSuite) {
  Push-Location mobile
  try {
    $allOutput = @()
    Write-Host "Running TypeScript gate..."
    $ts = @(& npx tsc --noEmit 2>&1)
    $tsCode = $LASTEXITCODE
    $ts | ForEach-Object { Write-Host $_ }
    $allOutput += $ts
    if ($tsCode -ne 0) {
      return @{ Success = $false; Stage = "typescript"; Output = ($allOutput -join [Environment]::NewLine) }
    }

    Write-Host "Running Jest gate..."
    if ($fullSuite) {
      $jest = @(& npx jest --runInBand 2>&1)
    } else {
      $jest = @(& npx jest --runInBand --runTestsByPath @testFiles 2>&1)
    }
    $jestCode = $LASTEXITCODE
    $jest | ForEach-Object { Write-Host $_ }
    $allOutput += $jest
    return @{ Success = ($jestCode -eq 0); Stage = "jest"; Output = ($allOutput -join [Environment]::NewLine) }
  } finally {
    Pop-Location
  }
}

function Run-GateWithAutoRepair([string]$label, [string[]]$testFiles, [string]$baselineSha, [bool]$fullSuite = $false) {
  for ($attempt = 0; $attempt -le $MaxRepairAttempts; $attempt++) {
    $gate = Invoke-MobileGate $testFiles $fullSuite
    if ($gate.Success) {
      Write-Host "GREEN: $label" -ForegroundColor Green
      return
    }

    if ($attempt -eq $MaxRepairAttempts) {
      throw "$label is still failing after $MaxRepairAttempts repair attempts."
    }

    Assert-AllowedPaths @(Get-ChangedPaths $baselineSha)

    $failure = [string]$gate.Output
    if ($failure.Length -gt 12000) {
      $failure = $failure.Substring($failure.Length - 12000)
    }

    $scope = if ($fullSuite) { "full mobile test suite" } else { $testFiles -join ", " }
    Write-Host "AUTO-REPAIR $($attempt + 1)/$MaxRepairAttempts for $label" -ForegroundColor Yellow

    $repairPrompt = @"
A validation gate failed.

Label: $label
Stage: $($gate.Stage)
Tests: $scope

Failure log:
$failure

Repair this autonomously.
- Work only under mobile/ and NIGHT_REPORT.md.
- Fix product code when product code is wrong.
- Fix the test when the test is invalid/incompatible.
- Preserve meaningful assertions and behavior.
- Do not skip or delete tests just to get green.
- Do not commit or push.
- Make the smallest credible repair, then stop.
"@

    & opencode run --agent test-repairer --model ollama/agro-coder --auto --title "Repair $label" $repairPrompt
    if ($LASTEXITCODE -ne 0) { throw "Repair agent failed for $label." }
    Assert-AllowedPaths @(Get-ChangedPaths $baselineSha)
  }
}

Write-Host "== Agro Intelligence NIGHT BUILD V6 =="
Write-Host "Branch: $branch"
Write-Host "Model: ollama/agro-coder"
Write-Host "Automatic repair attempts per gate: $MaxRepairAttempts"
Write-Host ""

Write-Host "== Deterministic text/encoding cleanup ==" -ForegroundColor Cyan
$cleanupBefore = (git rev-parse HEAD).Trim()
& node scripts/fix-mobile-text.mjs
if ($LASTEXITCODE -ne 0) { throw "Text normalization failed." }
Assert-AllowedPaths @(Get-ChangedPaths $cleanupBefore)

Run-GateWithAutoRepair "encoding cleanup" @("__tests__/HomeScreen.test.tsx","__tests__/LoginScreen.test.tsx","__tests__/EstablishmentListScreen.test.tsx","__tests__/RegisterScreen.test.tsx") $cleanupBefore $false

git add mobile NIGHT_REPORT.md
$cleanupStaged = git diff --cached --name-only
if ($cleanupStaged) {
  git commit -m "night: normalize mobile text encoding"
  if ($LASTEXITCODE -ne 0) { throw "Encoding cleanup commit failed." }
}

$startIndex = -1
for ($i = 0; $i -lt $tasks.Count; $i++) {
  if ($tasks[$i].Id -eq $StartFrom) { $startIndex = $i; break }
}
if ($startIndex -lt 0) { throw "Unknown StartFrom task: $StartFrom" }
$tasks = $tasks[$startIndex..($tasks.Count - 1)]

foreach ($task in $tasks) {
  Write-Host ""
  Write-Host "== Task $($task.Id): $($task.File) ==" -ForegroundColor Cyan
  $before = (git rev-parse HEAD).Trim()
  $taskPrompt = Get-Content $task.File -Raw

  $prompt = @"
Read AGENTS.md and OVERNIGHT-MVP.md first.
Then execute exactly this task:

$taskPrompt

IMPORTANT:
- Do not glob the repository.
- Do not inspect files outside the exact list in the task.
- Do not reread unchanged files.
- This is one isolated task.
- Do not continue to another task.
- Do not commit or push.
"@

  & opencode run --agent night-builder --model ollama/agro-coder --auto --title "Agro Night Task $($task.Id)" $prompt
  if ($LASTEXITCODE -ne 0) { throw "OpenCode failed during task $($task.Id)." }

  Assert-AllowedPaths @(Get-ChangedPaths $before)
  Run-GateWithAutoRepair "Task $($task.Id)" $task.Tests $before $false

  git add mobile NIGHT_REPORT.md
  $staged = git diff --cached --name-only
  if ($staged) {
    git commit -m $task.Commit
    if ($LASTEXITCODE -ne 0) { throw "Commit failed for task $($task.Id)." }
  } else {
    Write-Host "Task $($task.Id) produced no tracked changes."
  }
}

Write-Host ""
Write-Host "== Final full mobile gate with auto-repair ==" -ForegroundColor Cyan
$finalBefore = (git rev-parse HEAD).Trim()
Run-GateWithAutoRepair "final full mobile suite" @() $finalBefore $true

git add mobile NIGHT_REPORT.md
$finalStaged = git diff --cached --name-only
if ($finalStaged) {
  git commit -m "night: repair final mobile gate"
  if ($LASTEXITCODE -ne 0) { throw "Final repair commit failed." }
}

Write-Host ""
Write-Host "NIGHT BUILD V6 finished GREEN." -ForegroundColor Green
Write-Host "No push was performed."
