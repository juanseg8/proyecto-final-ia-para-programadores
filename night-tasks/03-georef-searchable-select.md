# Task 03 - GeoRef and SearchableSelect

## Authoritative specs
Read exactly:
- specs/features/F02-Establecimiento.md
- specs/ui/UX01-Design-System.md

## Production files to inspect
- mobile/src/services/georefService.ts
- mobile/src/screens/EstablishmentFormScreen.tsx
- mobile/src/components/index.ts
- mobile/src/components/FormField.tsx
- mobile/src/components/AppInput.tsx
- mobile/src/theme/theme.ts

Read additional mobile production files only if directly imported and necessary.

## Goal
Implement/reuse a real searchable Province/Locality selector:
- reusable SearchableSelect under mobile/src/components/;
- React Native primitives only;
- searchable options;
- selected/loading/error/retry/disabled states;
- locality disabled until province is selected;
- changing province clears locality;
- backend payload remains province:string and locality:string;
- no silent fallback to free text.

## Rules
Do not search for alternate specs. Do not read directories. Do not read/edit tests. Update NIGHT_REPORT.md.
