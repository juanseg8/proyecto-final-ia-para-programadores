---
description: Task 15 F07 weather
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
    "specs/features/F07-clima.md": allow
    "specs/ui/UX01-Design-System.md": allow
    "backend/src/app.module.ts": allow
    "backend/src/entities/establishment.entity.ts": allow
    "backend/src/establishments/establishment.service.ts": allow
    "mobile/src/apiClient.ts": allow
    "mobile/src/screens/EstablishmentDetailScreen.tsx": allow
    "mobile/src/components/index.ts": allow
    "mobile/src/theme/theme.ts": allow
    "backend/src/weather/weather.module.ts": allow
    "backend/src/weather/weather.controller.ts": allow
    "backend/src/weather/weather.service.ts": allow
    "backend/src/weather/open-meteo.provider.ts": allow
    "mobile/src/components/WeatherCard.tsx": allow
  edit:
    "*": deny
    "backend/src/app.module.ts": allow
    "backend/src/weather/weather.module.ts": allow
    "backend/src/weather/weather.controller.ts": allow
    "backend/src/weather/weather.service.ts": allow
    "backend/src/weather/open-meteo.provider.ts": allow
    "mobile/src/components/WeatherCard.tsx": allow
    "mobile/src/components/index.ts": allow
    "mobile/src/screens/EstablishmentDetailScreen.tsx": allow
    "mobile/src/apiClient.ts": allow
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
