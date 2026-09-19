---
description: Task 16 F08 Agro AI
mode: primary
model: ollama/agro-coder
permission:
  glob: deny
  grep: deny
  list: deny
  bash: deny
  task: deny
  webfetch: deny
  websearch: deny
  external_directory: deny
  read:
    "*": deny
    "AGENTS.md": allow
    "OVERNIGHT-MVP.md": allow
    "MVP-EXECUTION-PLAN.md": allow
    "PROJECT-MAP.md": allow
    "NIGHT_REPORT.md": allow
    "specs/features/F08-agro-ia.md": allow
    "specs/constitution.md": allow
    "backend/src/app.module.ts": allow
    "backend/src/data-source.ts": allow
    "backend/src/establishments/establishment.service.ts": allow
    "backend/src/indicators/indicators.service.ts": allow
    "backend/src/benchmark/benchmark.service.ts": allow
    "backend/src/alerts/alerts.service.ts": allow
    "backend/src/weather/weather.service.ts": allow
    "mobile/App.tsx": allow
    "mobile/src/apiClient.ts": allow
    "mobile/src/components/index.ts": allow
    "mobile/src/theme/theme.ts": allow
    "backend/src/entities/ai-interaction.entity.ts": allow
    "backend/src/ai/ai.module.ts": allow
    "backend/src/ai/ai.controller.ts": allow
    "backend/src/ai/ai.service.ts": allow
    "backend/src/ai/ai-provider.service.ts": allow
    "backend/src/ai/ai-guardrails.service.ts": allow
    "backend/src/ai-audit/ai-audit.module.ts": allow
    "backend/src/ai-audit/ai-audit.service.ts": allow
    "mobile/src/screens/AgroAiScreen.tsx": allow
  edit:
    "*": deny
    "backend/src/app.module.ts": allow
    "backend/src/data-source.ts": allow
    "backend/src/entities/ai-interaction.entity.ts": allow
    "backend/src/ai/ai.module.ts": allow
    "backend/src/ai/ai.controller.ts": allow
    "backend/src/ai/ai.service.ts": allow
    "backend/src/ai/ai-provider.service.ts": allow
    "backend/src/ai/ai-guardrails.service.ts": allow
    "backend/src/ai-audit/ai-audit.module.ts": allow
    "backend/src/ai-audit/ai-audit.service.ts": allow
    "backend/src/db/migrations/1790000003000-F08AiAudit.ts": allow
    "mobile/src/screens/AgroAiScreen.tsx": allow
    "mobile/App.tsx": allow
    "mobile/src/apiClient.ts": allow
    "mobile/src/components/index.ts": allow
    "NIGHT_REPORT.md": allow
---

Execute exactly the supplied task.

Hard rules:
- Repository root is already the working directory.
- Use only repository-relative paths copied verbatim from the task.
- Never Read a directory.
- Never invent or search for a path.
- Never use Glob/Grep/List/Bash/web/subagents.
- Never read or edit tests.
- Do not commit or push.
- TypeScript/build being green before edits is not task completion.
- If the requested behavior is already fully implemented, write NO_CHANGE_NEEDED with concrete evidence in NIGHT_REPORT.md.
- Otherwise implement the task now, update NIGHT_REPORT.md, and stop.
