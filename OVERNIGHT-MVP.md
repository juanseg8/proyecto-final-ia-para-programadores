# Agro Intelligence — OVERNIGHT MVP BUILD

## Goal
Maximize DEMO-READY MVP progress during an unattended local run without destabilizing F01/F02.

This file guides execution. It is not permission to invent missing business rules.

## Priority order
0. Stabilize the existing Mobile UI/UX foundation and obvious F01/F02 regressions
1. F03 — Rodeos, animales, pesajes y eventos
2. F04 — Motor de indicadores
3. F07 — Contexto climático
4. F09 — Dashboard móvil
5. F06 — Motor de alertas
6. F05 — Benchmark anónimo
7. F08 — Asistente Agro IA

If a feature lacks enough specification to implement safely, mark it BLOCKED/PARTIAL and move to the next independent task.

## Phase 0 — Mobile stabilization
Do not redesign from scratch. Reuse `mobile/src/theme`, `mobile/src/components` and `mobile/src/services`.

Fix high-impact issues only:
- UTF-8/mojibake and user-visible English
- production emoji/icon inconsistencies
- broken navigation
- stale list/detail after CREATE/UPDATE/DELETE
- oversized/misaligned controls that violate UX01
- GeoRef province/locality behavior
- Google Maps rendering/configuration problems
- loading/error/empty states
- remove future features presented as active

Keep F01/F02 backend contracts unchanged.

## F03
Use the feature spec if available. Implement only what is sufficiently specified.
Ownership must respect INV-05.
Do not invent veterinary or production semantics.

## F04
Indicators are deterministic. Follow INV-01 and INV-09.
Implement only formulas explicitly defined by specs/domain rules and backed by available data.
Never use an LLM to calculate official values.

## F07
Use establishment latitude/longitude.
External weather providers must be encapsulated behind a service/adapter.
Secrets belong server-side where required.
Follow INV-10.

## F09
Build a useful dashboard only from implemented data.
Reuse UX01 components.
Do not fabricate metrics or expose inactive features.

## F06
Alerts must be deterministic and thresholds configurable.
Follow INV-09.
Do not invent agronomic/veterinary thresholds.

## F05
Follow `specs/features/F05-benchmark-anonimo.md` exactly.
k >= 10 is mandatory.
No individual third-party data may be exposed.

## F08
Last priority.
Follow INV-01, INV-06, INV-07, INV-08 and INV-11.
The LLM explains deterministic context; it does not query the DB directly or calculate official metrics.

## Per-slice loop
1. Read only the relevant spec and code.
2. Implement the smallest complete vertical slice.
3. Run focused tests/typecheck/build.
4. Fix failures.
5. Run the relevant feature gate.
6. Use the reviewer subagent for non-trivial/risky changes.
7. If GREEN, create a LOCAL commit.
8. Update `NIGHT_REPORT.md`.
9. Continue.

## Testing
Required for business logic, ownership, contracts, persistence, calculations, navigation, state synchronization and adapters.
Avoid pixel/color/spacing tests and giant snapshots.

## Git
Allowed: local commits.
Forbidden: push, force push, reset --hard, clean -fd, rewriting history.

## Context discipline
Never bulk-read node_modules, build output, coverage, .git or historical run logs.
Prefer relevant spec -> relevant module -> relevant test -> implementation.

## Stop conditions
Stop a specific task when:
- a missing product decision is required
- a secret/config value is unavailable
- proceeding risks data loss
- F01/F02 backend contract would need an unapproved change

Record the blocker and continue elsewhere.

## End-of-night gate
Run all available build/test/typecheck commands that are actually configured.
Update `NIGHT_REPORT.md` with completed/partial/blocked work, local commits, test results and demo instructions.
Never push.
