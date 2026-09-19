# Agro Intelligence - NIGHT BUILD V7

## Goal
Make useful product progress overnight with a local coding agent without wasting time on fragile test infrastructure.

The local model is an implementation worker, not a product architect.

## Current scope
Phase 0: stabilize and improve the existing F01/F02 mobile experience.

Allowed:
- `mobile/**` production code
- `NIGHT_REPORT.md`

Forbidden:
- root `src/**`
- `backend/**`
- `specs/**`
- `.agents/**`
- `.opencode/**`
- `mobile/__tests__/**`
- Jest/testing-library configuration
- new backend contracts
- invented F03+ domain rules

## Current task order
1. Task 02 - navigation and fresh data
2. Task 03 - GeoRef + reusable SearchableSelect
3. Task 04 - UI foundation cleanup
4. Task 05 - map code sanity

Encoding cleanup is no longer an autonomous task. It is a one-time maintenance concern.

## Per-task workflow
For each task:
1. run a fresh OpenCode session;
2. inspect only relevant production code;
3. implement the task;
4. reject changes outside the allowlist;
5. run `npx tsc --noEmit` in mobile;
6. if TypeScript fails, give only compiler errors to compile-repairer;
7. retry compilation up to 2 times;
8. if GREEN, create a local commit;
9. continue to the next task.

No Jest is run in NIGHT_BUILD.

## Completion
A task is code-complete overnight when:
- paths are valid;
- TypeScript is GREEN;
- required behavior is implemented in code;
- report is updated;
- local commit exists.

Visual completion still requires a later real-device/screenshot review.

## F03+
Do not implement F03/F04/F06/F07/F08/F09 until each has a sufficiently concrete spec.
Missing spec = blocker, not permission to invent.

F05 is specified but depends on F04.

## Git
Never push.
Never force push.
Never reset --hard.
Never clean -fd.
