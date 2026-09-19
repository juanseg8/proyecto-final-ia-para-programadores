# Night Task 01B - Establishment screens encoding and icons

## Goal
Fix only visible UTF-8/mojibake and production emoji/icon corruption in existing F02 establishment screens.

## Read ONLY these files
- mobile/src/screens/EstablishmentListScreen.tsx
- mobile/src/screens/EstablishmentDetailScreen.tsx
- mobile/src/screens/EstablishmentFormScreen.tsx
- mobile/src/screens/RegisterScreen.tsx
- mobile/src/components/MapLocationPicker.tsx
- mobile/src/theme/theme.ts

Do not read any other source or test file unless a compile error after editing points directly to it.

## Allowed edits
- the files listed above
- NIGHT_REPORT.md

## Do
- repair corrupted Spanish strings;
- remove corrupted arrows, plus signs, house/leaf/location emojis used as icons;
- preserve behavior and F02 payload;
- keep UI Spanish.

## Do not
- redesign;
- add dependencies;
- add future tabs/features;
- touch backend;
- create root src/.

Update Task 01B in NIGHT_REPORT.md and stop.
