# Night Task 03 - GeoRef and SearchableSelect

## Goal
Make Province/Locality selection coherent and reusable in the existing mobile architecture.

## Required
- use `mobile/src/services/georefService.ts`;
- implement/reuse SearchableSelect under `mobile/src/components/`;
- React Native primitives only;
- Modal is acceptable; do not add a bottom-sheet dependency;
- searchable options;
- selected/loading/error/retry/disabled states;
- locality disabled until province is selected;
- changing province clears locality;
- canonical payload remains province:string and locality:string.

## Forbidden
- reading/editing tests;
- HTML elements;
- root src/;
- backend changes;
- GeoRef IDs in backend payload;
- silent fallback to free-text input.

Compile with TypeScript, update Task 03 in NIGHT_REPORT.md, then stop.
