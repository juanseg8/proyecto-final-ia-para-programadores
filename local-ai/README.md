# Local AI — Ollama + OpenCode

## Prerequisites
- Ollama installed/running
- Node/npm
- OpenCode installed globally

## Create the project model
From repository root:

```powershell
ollama pull qwen2.5-coder:7b
ollama create agro-coder -f local-ai/Modelfile
ollama run agro-coder
```

Exit with `/bye`.

Verify:
```powershell
ollama ps
```

Prefer GPU execution. If 16K context is unstable/too slow, reduce `num_ctx` in the Modelfile to 8192 and recreate the model.

## Verify OpenCode
```powershell
opencode models
```

You should see `ollama/agro-coder`.

Read-only smoke test:
```powershell
opencode run --model ollama/agro-coder "Read AGENTS.md and summarize the project rules. Do not edit files."
```

## Run overnight
Create/use a dedicated branch first, then:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/night-build.ps1
```

The night worker may create local commits but must never push.
