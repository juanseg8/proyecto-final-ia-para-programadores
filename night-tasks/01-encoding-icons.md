# Night Task 01 - Encoding and icons

## Goal
Remove obvious mojibake and production emoji/icon corruption from the existing mobile F01/F02 UI.

## Allowed
- mobile/**
- NIGHT_REPORT.md

## Do
- search current mobile screens/components for corrupted visible strings;
- fix Spanish UTF-8 text;
- remove Unicode emoji used as production icons;
- use the icon system already available in the Expo/React Native project when an icon is needed;
- keep behavior unchanged;
- preserve existing tests unless a visible-text assertion legitimately needs updating.

## Do not
- redesign layouts;
- add future features;
- create new backend/domain concepts;
- touch backend;
- create root src/.

Update only Task 01 in NIGHT_REPORT.md and stop.
