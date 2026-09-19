---
description: Lean visual workflow with real screenshot review.
---

# UI_FAST

For a presentation-only slice:
ui-ux-director -> react-native-ui-dev -> screenshot -> visual-redteam -> HUMAN.

If behavior changes (navigation, forms, network state, CRUD, GeoRef, GPS/maps, auth or payloads):
test-autor may be inserted before implementation for that behavior only.

Rules:
- no pixel/color unit tests;
- no full-suite run after every cosmetic tweak;
- screenshot is mandatory for visual completion;
- no next-screen progression while current screen has P0/P1 visual findings;
- record one report per screen, not one file per agent call.
