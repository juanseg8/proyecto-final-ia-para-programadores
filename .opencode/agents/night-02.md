---
description: Task 02 F02 navigation refresh
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
    "specs/features/F02-Establecimiento.md": allow
    "specs/ui/UX01-Design-System.md": allow
    "mobile/App.tsx": allow
    "mobile/src/screens/EstablishmentListScreen.tsx": allow
    "mobile/src/screens/EstablishmentFormScreen.tsx": allow
    "mobile/src/screens/EstablishmentDetailScreen.tsx": allow
    "mobile/src/apiClient.ts": allow
  edit:
    "*": deny
    "mobile/App.tsx": allow
    "mobile/src/screens/EstablishmentListScreen.tsx": allow
    "mobile/src/screens/EstablishmentFormScreen.tsx": allow
    "mobile/src/screens/EstablishmentDetailScreen.tsx": allow
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
