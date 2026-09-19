---
description: Select the cheapest safe development mode before executing work.
---

# Development Mode Router

## FAST — default
Use for ordinary CRUD, low-risk wiring, normal backend/mobile feature work and refactors.

Flow:
spec -> short plan -> relevant dev -> focused tests/build -> concise review -> done.

No mandatory RED-first cycle.
No mandatory verifier/security agent unless risk requires it.

## STRICT
Use for:
- auth/session/password work
- ownership/tenant isolation
- security/privacy
- benchmark anonymity
- deterministic indicator formulas with material business impact
- AI isolation/guardrails/audit
- risky database migrations
- explicit human request

Flow:
test-autor -> RED -> dev -> GREEN -> verifier -> security if applicable.

## UI_FAST
Use for visual work and presentation-only refactors.

Flow:
ui-ux-director -> react-native-ui-dev -> real screenshot -> visual-redteam -> human approval.

Invoke test-autor only when behavior changes: navigation, forms, network state, CRUD, GeoRef, GPS/maps, auth, or payloads.

## NIGHT_BUILD
Handled by OpenCode/Ollama using `AGENTS.md` and `OVERNIGHT-MVP.md`.
Do not reproduce Antigravity multiagent ceremony locally.

## Rule
When uncertain, choose FAST unless an invariant/security condition above makes STRICT necessary.
