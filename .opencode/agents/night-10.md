---
description: Task 10 F03 backend
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
    "specs/features/F03-gestion-ganadera.md": allow
    "specs/features/F02-Establecimiento.md": allow
    "backend/src/app.module.ts": allow
    "backend/src/data-source.ts": allow
    "backend/src/entities/establishment.entity.ts": allow
    "backend/src/establishments/establishment.module.ts": allow
    "backend/src/establishments/establishment.controller.ts": allow
    "backend/src/establishments/establishment.service.ts": allow
    "backend/src/establishments/guards/establishment-ownership.guard.ts": allow
    "backend/src/entities/herd.entity.ts": allow
    "backend/src/entities/animal.entity.ts": allow
    "backend/src/entities/weighing.entity.ts": allow
    "backend/src/entities/livestock-event.entity.ts": allow
    "backend/src/livestock/livestock.module.ts": allow
    "backend/src/livestock/livestock.controller.ts": allow
    "backend/src/livestock/livestock.service.ts": allow
    "backend/src/livestock/dto/herd.dto.ts": allow
    "backend/src/livestock/dto/animal.dto.ts": allow
    "backend/src/livestock/dto/weighing.dto.ts": allow
    "backend/src/livestock/dto/livestock-event.dto.ts": allow
  edit:
    "*": deny
    "backend/src/app.module.ts": allow
    "backend/src/data-source.ts": allow
    "backend/src/entities/establishment.entity.ts": allow
    "backend/src/establishments/establishment.module.ts": allow
    "backend/src/establishments/establishment.controller.ts": allow
    "backend/src/establishments/establishment.service.ts": allow
    "backend/src/entities/herd.entity.ts": allow
    "backend/src/entities/animal.entity.ts": allow
    "backend/src/entities/weighing.entity.ts": allow
    "backend/src/entities/livestock-event.entity.ts": allow
    "backend/src/livestock/livestock.module.ts": allow
    "backend/src/livestock/livestock.controller.ts": allow
    "backend/src/livestock/livestock.service.ts": allow
    "backend/src/livestock/dto/herd.dto.ts": allow
    "backend/src/livestock/dto/animal.dto.ts": allow
    "backend/src/livestock/dto/weighing.dto.ts": allow
    "backend/src/livestock/dto/livestock-event.dto.ts": allow
    "backend/src/db/migrations/1790000000000-F03Livestock.ts": allow
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
