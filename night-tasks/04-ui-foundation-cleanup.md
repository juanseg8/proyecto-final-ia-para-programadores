# Night Task 04 - UI foundation cleanup

## Goal
Improve consistency of existing F01/F02 mobile screens without claiming final visual approval.

## Use
- `specs/ui/UX01-Design-System.md` as read-only guidance;
- `mobile/src/theme/`;
- existing AppScreen/AppHeader/AppButton/AppInput/AppCard/FormField/feedback components.

## Do
- remove obvious duplicated ad-hoc styles where the shared foundation fits;
- normalize gross spacing/proportions/button hierarchy;
- ensure visible UI is Spanish;
- keep destructive actions visually distinct;
- remove inactive/future UI presented as working;
- keep functional flows intact.

## Do not
- read/edit tests;
- perform a speculative full redesign;
- add fake metrics/photos/features;
- change backend contracts;
- declare UX01 visually approved;
- create root src/.

Compile with TypeScript. Mark HUMAN_SCREENSHOT_REQUIRED in NIGHT_REPORT.md and stop.
