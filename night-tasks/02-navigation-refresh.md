# Task 02 - F02 navigation and refresh

## Authoritative spec
Read exactly:
- specs/features/F02-Establecimiento.md
- specs/ui/UX01-Design-System.md

Do NOT search for another F02 spec. Do NOT invent paths such as mobile/featureSpecs.

## Production files to inspect
Read exactly these first:
- mobile/App.tsx
- mobile/src/screens/EstablishmentListScreen.tsx
- mobile/src/screens/EstablishmentFormScreen.tsx
- mobile/src/screens/EstablishmentDetailScreen.tsx
- mobile/src/apiClient.ts

Read additional mobile production files only when one of these imports them and they are directly needed.

## Goal
Stabilize the existing F02 mobile flow:
- CREATE returns to a fresh establishment list/detail as defined by the current navigation flow;
- UPDATE refreshes the relevant detail/list state;
- DELETE returns correctly and leaves the list fresh;
- no technical route name is visible to the user;
- preserve the canonical F02 payload and backend contract.

## Rules
- Do not read directories; read concrete files.
- Do not inspect backend unless the F02 spec is insufficient for a specific contract detail.
- Do not read/edit tests.
- Do not add timeout hacks.
- Do not invent routes or future features.
- Update NIGHT_REPORT.md with what was changed.
- This task is not complete merely because TypeScript already compiles.
