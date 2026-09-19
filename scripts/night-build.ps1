param(
  [ValidateSet("02","03","04","05")]
  [string]$StartFrom = "02",
  [int]$MaxCompileRepairAttempts = 2
)

$ErrorActionPreference = "Stop"

$branch = git branch --show-current
if (-not $branch) { throw "Not inside a git repository." }
if ($branch -eq "master" -or $branch -eq "main" -or $branch -eq "lean-agentic-refactor") {
  throw "Run Night Build only on a dedicated night-build branch."
}

if (git status --porcelain) {
  throw "Working tree is not clean. Commit or discard existing work first."
}

$tasks = @(
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

    $allowed =
      $normalized -eq "NIGHT_REPORT.md" -or
      ($normalized.StartsWith("mobile/") -and -not $normalized.StartsWith("mobile/__tests__/"))

    if (-not $allowed) {
      $forbidden += $normalized
    }
  }

  if ($forbidden.Count -gt 0) {
    Write-Host "FORBIDDEN PATH CHANGES:" -ForegroundColor Red
    $forbidden | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
    throw "Night Build stopped because a forbidden path was changed."
  }
}

function Invoke-MobileTypeScript {
  Push-Location mobile
  try {
    Write-Host "Running TypeScript..." -ForegroundColor Cyan

    $oldPreference = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    $output = @(& npx tsc --noEmit 2>&1)
    $exitCode = $LASTEXITCODE
    $ErrorActionPreference = $oldPreference

    $output | ForEach-Object { Write-Host $_ }

    return @{
      Success = ($exitCode -eq 0)
      Output = ($output -join [Environment]::NewLine)
    }
  }
  finally {
    Pop-Location
  }
}

function Repair-Compile([string]$label, [string]$baselineSha) {
  for ($attempt = 0; $attempt -le $MaxCompileRepairAttempts; $attempt++) {
    $result = Invoke-MobileTypeScript

    if ($result.Success) {
      Write-Host "TypeScript GREEN: $label" -ForegroundColor Green
      return
    }

    if ($attempt -eq $MaxCompileRepairAttempts) {
      throw "TypeScript still fails after $MaxCompileRepairAttempts repair attempts: $label"
    }

    Assert-AllowedPaths @(Get-ChangedPaths $baselineSha)

    $compilerOutput = [string]$result.Output
    if ($compilerOutput.Length -gt 10000) {
      $compilerOutput = $compilerOutput.Substring($compilerOutput.Length - 10000)
    }

    Write-Host "Compile repair $($attempt + 1)/$MaxCompileRepairAttempts: $label" -ForegroundColor Yellow

    $repairPrompt = @"
The current Night Build task does not compile.

Task: $label

TypeScript compiler output:
----------------
$compilerOutput
----------------

Repair ONLY these TypeScript compilation errors.

Rules:
- production code only under mobile/;
- NEVER inspect or edit mobile/__tests__/;
- do not add testing libraries;
- do not broaden the feature;
- preserve existing F01/F02 behavior/contracts;
- do not commit or push;
- stop when the smallest credible compile repair is made.
"@

    & opencode run --agent compile-repairer --model ollama/agro-coder --auto --title "Compile repair $label" $repairPrompt

    if ($LASTEXITCODE -ne 0) {
      throw "Compile repair agent failed for $label."
    }

    Assert-AllowedPaths @(Get-ChangedPaths $baselineSha)
  }
}

$startIndex = -1
for ($i = 0; $i -lt $tasks.Count; $i++) {
  if ($tasks[$i].Id -eq $StartFrom) {
    $startIndex = $i
    break
  }
}

if ($startIndex -lt 0) {
  throw "Unknown StartFrom task: $StartFrom"
}

$tasks = $tasks[$startIndex..($tasks.Count - 1)]

Write-Host "== Agro Intelligence NIGHT BUILD V7 =="
Write-Host "Branch: $branch"
Write-Host "Model: ollama/agro-coder"
Write-Host "Gate: TypeScript only (no Jest)"
Write-Host "Starting from task: $StartFrom"

foreach ($task in $tasks) {
  Write-Host ""
  Write-Host "== Task $($task.Id): $($task.File) ==" -ForegroundColor Cyan

  $before = (git rev-parse HEAD).Trim()
  $taskPrompt = Get-Content $task.File -Raw

  $prompt = @"
Read AGENTS.md and OVERNIGHT-MVP.md.
Execute exactly this one task:

$taskPrompt

Do not read or edit tests.
Do not continue to another task.
Do not commit or push.
"@

  & opencode run --agent night-builder --model ollama/agro-coder --auto --title "Agro Night Task $($task.Id)" $prompt

  if ($LASTEXITCODE -ne 0) {
    throw "OpenCode failed during Task $($task.Id)."
  }

  Assert-AllowedPaths @(Get-ChangedPaths $before)
  Repair-Compile "Task $($task.Id)" $before

  git add mobile NIGHT_REPORT.md

  $staged = git diff --cached --name-only
  if ($staged) {
    git commit -m $task.Commit
    if ($LASTEXITCODE -ne 0) {
      throw "Commit failed for Task $($task.Id)."
    }
  } else {
    Write-Host "Task $($task.Id) produced no changes."
  }
}

Write-Host ""
Write-Host "== Final TypeScript gate ==" -ForegroundColor Cyan

$final = Invoke-MobileTypeScript
if (-not $final.Success) {
  throw "Final TypeScript gate failed."
}

Write-Host ""
Write-Host "NIGHT BUILD V7 finished." -ForegroundColor Green
Write-Host "No Jest was run. No push was performed."
