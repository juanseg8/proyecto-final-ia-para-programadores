# Agro Intelligence - NIGHT BUILD V2

## Purpose
Run a safe, unattended LOCAL execution with OpenCode + Ollama.

The local model is an implementation worker, not a product architect.

## Why V2 exists
The first unattended run created an invalid root-level `src/` tree and invented architecture.
V2 prevents that by:
- using small isolated tasks;
- allowing only `mobile/**` and `NIGHT_REPORT.md` during the current run;
- validating changed paths after every task;
- running TypeScript and Jest gates;
- committing only from the PowerShell wrapper after GREEN;
- stopping F03+ until their specs are sufficiently defined.

## Current unattended scope
Only Phase 0 - F01/F02 mobile stabilization.

Allowed production path:
- `mobile/**`

Allowed report:
- `NIGHT_REPORT.md`

Forbidden during this run:
- root `src/**`
- `backend/**`
- `specs/**`
- `.agents/**`
- `.opencode/**`
- product/domain invention
- new backend contracts
- F03/F04/F06/F07/F08/F09 implementation

## Task order
1. `night-tasks/01-encoding-icons.md`
2. `night-tasks/02-navigation-refresh.md`
3. `night-tasks/03-georef-searchable-select.md`
4. `night-tasks/04-ui-foundation-cleanup.md`
5. `night-tasks/05-map-sanity.md`

Each task is a separate OpenCode run with fresh context.

## Per-task gate
After each task the wrapper must:
1. verify no forbidden path was changed;
2. run `npx tsc --noEmit` in `mobile/`;
3. run `npx jest --runInBand` in `mobile/`;
4. commit locally only if GREEN;
5. stop immediately on a forbidden path or failed gate.

## Visual limitation
The worker cannot declare UX01 visually complete.
Real screenshots + visual-redteam + human approval remain mandatory.

## Feature work after Phase 0
Do not implement F03+ unattended unless a concrete spec exists.

Current state:
- F01 implemented
- F02 implemented
- F05 specified but depends on F04
- F03/F04/F06/F07/F08/F09 are not sufficiently specified for autonomous implementation

A missing spec is a BLOCKER, not permission to invent.

## Git
Never push.
Never force push.
Never reset --hard.
Never clean -fd.
