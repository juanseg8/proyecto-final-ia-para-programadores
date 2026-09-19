# Night Task 05 - Map sanity

## Goal
Fix code-level issues in the existing F02 map flow.

## Verify in production code
- react-native-maps stays inside the mobile architecture;
- marker state exists;
- manual selection remains possible;
- GPS flow remains possible;
- denied permission does not break manual fallback;
- API keys are not hardcoded;
- platform config continues to use environment variables.

## Important
Do not claim real-device map approval without an actual device/development build.
If a remaining issue needs device verification, report BLOCKED: REAL_DEVICE_REQUIRED.

Do not read/edit tests.
Do not add secrets.
Do not touch backend.
Do not create root src/.

Compile with TypeScript, update Task 05 in NIGHT_REPORT.md and stop.
