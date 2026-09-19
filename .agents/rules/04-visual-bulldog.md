---
description: Visual completion gate for UX01 and future mobile UI work.
---

# VISUAL-BULLDOG-01

A screen is not DONE merely because Jest passes or TypeScript compiles.

For a visual slice, completion requires:
1. relevant behavior tests GREEN when behavior changed;
2. TypeScript GREEN;
3. a real screenshot from device/simulator;
4. visual-redteam PASS with no P0/P1 findings;
5. human visual approval.

If visual-redteam returns FAIL:
react-native-ui-dev -> new screenshot -> visual-redteam again.

## Quality rules
- UX01 mockup/spec is the visual authority.
- No production Unicode emoji for icons.
- No mojibake.
- No technical route names visible to users.
- No fake future features.
- Avoid oversized controls, accidental full-width destructive blocks, inconsistent spacing, or ad-hoc components.
- Prefer one coherent icon system and shared components.

## MAP-REAL-DEVICE-GATE
Google Maps is not DONE until a target platform run proves:
- map visible;
- marker visible;
- manual selection works;
- GPS works;
- denied-permission fallback works.

If Expo Go cannot prove final iOS provider configuration, use a Development Build.
