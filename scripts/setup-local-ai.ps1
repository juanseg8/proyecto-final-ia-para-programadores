$ErrorActionPreference = "Stop"

Write-Host "== Agro Intelligence local AI setup =="

if (-not (Get-Command ollama -ErrorAction SilentlyContinue)) {
  throw "Ollama is not installed or not in PATH."
}
if (-not (Get-Command opencode -ErrorAction SilentlyContinue)) {
  throw "OpenCode is not installed or not in PATH."
}

Write-Host "Pulling base model..."
ollama pull qwen2.5-coder:7b

Write-Host "Creating agro-coder with 16K context..."
ollama create agro-coder -f local-ai/Modelfile

Write-Host "Available OpenCode models:"
opencode models

Write-Host "Setup complete. Run the read-only smoke test from local-ai/README.md before NIGHT_BUILD."
