---
name: agro-mobile-ui
description: Professional React Native + Expo UI/UX rules for Agro Intelligence.
---

# Agro Mobile UI

Before any UI task read:
1. `specs/ui/UX01-Design-System.md`
2. `references/design-system.md`
3. `references/react-native-rules.md`
4. `references/visual-quality-gate.md`

## Principles
- Professional AgTech Premium look; no generic AI-generated dashboard aesthetic.
- Clear information hierarchy and restrained visual density.
- Shared tokens/components before screen-local styling.
- Spanish UI.
- Consistent vector icon system; no production emoji.
- Accessible touch targets and labels.
- Safe-area and keyboard correctness.
- Responsive behavior across common phone sizes.
- Functional specs own behavior; UX01 owns visual direction.

## Foundation roadmap
SearchableSelect is the canonical future selector for Provincia/Localidad and similar data.
It must support modal/bottom-sheet presentation, search, list, selected state, loading, error, retry, disabled state and accessibility.

## Anti-AI-slop
Avoid:
- oversized pills/buttons everywhere
- excessive gradients/glows
- meaningless cards
- decorative metrics with fake data
- random icons
- giant whitespace with weak hierarchy
- inconsistent radius/shadows
- mixing multiple visual systems
- placeholder future features presented as active
