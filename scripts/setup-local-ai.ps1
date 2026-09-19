$ErrorActionPreference = "Stop"

Write-Host "== Agro Intelligence local AI setup =="

if (-not (Get-Command ollama -ErrorAction SilentlyContinue)) {
  throw "Ollama is not installed or not in PATH."
}
if (-not (Get-Command opencode -ErrorAction SilentlyContinue)) {
  throw "OpenCode is not installed or not in PATH."
}

Write-Host "Ollama version:"
ollama --version

Write-Host "Pulling Devstral Small 2 24B..."
ollama pull devstral-small-2:24b

Write-Host "Creating agro-coder with 8K context..."
ollama create agro-coder -f local-ai/Modelfile

Write-Host "Available OpenCode models:"
opencode models

Write-Host "Setup complete."
