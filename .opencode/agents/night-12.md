---
description: Task 12 F04 indicators
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
    "specs/features/F04-indicadores.md": allow
    "backend/src/app.module.ts": allow
    "backend/src/data-source.ts": allow
    "backend/src/entities/establishment.entity.ts": allow
    "backend/src/entities/herd.entity.ts": allow
    "backend/src/entities/animal.entity.ts": allow
    "backend/src/entities/weighing.entity.ts": allow
    "backend/src/entities/livestock-event.entity.ts": allow
    "backend/src/livestock/livestock.module.ts": allow
    "backend/src/livestock/livestock.service.ts": allow
    "backend/src/entities/indicator-snapshot.entity.ts": allow
    "backend/src/indicators/indicators.module.ts": allow
    "backend/src/indicators/indicators.controller.ts": allow
    "backend/src/indicators/indicators.service.ts": allow
  edit:
    "*": deny
    "backend/src/app.module.ts": allow
    "backend/src/data-source.ts": allow
    "backend/src/entities/indicator-snapshot.entity.ts": allow
    "backend/src/indicators/indicators.module.ts": allow
    "backend/src/indicators/indicators.controller.ts": allow
    "backend/src/indicators/indicators.service.ts": allow
    "backend/src/db/migrations/1790000001000-F04Indicators.ts": allow
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
