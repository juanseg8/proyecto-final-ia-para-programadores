---
description: Repairs only compile errors from current MVP task
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
    "specs/features/**": allow
    "backend/**": allow
    "backend/**/*.spec.ts": deny
    "backend/test/**": deny
    "mobile/**": allow
    "mobile/__tests__/**": deny
    "NIGHT_REPORT.md": allow
  edit:
    "*": deny
    "backend/**": allow
    "backend/**/*.spec.ts": deny
    "backend/test/**": deny
    "mobile/**": allow
    "mobile/__tests__/**": deny
    "NIGHT_REPORT.md": allow
---

Repair only supplied compile errors. No redesign/tests/new scope/contract changes. Never commit/push.


Path handling (mandatory):
- Repository root is already the working directory.
- Use repository-relative paths copied exactly from compiler output or PROJECT-MAP.
- Never construct absolute Windows paths.
