# Night Task 01A - Home/Login encoding and icons

## Goal
Fix only visible UTF-8/mojibake and production emoji/icon corruption in Home and Login.

## Read ONLY these files
- mobile/src/screens/HomeScreen.tsx
- mobile/src/screens/LoginScreen.tsx
- mobile/src/components/AppInput.tsx
- mobile/src/theme/theme.ts

Do not read any other source or test file unless a compile error after editing points directly to it.

## Allowed edits
- mobile/src/screens/HomeScreen.tsx
- mobile/src/screens/LoginScreen.tsx
- NIGHT_REPORT.md

## Do
- repair corrupted Spanish strings;
- replace broken/Unicode emoji iconography with simple non-emoji text/vector-safe presentation using existing project capabilities;
- preserve all behavior/navigation/auth logic;
- preserve layout except changes required to remove broken icons.

## Do not
- redesign;
- add dependencies;
- add future features;
- touch tests unless the wrapper later shows a real failing assertion;
- create root src/.

Update Task 01A in NIGHT_REPORT.md and stop.
