# Task 04 - UI foundation cleanup

## Authoritative spec
Read exactly:
- specs/ui/UX01-Design-System.md

## Production files to inspect
- mobile/src/theme/theme.ts
- mobile/src/components/AppScreen.tsx
- mobile/src/components/AppHeader.tsx
- mobile/src/components/AppButton.tsx
- mobile/src/components/AppInput.tsx
- mobile/src/components/AppCard.tsx
- mobile/src/components/FormField.tsx
- mobile/src/components/feedback.tsx
- mobile/src/components/BottomNav.tsx
- mobile/src/screens/HomeScreen.tsx
- mobile/src/screens/LoginScreen.tsx
- mobile/src/screens/RegisterScreen.tsx
- mobile/src/screens/EstablishmentListScreen.tsx
- mobile/src/screens/EstablishmentDetailScreen.tsx
- mobile/src/screens/EstablishmentFormScreen.tsx

## Goal
Make F01/F02 mobile visually consistent with UX01:
- reuse foundation components instead of duplicated ad-hoc UI;
- normalize spacing/proportions/button hierarchy;
- Spanish visible text;
- destructive actions visibly distinct;
- remove inactive/future UI presented as working;
- remove Unicode emoji used as production icons;
- preserve functional flows and backend contracts.

Do not perform a speculative redesign. Do not read/edit tests. Mark HUMAN_SCREENSHOT_REQUIRED in NIGHT_REPORT.md.
