# Current Plan — Lean Agentic Refactor

## Objective
Replace the expensive all-purpose SDD loop with risk-based execution while preserving specs, invariants, F01/F02 and useful UX01 work.

## Status
- [x] Preserve F01/F02 implementation and UX01 WIP
- [x] Define FAST / STRICT / UI_FAST / NIGHT_BUILD modes
- [x] Add dedicated UI/UX agents and visual-redteam
- [x] Add Agro Mobile UI skill and Visual Bulldog rule
- [x] Add OpenCode/Ollama local worker configuration
- [x] Add local-AI setup and overnight scripts
- [ ] Run local AI setup on the development machine
- [ ] Validate OpenCode can read/edit/run tests with Ollama
- [ ] Finish UX01 via UI_FAST and human visual approval
- [ ] Execute overnight MVP plan
- [ ] Review NIGHT_REPORT and local commits
- [ ] Merge only reviewed work

## Rule
Do not begin another heavyweight SDD cycle by default. Select the mode using `.agents/rules/03-development-modes.md`.
