param(
  [ValidateSet("02","03","04","05","10","11","12","13","14","15","16","17","18")]
  [string]$StartFrom = "02",
  [int]$MaxCompileRepairAttempts = 2
)

$ErrorActionPreference = "Stop"

$branch = git branch --show-current
if (-not $branch) { throw "Not inside a git repository." }
if ($branch -eq "master" -or $branch -eq "main" -or $branch -eq "lean-agentic-refactor") { throw "Use dedicated night-build branch." }
if (git status --porcelain) { throw "Working tree is not clean." }

$tasks = @(
  @{ Id="02"; File="night-tasks/02-navigation-refresh.md"; Gate="mobile"; Commit="night: stabilize F02 navigation and refresh" },
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

function Get-ChangedPaths([string]$before) {
  $paths=@()
  $d=git diff --name-only "$before..HEAD"
  if($d){$paths+=$d}
  foreach($line in (git status --porcelain)){
    if($line.Length -lt 4){continue}
    $p=$line.Substring(3).Trim()
    if($p -match " -> "){$p=($p -split " -> ")[-1]}
    $paths+=$p
  }
  return $paths | Where-Object {$_} | Sort-Object -Unique
}

function Assert-Paths([string[]]$paths,[string]$taskId) {
  $bad=@()
  foreach($p in $paths){
    $n=$p.Replace("\","/")
    $ok=$n -eq "NIGHT_REPORT.md" -or
      ($n.StartsWith("backend/") -and -not $n.Contains(".spec.ts") -and -not $n.StartsWith("backend/test/")) -or
      ($n.StartsWith("mobile/") -and -not $n.StartsWith("mobile/__tests__/")) -or
      ($taskId -eq "18" -and $n -eq "README.md")
    if(-not $ok){$bad+=$n}
  }
  if($bad.Count -gt 0){
    $bad | ForEach-Object { Write-Host "FORBIDDEN: $_" -ForegroundColor Red }
    throw "Forbidden path changed."
  }
}

function Invoke-Cmd([string]$working,[string]$command) {
  Push-Location $working
  try {
    $out=@(& cmd.exe /d /s /c "$command 2>&1")
    $code=$LASTEXITCODE
    $out | ForEach-Object { Write-Host $_ }
    return @{Success=($code -eq 0);Output=($out -join [Environment]::NewLine)}
  } finally { Pop-Location }
}

function Invoke-Gate([string]$gate) {
  $all=@()
  $ok=$true
  if($gate -eq "backend" -or $gate -eq "both"){
    Write-Host "Backend build..." -ForegroundColor Cyan
    $r=Invoke-Cmd "backend" "npm run build"
    $all += "BACKEND:" + [Environment]::NewLine + $r.Output
    if(-not $r.Success){$ok=$false}
  }
  if($ok -and ($gate -eq "mobile" -or $gate -eq "both")){
    Write-Host "Mobile TypeScript..." -ForegroundColor Cyan
    $r=Invoke-Cmd "mobile" "npx tsc --noEmit"
    $all += "MOBILE:" + [Environment]::NewLine + $r.Output
    if(-not $r.Success){$ok=$false}
  }
  return @{Success=$ok;Output=($all -join [Environment]::NewLine)}
}

function Gate-With-Repair([string]$label,[string]$gate,[string]$before,[string]$taskId) {
  for($attempt=0;$attempt -le $MaxCompileRepairAttempts;$attempt++){
    $result=Invoke-Gate $gate
    if($result.Success){Write-Host "GREEN: $label" -ForegroundColor Green;return}
    if($attempt -eq $MaxCompileRepairAttempts){throw "$label still fails after compile repair attempts."}
    Assert-Paths @(Get-ChangedPaths $before) $taskId
    $err=[string]$result.Output
    if($err.Length -gt 12000){$err=$err.Substring($err.Length-12000)}
    Write-Host "Compile repair $($attempt+1)/$MaxCompileRepairAttempts" -ForegroundColor Yellow
    $prompt=@"
Task: $label
Gate: $gate

Compiler output:
----------------
$err
----------------

Repair only these compilation errors. Do not touch tests, specs or unrelated features. Do not commit or push.
"@
    & opencode run --agent compile-repairer --model ollama/agro-coder --auto --title "Compile repair $label" $prompt
    if($LASTEXITCODE -ne 0){throw "Compile repair agent failed."}
  }
}



function Retry-NoChangeTask([hashtable]$task,[string]$before) {
  $paths = @(Get-ChangedPaths $before)
  $production = @($paths | Where-Object {
    $_.Replace("\\","/").StartsWith("backend/") -or
    ($_.Replace("\\","/").StartsWith("mobile/") -and -not $_.Replace("\\","/").StartsWith("mobile/__tests__/"))
  })

  $report = ""
  if (Test-Path "NIGHT_REPORT.md") { $report = Get-Content "NIGHT_REPORT.md" -Raw }
  $token = "NO_CHANGE_NEEDED: $($task.Id)"

  if ($production.Count -gt 0 -or $report -match [regex]::Escape($token)) {
    return
  }

  Write-Host "Task $($task.Id) returned no implementation. Retrying once with explicit completion instructions..." -ForegroundColor Yellow
  $taskText = Get-Content $task.File -Raw

  $retryPrompt = @"
You already inspected the exact files for Task $($task.Id) but returned without implementing or reporting completion.

Execute the task NOW.

$taskText

Rules:
- use only repository-relative paths from PROJECT-MAP.md;
- do not read directories or tests;
- do not repeat broad analysis;
- if work is required, edit the production files now;
- if the requested behavior is already fully implemented, update NIGHT_REPORT.md with:
  NO_CHANGE_NEEDED: $($task.Id) - <specific evidence from the files>
- do not commit or push;
- stop only after one of those two outcomes.
"@

  & opencode run --agent night-builder --model ollama/agro-coder --auto --title "Agro MVP Task $($task.Id) completion retry" $retryPrompt
  if ($LASTEXITCODE -ne 0) { throw "OpenCode completion retry failed on Task $($task.Id)." }
  Assert-Paths @(Get-ChangedPaths $before) $task.Id
}

function Assert-TaskCompletion([string]$before,[string]$taskId) {
  $paths = @(Get-ChangedPaths $before)
  $production = @($paths | Where-Object {
    $_.Replace("\\","/").StartsWith("backend/") -or
    ($_.Replace("\\","/").StartsWith("mobile/") -and -not $_.Replace("\\","/").StartsWith("mobile/__tests__/"))
  })

  if ($production.Count -gt 0) {
    return
  }

  $report = ""
  if (Test-Path "NIGHT_REPORT.md") {
    $report = Get-Content "NIGHT_REPORT.md" -Raw
  }

  $token = "NO_CHANGE_NEEDED: $taskId"
  if ($report -match [regex]::Escape($token)) {
    Write-Host "Task $taskId explicitly verified as already implemented." -ForegroundColor Yellow
    return
  }

  throw "Task $taskId produced no production changes and did not record '$token' with a reason. Treating this as incomplete instead of silently continuing."
}

$start=-1
for($i=0;$i -lt $tasks.Count;$i++){if($tasks[$i].Id -eq $StartFrom){$start=$i;break}}
if($start -lt 0){throw "Unknown StartFrom task."}
$tasks=$tasks[$start..($tasks.Count-1)]

Write-Host "== AGRO INTELLIGENCE NIGHT BUILD V8 FULL MVP =="
Write-Host "Branch: $branch"
Write-Host "Model: ollama/agro-coder"
Write-Host "No Jest. Product code + compile gates."
Write-Host "Starting task: $StartFrom"

foreach($task in $tasks){
  Write-Host ""
  Write-Host "== Task $($task.Id): $($task.File) ==" -ForegroundColor Cyan
  $before=(git rev-parse HEAD).Trim()
  $taskText=Get-Content $task.File -Raw
  $prompt=@"
Read AGENTS.md, OVERNIGHT-MVP.md, MVP-EXECUTION-PLAN.md, PROJECT-MAP.md and the relevant feature spec.
Execute exactly this task:

$taskText

Use only repository-relative paths copied verbatim from the task and PROJECT-MAP.md.
Never construct absolute Windows paths and never Read a directory.
Do not search for alternate tasks. Do not read or edit tests. Do not commit or push.
"@
  & opencode run --agent night-builder --model ollama/agro-coder --auto --title "Agro MVP Task $($task.Id)" $prompt
  if($LASTEXITCODE -ne 0){throw "OpenCode failed on Task $($task.Id)."}

  Assert-Paths @(Get-ChangedPaths $before) $task.Id
  Retry-NoChangeTask $task $before
  Assert-TaskCompletion $before $task.Id
  Gate-With-Repair "Task $($task.Id)" $task.Gate $before $task.Id

  git add backend mobile NIGHT_REPORT.md
  if($task.Id -eq "18"){git add README.md}
  $staged=git diff --cached --name-only
  if($staged){
    git commit -m $task.Commit
    if($LASTEXITCODE -ne 0){throw "Commit failed on Task $($task.Id)."}
  } else {Write-Host "Task $($task.Id) produced no changes."}
}

Write-Host ""
Write-Host "== FINAL MVP COMPILE =="
$final=Invoke-Gate "both"
if(-not $final.Success){throw "Final MVP compile failed."}
Write-Host "NIGHT BUILD V8 FINISHED GREEN." -ForegroundColor Green
Write-Host "No tests were run. No push was performed."
