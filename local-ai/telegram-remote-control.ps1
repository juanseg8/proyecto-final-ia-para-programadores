param(
  [int]$PollIntervalSec = 5
)

# Run this in its own terminal window (or as a scheduled task at login) and
# leave it open. It does NOT run the build itself - it only listens on
# Telegram and launches/stops scripts/night-build-micro.ps1 for you.
#
#   powershell -ExecutionPolicy Bypass -File scripts/telegram-remote-control.ps1
#
# From your phone, message your bot:
#   /status         -> replies with the last known block/result
#   /start 10C      -> launches night-build-micro.ps1 -StartFrom 10C
#   /start          -> launches it with the default StartFrom (05)
#   /stop           -> kills the currently tracked night build process

$ErrorActionPreference = "Stop"

$repoRoot = (& git rev-parse --show-toplevel 2>$null).Trim()
if (-not $repoRoot) { throw "Not inside a git repository." }

Push-Location $repoRoot
try {
  . (Join-Path $repoRoot "local-ai/telegram-notify.ps1")
  Import-TelegramEnv (Join-Path $repoRoot "local-ai/telegram.env")

  $token = $env:TELEGRAM_BOT_TOKEN
  $allowedChatId = $env:TELEGRAM_CHAT_ID
  if ([string]::IsNullOrWhiteSpace($token) -or [string]::IsNullOrWhiteSpace($allowedChatId)) {
    throw "Configure local-ai/telegram.env first (copy local-ai/telegram.env.example)."
  }

  $offsetFile = Join-Path $env:TEMP "agro-telegram-offset.txt"
  $offset = 0
  if (Test-Path $offsetFile) {
    $raw = (Get-Content $offsetFile -Raw -ErrorAction SilentlyContinue)
    if ($raw) { $offset = [int]$raw.Trim() }
  }

  $pidFile = Join-Path $repoRoot "NIGHT_BUILD.pid"
  $statusFile = Join-Path $repoRoot "NIGHT_STATUS.json"

  Write-Host "Telegram remote control listening. Ctrl+C to stop this listener (does not stop a running build)." -ForegroundColor Cyan
  Send-TelegramMessage "Agro Night Build - control remoto activo. Comandos: /status /start [blockId] /stop"

  while ($true) {
    try {
      $uri = "https://api.telegram.org/bot$token/getUpdates?offset=$($offset + 1)&timeout=30"
      $resp = Invoke-RestMethod -Uri $uri -Method Get -TimeoutSec 40

      foreach ($u in $resp.result) {
        $offset = $u.update_id
        Set-Content -Path $offsetFile -Value $offset

        $msg = $u.message
        if (-not $msg) { continue }
        if ("$($msg.chat.id)" -ne "$allowedChatId") { continue }

        $text = ""
        if ($msg.text) { $text = $msg.text.Trim() }
        if ($text -eq "") { continue }

        Write-Host "Telegram command received: $text" -ForegroundColor DarkCyan

        if ($text -eq "/status") {
          if (Test-Path $statusFile) {
            Send-TelegramMessage (Get-Content $statusFile -Raw)
          }
          else {
            Send-TelegramMessage "Todavia no hay estado registrado (el build nunca corrio en esta maquina)."
          }
        }
        elseif ($text -eq "/start" -or $text.StartsWith("/start ")) {
          $parts = $text.Split(" ")
          $startFrom = "05"
          if ($parts.Count -gt 1 -and $parts[1].Trim() -ne "") { $startFrom = $parts[1].Trim() }

          if (Test-Path $pidFile) {
            Send-TelegramMessage "Ya hay un build en curso (o quedo un PID viejo). Mandá /stop primero si hace falta."
          }
          else {
            Send-TelegramMessage "Arrancando night build desde $startFrom..."
            $p = Start-Process -FilePath "powershell.exe" -ArgumentList @(
              "-ExecutionPolicy", "Bypass",
              "-File", "scripts/night-build-micro.ps1",
              "-StartFrom", $startFrom
            ) -WorkingDirectory $repoRoot -PassThru -WindowStyle Hidden
            Set-Content -Path $pidFile -Value $p.Id
          }
        }
        elseif ($text -eq "/stop") {
          if (Test-Path $pidFile) {
            $trackedPid = (Get-Content $pidFile -Raw).Trim()
            try {
              Stop-Process -Id ([int]$trackedPid) -Force -ErrorAction Stop
              Send-TelegramMessage "Build detenido (PID $trackedPid)."
            }
            catch {
              Send-TelegramMessage "No pude detener el PID $trackedPid, revisalo a mano en la notebook."
            }
            Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
          }
          else {
            Send-TelegramMessage "No hay ningun build en curso registrado."
          }
        }
        else {
          Send-TelegramMessage "Comando no reconocido. Usá /status, /start [blockId] o /stop."
        }
      }
    }
    catch {
      Write-Host "Polling error: $($_.Exception.Message)" -ForegroundColor DarkYellow
      Start-Sleep -Seconds $PollIntervalSec
    }
  }
}
finally {
  Pop-Location
}
