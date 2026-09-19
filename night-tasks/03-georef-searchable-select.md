# Night Task 03 - GeoRef and SearchableSelect

## Goal
Make Province/Locality selection coherent and reusable inside the existing mobile architecture.

## Allowed
- mobile/**
- NIGHT_REPORT.md

## Required
- use existing mobile/src/services/georefService.ts;
- implement/reuse SearchableSelect under mobile/src/components/ only;
- React Native primitives only;
- Modal is acceptable; do not add a bottom-sheet dependency unless it already exists;
- searchable options;
- selected state;
- loading state;
- error + retry;
- disabled state;
- accessibility labels/roles where supported;
- locality disabled until province selected;
- changing province clears locality;
- backend payload remains province:string and locality:string.

## Forbidden
- HTML elements;
- root src/;
- backend changes;
- GeoRef IDs in backend payload;
- silent fallback to free-text input.

Update only Task 03 in NIGHT_REPORT.md and stop.
