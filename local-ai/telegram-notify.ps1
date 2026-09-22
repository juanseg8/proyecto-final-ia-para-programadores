# Telegram notification helper for Agro Intelligence Night Build.
#
# Dot-source this file from another script, then call:
#   Import-TelegramEnv
#   Send-TelegramMessage "some text"
#
# Configuration comes from environment variables TELEGRAM_BOT_TOKEN and
# TELEGRAM_CHAT_ID. Import-TelegramEnv loads them from local-ai/telegram.env
# (relative to the current location, normally the repo root) if that file
# exists. That file is gitignored on purpose: never commit real tokens.

function Import-TelegramEnv([string]$EnvFile = "local-ai/telegram.env") {
  if (-not (Test-Path $EnvFile)) {
    return
  }
  Get-Content $EnvFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -eq "" -or $line.StartsWith("#")) { return }
    $idx = $line.IndexOf("=")
    if ($idx -lt 1) { return }
    $key = $line.Substring(0, $idx).Trim()
    $value = $line.Substring($idx + 1).Trim()
    [System.Environment]::SetEnvironmentVariable($key, $value)
  }
}

function Send-TelegramMessage([string]$Text) {
  $token = $env:TELEGRAM_BOT_TOKEN
  $chatId = $env:TELEGRAM_CHAT_ID

  if ([string]::IsNullOrWhiteSpace($token) -or [string]::IsNullOrWhiteSpace($chatId)) {
    Write-Host "Telegram not configured (missing TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID); skipping notification." -ForegroundColor DarkYellow
    return
  }

  $maxLen = 3800
  if ($Text.Length -gt $maxLen) {
    $Text = $Text.Substring(0, $maxLen) + "`n...(truncado)"
  }

  $uri = "https://api.telegram.org/bot$token/sendMessage"
  $body = @{ chat_id = $chatId; text = $Text }

  try {
    Invoke-RestMethod -Uri $uri -Method Post -Body $body -TimeoutSec 15 | Out-Null
  }
  catch {
    Write-Host "Telegram notification failed: $($_.Exception.Message)" -ForegroundColor DarkYellow
  }
}

function Write-NightStatus([string]$StatusFile, [hashtable]$Status) {
  try {
    $Status["timestampUtc"] = (Get-Date).ToUniversalTime().ToString("o")
    ($Status | ConvertTo-Json -Depth 5) | Set-Content -Path $StatusFile -Encoding utf8
  }
  catch {
    Write-Host "Could not write status file: $($_.Exception.Message)" -ForegroundColor DarkYellow
  }
}
