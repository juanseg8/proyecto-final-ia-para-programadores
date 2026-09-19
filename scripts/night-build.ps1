param(
  [ValidateSet("01A","01B","02","03","04","05")]
  [string]$StartFrom = "01A"
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
  @{ Id = "01A"; File = "night-tasks/01a-home-login-encoding.md"; Commit = "night: fix Home and Login encoding"; Tests = @("__tests__/HomeScreen.test.tsx","__tests__/LoginScreen.test.tsx") },
  @{ Id = "01B"; File = "night-tasks/01b-establishment-encoding.md"; Commit = "night: fix establishment screen encoding"; Tests = @("__tests__/EstablishmentListScreen.test.tsx","__tests__/EstablishmentDetailScreen.test.tsx","__tests__/EstablishmentFormScreen.test.tsx","__tests__/RegisterScreen.test.tsx","__tests__/MapLocationPicker.test.tsx") },
  @{ Id = "02"; File = "night-tasks/02-navigation-refresh.md"; Commit = "night: stabilize establishment navigation and refresh"; Tests = @("__tests__/EstablishmentNavigationRefresh.test.tsx","__tests__/navigation.test.tsx","__tests__/EstablishmentListScreen.test.tsx","__tests__/EstablishmentDetailScreen.test.tsx","__tests__/EstablishmentFormScreen.test.tsx") },
  @{ Id = "03"; File = "night-tasks/03-georef-searchable-select.md"; Commit = "night: consolidate GeoRef searchable selectors"; Tests = @("__tests__/georefService.test.ts","__tests__/EstablishmentFormScreen.test.tsx","__tests__/components.test.tsx") },
  @{ Id = "04"; File = "night-tasks/04-ui-foundation-cleanup.md"; Commit = "night: normalize mobile UI foundation"; Tests = @("__tests__/HomeScreen.test.tsx","__tests__/LoginScreen.test.tsx","__tests__/RegisterScreen.test.tsx","__tests__/EstablishmentListScreen.test.tsx","__tests__/EstablishmentDetailScreen.test.tsx","__tests__/components.test.tsx","__tests__/theme.test.ts") },
  @{ Id = "05"; File = "night-tasks/05-map-sanity.md"; Commit = "night: harden map flow code"; Tests = @("__tests__/MapLocationPicker.test.tsx","__tests__/EstablishmentFormScreen.test.tsx") }
)

$startIndex = -1
for ($i = 0; $i -lt $tasks.Count; $i++) {
  if ($tasks[$i].Id -eq $StartFrom) { $startIndex = $i; break }
}
if ($startIndex -lt 0) { throw "Unknown StartFrom task: $StartFrom" }
$tasks = $tasks[$startIndex..($tasks.Count - 1)]

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

function Run-MobileGate([string[]]$testFiles) {
  Push-Location mobile
  try {
    Write-Host "Running TypeScript gate..."
    npx tsc --noEmit
    if ($LASTEXITCODE -ne 0) { throw "TypeScript gate failed." }

    Write-Host "Running focused Jest gate..."
    npx jest --runInBand --runTestsByPath @testFiles
    if ($LASTEXITCODE -ne 0) { throw "Focused Jest gate failed." }
  }
  finally {
    Pop-Location
  }
}

Write-Host "== Agro Intelligence NIGHT BUILD V4 =="
Write-Host "Branch: $branch"
Write-Host "Model: ollama/agro-coder"
Write-Host "Scope: mobile/ only, one small task per OpenCode run"
Write-Host "Starting from task: $StartFrom"

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
  if ($LASTEXITCODE -ne 0) {
    throw "OpenCode failed during task $($task.Id)."
  }

  $paths = @(Get-ChangedPaths $before)
  Assert-AllowedPaths $paths
  Run-MobileGate $task.Tests

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
Write-Host "== Final full mobile gate ==" -ForegroundColor Cyan
Push-Location mobile
try {
  npx tsc --noEmit
  if ($LASTEXITCODE -ne 0) { throw "Final TypeScript gate failed." }

  npx jest --runInBand
  if ($LASTEXITCODE -ne 0) { throw "Final Jest gate failed." }
}
finally {
  Pop-Location
}

Write-Host ""
Write-Host "NIGHT BUILD V4 finished." -ForegroundColor Green
Write-Host "No push was performed."
