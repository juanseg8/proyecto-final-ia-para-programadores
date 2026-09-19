---
description: Implements one bounded Agro Intelligence MVP task
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
    "night-tasks/**": allow
    "specs/constitution.md": allow
    "specs/000-index.md": allow
    "specs/features/**": allow
    "specs/ui/UX01-Design-System.md": allow
    "backend/**": allow
    "backend/**/*.spec.ts": deny
    "backend/test/**": deny
    "mobile/**": allow
    "mobile/__tests__/**": deny
    "NIGHT_REPORT.md": allow
    "README.md": allow
  edit:
    "*": deny
    "backend/**": allow
    "backend/**/*.spec.ts": deny
    "backend/test/**": deny
    "mobile/**": allow
    "mobile/__tests__/**": deny
    "NIGHT_REPORT.md": allow
    "README.md": allow
---

Implement exactly ONE supplied V8 task. Read relevant spec first and only named production files plus immediate dependencies.
No Glob/Grep/List/Bash/web/subagents. Never touch tests, invent rules, create root src, commit or push.
Complete vertical slice, update NIGHT_REPORT, stop.


Additional execution discipline:
- Never guess a specification path. Use the exact paths written in the task.
- Never call Read on a directory. Read concrete files only.
- A failed Read because a guessed file does not exist is a planning error: immediately return to the exact task paths; do not search the repository for substitutes.
- TypeScript being green before edits does NOT mean the task is complete.
- For tasks marked as implementation work, make the required production changes. If after inspecting the exact files the requirement is already fully implemented, write an explicit NO_CHANGE_NEEDED reason in NIGHT_REPORT.md instead of silently stopping.


PROJECT-MAP discipline:
- Read PROJECT-MAP.md at the start of every task.
- Exact paths in the task and PROJECT-MAP are authoritative.
- Never invent a path.
- Never call Read on a directory such as mobile, mobile/src, backend, backend/src, specs or night-tasks.
- If an exact listed file does not exist and the task says "crear", create it at that exact path.
- If an exact listed file unexpectedly does not exist and it is not a create target, record BLOCKED_PATH_MISSING in NIGHT_REPORT.md and stop that task; do not search the repo.


Path handling (mandatory):
- The repository working directory is already the project root.
- ALWAYS pass repository-relative paths to Read/Edit exactly as written in the task or PROJECT-MAP, e.g. mobile/src/screens/EstablishmentListScreen.tsx.
- NEVER construct or use absolute Windows paths (C:/... or C:\\...).
- NEVER rewrite, normalize, abbreviate, or typo the repository folder name.
- If a relative Read fails, retry once with the exact same relative path copied verbatim from the task/PROJECT-MAP; never convert it to an absolute path.
