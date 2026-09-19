# Night Task 05 - Map sanity

## Goal
Audit/fix only code-level issues in the existing F02 map flow.

## Allowed
- mobile/**
- NIGHT_REPORT.md

## Verify in code/tests
- react-native-maps integration remains in mobile architecture;
- marker state exists;
- manual selection remains possible;
- GPS flow remains possible;
- denied-permission fallback does not break the form;
- API keys are not hardcoded;
- platform config continues to use environment variables.

## Important
Do not claim MAP-REAL-DEVICE-GATE PASS without a real device/development-build verification.
If the remaining issue cannot be proven/fixed without device configuration, record BLOCKED: REAL_DEVICE_REQUIRED.

Do not add secrets.
Do not touch backend.
Do not create root src/.

Update only Task 05 in NIGHT_REPORT.md and stop.
