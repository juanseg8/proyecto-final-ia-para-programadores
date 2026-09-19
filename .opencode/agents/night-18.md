---
description: Task 18 MVP integration polish
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
    "specs/000-index.md": allow
    "README.md": allow
    "backend/src/app.module.ts": allow
    "backend/src/data-source.ts": allow
    "backend/.env.example": allow
    "mobile/App.tsx": allow
    "mobile/src/apiClient.ts": allow
    "mobile/.env.example": allow
    "backend/src/entities/herd.entity.ts": allow
    "backend/src/entities/animal.entity.ts": allow
    "backend/src/entities/weighing.entity.ts": allow
    "backend/src/entities/livestock-event.entity.ts": allow
    "backend/src/entities/indicator-snapshot.entity.ts": allow
    "backend/src/entities/benchmark-snapshot.entity.ts": allow
    "backend/src/entities/ai-interaction.entity.ts": allow
    "backend/src/livestock/**": allow
    "backend/src/indicators/**": allow
    "backend/src/benchmark/**": allow
    "backend/src/alerts/**": allow
    "backend/src/weather/**": allow
    "backend/src/ai/**": allow
    "backend/src/ai-audit/**": allow
    "backend/src/dashboard/**": allow
    "mobile/src/screens/**": allow
    "mobile/src/components/**": allow
    "mobile/src/theme/theme.ts": allow
  edit:
    "*": deny
    "README.md": allow
    "backend/src/app.module.ts": allow
    "backend/src/data-source.ts": allow
    "backend/.env.example": allow
    "backend/src/livestock/**": allow
    "backend/src/indicators/**": allow
    "backend/src/benchmark/**": allow
    "backend/src/alerts/**": allow
    "backend/src/weather/**": allow
    "backend/src/ai/**": allow
    "backend/src/ai-audit/**": allow
    "backend/src/dashboard/**": allow
    "mobile/App.tsx": allow
    "mobile/src/apiClient.ts": allow
    "mobile/.env.example": allow
    "mobile/src/screens/**": allow
    "mobile/src/components/**": allow
    "mobile/src/theme/theme.ts": allow
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
