# Night Task 04 - UI foundation cleanup

## Goal
Improve consistency of the existing F01/F02 screens without claiming final visual approval.

## Allowed
- mobile/**
- NIGHT_REPORT.md

## Use
- specs/ui/UX01-Design-System.md is read-only visual guidance;
- mobile/src/theme;
- existing AppScreen/AppHeader/AppButton/AppInput/AppCard/FormField/feedback components.

## Do
- remove obvious duplicated ad-hoc styles where existing foundation components fit;
- normalize gross spacing/proportions and button hierarchy;
- ensure visible UI is Spanish;
- keep destructive action visually distinct;
- remove future/inactive bottom-nav items presented as active;
- keep existing functional flows intact.

## Do not
- perform a full redesign;
- add fake metrics/photos/features;
- change backend contracts;
- declare UX01 PASS;
- create root src/.

Mark HUMAN_SCREENSHOT_REQUIRED in Task 04 report and stop.
