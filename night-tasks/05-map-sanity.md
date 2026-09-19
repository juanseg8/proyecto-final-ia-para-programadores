# Task 05 - F02 map sanity

## Authoritative specs
Read exactly:
- specs/features/F02-Establecimiento.md
- specs/ui/UX01-Design-System.md

## Production files to inspect
- mobile/src/components/MapLocationPicker.tsx
- mobile/src/screens/EstablishmentFormScreen.tsx
- mobile/app.config.js
- mobile/app.json
- mobile/.env.example

## Goal
Fix code-level issues in the existing map flow:
- react-native-maps with Google provider remains correctly integrated;
- marker/manual selection works in code;
- GPS flow exists and permission denial preserves manual fallback;
- remove duplicate/dead GPS controls;
- API keys are not hardcoded;
- platform config uses environment variables.

Do not claim real-device approval. Record REAL_DEVICE_REQUIRED in NIGHT_REPORT.md.
Do not read/edit tests. Do not search for alternate task/spec files.
