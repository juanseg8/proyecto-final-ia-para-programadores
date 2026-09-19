$ErrorActionPreference = "Stop"

$branch = git branch --show-current
if (-not $branch) { throw "Not inside a git repository." }

$status = git status --porcelain
if ($status) {
  throw "Working tree is not clean. Commit or stash changes before NIGHT_BUILD."
}

if ($branch -eq "master" -or $branch -eq "main") {
  throw "Do not run NIGHT_BUILD directly on master/main. Create a dedicated branch first."
}

Write-Host "Starting NIGHT_BUILD on branch $branch"
Write-Host "Model: ollama/agro-coder"

opencode run --agent night-builder --model ollama/agro-coder --auto --title "Agro Intelligence Night Build" "Execute OVERNIGHT-MVP.md from the current repository. Work autonomously and sequentially. Keep NIGHT_REPORT.md updated. Create local commits only for GREEN slices. Never push. Continue until the plan is exhausted or only blocked tasks remain."
