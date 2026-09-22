$ErrorActionPreference = "Stop"

Write-Host "== Agro Intelligence local AI setup =="

if (-not (Get-Command ollama -ErrorAction SilentlyContinue)) {
  throw "Ollama is not installed or not in PATH."
}

Write-Host "Ollama version:"
ollama --version

Write-Host "Pulling Qwen2.5-Coder 7B (worker base)..."
ollama pull qwen2.5-coder:7b

Write-Host "Pulling DeepSeek-Coder 6.7B (rescue model)..."
ollama pull deepseek-coder:6.7b

Write-Host "Creating agro-coder with 8K context..."
ollama create agro-coder -f local-ai/Modelfile

Write-Host "Verifying agro-coder..."
ollama show agro-coder | Out-Null

Write-Host "Verifying rescue model..."
ollama show deepseek-coder:6.7b | Out-Null

Write-Host "Setup complete. Worker: agro-coder (qwen2.5-coder:7b, 8k ctx). Rescue: deepseek-coder:6.7b (8k ctx)."
