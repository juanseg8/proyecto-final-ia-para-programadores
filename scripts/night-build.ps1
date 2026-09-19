param(
  [ValidateSet("03","04","05","10","11","12","13","14","15","16","17","18")]
  [string]$StartFrom = "03",
  [int]$MaxCompileRepairAttempts = 2
)

$ErrorActionPreference = "Stop"

$branch = git branch --show-current
if (-not $branch) { throw "Not inside a git repository." }
if ($branch -eq "master" -or $branch -eq "main" -or $branch -eq "lean-agentic-refactor") { throw "Use dedicated night-build branch." }
if (git status --porcelain) { throw "Working tree is not clean." }

Write-Host "NIGHT BUILD write probes..." -ForegroundColor Cyan

# Probe 1: create a new file through OpenCode write.
$probeFile = "night-agent-write-probe.txt"
if (Test-Path $probeFile) { Remove-Item $probeFile -Force }
$probePrompt = @"
Create exactly one file at repository root named night-agent-write-probe.txt with exactly:
WRITE_OK
Use the write tool. Do not read or modify any other file. Stop immediately after creating it.
"@
& opencode run --agent build --model ollama/agro-coder --auto --title "Night Build create probe" $probePrompt
if ($LASTEXITCODE -ne 0) { throw "OpenCode create probe process failed." }
if (-not (Test-Path $probeFile)) { throw "OpenCode did not create the write probe." }
if ((Get-Content $probeFile -Raw).Trim() -ne "WRITE_OK") { throw "Create probe content is invalid." }
Remove-Item $probeFile -Force

# Probe 2: overwrite an EXISTING file through OpenCode write.
$rewriteProbe = "night-agent-rewrite-probe.txt"
Set-Content -Path $rewriteProbe -Value "REWRITE_BEFORE" -NoNewline
$rewritePrompt = @"
Read night-agent-rewrite-probe.txt, then replace the COMPLETE file using the write tool so its exact content becomes:
REWRITE_OK
The edit tool is disabled. Do not touch any other file. Stop after the write.
"@
& opencode run --agent build --model ollama/agro-coder --auto --title "Night Build overwrite probe" $rewritePrompt
if ($LASTEXITCODE -ne 0) {
  Remove-Item $rewriteProbe -Force -ErrorAction SilentlyContinue
  throw "OpenCode overwrite probe process failed."
}
if (-not (Test-Path $rewriteProbe)) { throw "OpenCode removed the overwrite probe unexpectedly." }
if ((Get-Content $rewriteProbe -Raw).Trim() -ne "REWRITE_OK") {
  Remove-Item $rewriteProbe -Force -ErrorAction SilentlyContinue
  throw "OpenCode cannot overwrite existing files through write. Night Build stopped before product work."
}
Remove-Item $rewriteProbe -Force

if (git status --porcelain) { throw "Write probes left unexpected repository changes." }
Write-Host "WRITE PROBES GREEN (create + overwrite)" -ForegroundColor Green

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

function Get-ChangedPaths([string]$before) {
  $paths=@()
  $d=git diff --name-only "$before..HEAD"; if($d){$paths+=$d}
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
  $all=@(); $ok=$true
  if($gate -eq "backend" -or $gate -eq "both"){
    Write-Host "Backend build..." -ForegroundColor Cyan
    $r=Invoke-Cmd "backend" "npm run build"
    $all += "BACKEND:" + [Environment]::NewLine + $r.Output
    if(-not $r.Success){$ok=$false}
  }
  if($ok -and ($gate -eq "mobile" -or $gate -eq "both")){
    Write-Host "Mobile TypeScript..." -ForegroundColor Cyan
    $r=Invoke-Cmd "mobile" "npx tsc --noEmit -p tsconfig.night.json"
    $all += "MOBILE:" + [Environment]::NewLine + $r.Output
    if(-not $r.Success){$ok=$false}
  }
  return @{Success=$ok;Output=($all -join [Environment]::NewLine)}
}

