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
  @{ Id = "01A"; File = "night-tasks/01a-home-login-encoding.md"; Commit = "night: fix Home and Login encoding" },
  @{ Id = "01B"; File = "night-tasks/01b-establishment-encoding.md"; Commit = "night: fix establishment screen encoding" },
  @{ Id = "02"; File = "night-tasks/02-navigation-refresh.md"; Commit = "night: stabilize establishment navigation and refresh" },
  @{ Id = "03"; File = "night-tasks/03-georef-searchable-select.md"; Commit = "night: consolidate GeoRef searchable selectors" },
  @{ Id = "04"; File = "night-tasks/04-ui-foundation-cleanup.md"; Commit = "night: normalize mobile UI foundation" },
  @{ Id = "05"; File = "night-tasks/05-map-sanity.md"; Commit = "night: harden map flow code" }
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

function Run-MobileGate {
  Push-Location mobile
  try {
    Write-Host "Running TypeScript gate..."
    npx tsc --noEmit
    if ($LASTEXITCODE -ne 0) { throw "TypeScript gate failed." }

    Write-Host "Running Jest gate..."
    npx jest --runInBand
    if ($LASTEXITCODE -ne 0) { throw "Jest gate failed." }
  }
  finally {
    Pop-Location
  }
}

Write-Host "== Agro Intelligence NIGHT BUILD V3 =="
Write-Host "Branch: $branch"
Write-Host "Model: ollama/agro-coder"
Write-Host "Scope: mobile/ only, one small task per OpenCode run"

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
  Run-MobileGate

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
Write-Host "== Final mobile gate ==" -ForegroundColor Cyan
Run-MobileGate

Write-Host ""
Write-Host "NIGHT BUILD V3 finished." -ForegroundColor Green
Write-Host "No push was performed."
