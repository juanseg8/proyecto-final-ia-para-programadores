$ErrorActionPreference = "Stop"

Write-Host "== Agro Intelligence local AI setup =="

if (-not (Get-Command ollama -ErrorAction SilentlyContinue)) {
  throw "Ollama is not installed or not in PATH."
}

Write-Host "Ollama version:"
ollama --version

Write-Host "Pulling Devstral Small 2 24B..."
ollama pull devstral-small-2:24b

Write-Host "Creating agro-coder with 16K context..."
ollama create agro-coder -f local-ai/Modelfile

Write-Host "Verifying agro-coder..."
ollama show agro-coder | Out-Null

Write-Host "Setup complete."