function Has-ProductionChanges([string]$before) {
  $paths=@(Get-ChangedPaths $before)
  return @($paths | Where-Object {
    $_.Replace("\","/").StartsWith("backend/") -or
    ($_.Replace("\","/").StartsWith("mobile/") -and -not $_.Replace("\","/").StartsWith("mobile/__tests__/"))
  }).Count -gt 0
}

function Invoke-TaskAgent([hashtable]$task,[string]$taskText,[bool]$retry) {
  if($retry){
    $instruction="A previous attempt returned without implementation. Do not explain or plan again. The edit tool is disabled: use read + write now. Rewrite complete existing files when necessary."
  } else {
    $instruction="Implement the task. Do not stop after analysis or merely describe what you will do. The edit tool is disabled: use read + write. For an existing file, read it fully and then write the complete updated file."
  }

  $prompt=@"
You are the implementation worker. Actual file changes are required unless the task is already fully implemented.
Read AGENTS.md, then only the exact files listed in the task below plus an immediate imported dependency if absolutely required.

$instruction

TASK:
$taskText

Rules:
- repository-relative paths only;
- never edit tests;
- never commit or push;
- if genuinely already implemented, append exactly:
  NO_CHANGE_NEEDED: $($task.Id) - <specific evidence>
  to NIGHT_REPORT.md.
"@

  & opencode run --agent build --model ollama/agro-coder --auto --title "Agro MVP Task $($task.Id)" $prompt
  if($LASTEXITCODE -ne 0){throw "OpenCode failed on Task $($task.Id)."}
}

function Ensure-TaskOutcome([hashtable]$task,[string]$before,[string]$taskText) {
  if(Has-ProductionChanges $before){return}

  $report=Get-Content "NIGHT_REPORT.md" -Raw
  $token="NO_CHANGE_NEEDED: $($task.Id)"
  if($report -match [regex]::Escape($token)){return}

  Write-Host "No implementation produced; retrying Task $($task.Id) once..." -ForegroundColor Yellow
  Invoke-TaskAgent $task $taskText $true

  if(Has-ProductionChanges $before){return}
  $report=Get-Content "NIGHT_REPORT.md" -Raw
  if($report -match [regex]::Escape($token)){return}

  throw "Task $($task.Id) returned twice without implementation or NO_CHANGE_NEEDED evidence."
}

function Gate-With-Repair([hashtable]$task,[string]$before) {
  for($attempt=0;$attempt -le $MaxCompileRepairAttempts;$attempt++){
    $result=Invoke-Gate $task.Gate
    if($result.Success){Write-Host "GREEN: Task $($task.Id)" -ForegroundColor Green;return}
    if($attempt -eq $MaxCompileRepairAttempts){throw "Task $($task.Id) still fails after repairs."}

    Assert-Paths @(Get-ChangedPaths $before) $task.Id
    $err=[string]$result.Output
    if($err.Length -gt 12000){$err=$err.Substring($err.Length-12000)}
    $repair=@"
Repair ONLY the compile errors below in production code changed/required by Task $($task.Id). The edit tool is disabled: read affected files and use write to replace the complete corrected file.
Do not edit tests, broaden scope, commit or push.

$err
"@
    Write-Host "Compile repair $($attempt+1)/$MaxCompileRepairAttempts..." -ForegroundColor Yellow
    & opencode run --agent build --model ollama/agro-coder --auto --title "Compile repair Task $($task.Id)" $repair
    if($LASTEXITCODE -ne 0){throw "Compile repair failed."}
  }
}

$start=-1
for($i=0;$i -lt $tasks.Count;$i++){if($tasks[$i].Id -eq $StartFrom){$start=$i;break}}
if($start -lt 0){throw "Unknown StartFrom task."}
$tasks=$tasks[$start..($tasks.Count-1)]

Write-Host "== AGRO INTELLIGENCE NIGHT BUILD =="
Write-Host "Branch: $branch"
Write-Host "Model: ollama/agro-coder"
Write-Host "Agent: build"
Write-Host "Starting task: $StartFrom"

foreach($task in $tasks){
  Write-Host ""
  Write-Host "== Task $($task.Id): $($task.File) ==" -ForegroundColor Cyan
  $before=(git rev-parse HEAD).Trim()
  $taskText=Get-Content $task.File -Raw

  Invoke-TaskAgent $task $taskText $false
  Assert-Paths @(Get-ChangedPaths $before) $task.Id
  Ensure-TaskOutcome $task $before $taskText
  Assert-Paths @(Get-ChangedPaths $before) $task.Id
  Gate-With-Repair $task $before

  git add backend mobile NIGHT_REPORT.md
  if($task.Id -eq "18"){git add README.md}
  $staged=git diff --cached --name-only
  if($staged){
    git commit -m $task.Commit
    if($LASTEXITCODE -ne 0){throw "Commit failed on Task $($task.Id)."}
  } else {
    Write-Host "Task $($task.Id) verified with no production changes." -ForegroundColor Yellow
  }
}

Write-Host ""
Write-Host "== FINAL MVP COMPILE =="
$final=Invoke-Gate "both"
if(-not $final.Success){throw "Final MVP compile failed."}
Write-Host "NIGHT BUILD FINISHED GREEN." -ForegroundColor Green
Write-Host "No tests were run. No push was performed."
