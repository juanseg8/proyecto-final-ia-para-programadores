# Agro Intelligence — Project Instructions

## Source of truth
Read in this order:
1. `specs/constitution.md`
2. `specs/000-index.md`
3. the relevant feature spec under `specs/features/`
4. `specs/ui/UX01-Design-System.md` for mobile UI
5. existing implementation

Do not invent business rules when the specs are silent. Record a blocker instead.

## Stack
Backend: NestJS + TypeORM + PostgreSQL.
Mobile: React Native + Expo + TypeScript.
Local autonomous worker: OpenCode + Ollama.

## Development modes
Use the lightest mode that is safe.

### FAST — default
Ordinary CRUD, wiring and low-risk feature work:
spec -> short plan -> implement vertical slice -> focused tests -> build/typecheck -> concise review -> local commit.

### STRICT
Only for auth, ownership, security/privacy, risky migrations, deterministic calculations, benchmark anonymity, AI isolation/guardrails, or an explicitly STRICT task.
STRICT may use test-first and independent verifier/security agents.

### UI_FAST
Visual/mobile work:
ui-ux-director -> react-native-ui-dev -> real screenshot -> visual-redteam -> human approval.
Invoke test-autor only when behavior changes: navigation, forms, API/state, GPS, GeoRef, CRUD, auth or payloads.
Do not test pixels, colors, padding or trivial presentation.

### NIGHT_BUILD
Used by the local OpenCode/Ollama worker. Follow `OVERNIGHT-MVP.md`.

## Existing stable functionality
F01 Authentication is implemented.
F02 Establishments and Location is implemented.
Do not change their backend contracts unless an approved spec explicitly requires it.

Canonical F02 payload:
```ts
{
  name: string;
  province: string;
  locality: string;
  latitude: number;
  longitude: number;
  superficieHa: number;
}
```

## UI rules
The visual authority is `specs/ui/UX01-Design-System.md`.
Visible UI must be Spanish.
Do not use Unicode emoji as production iconography.
Reuse the shared UI foundation before creating new components.
Do not expose future features as if they already work.
Mockup defines look and feel; functional specs define behavior.

## Testing policy
Test high-value behavior:
- business logic and formulas
- API contracts
- ownership/security
- persistence/migrations
- navigation and state changes
- external service adapters
- critical error/fallback paths

Do not spend tests on exact colors, pixels, padding, margins, radii or giant snapshots.
Run the smallest relevant suite while iterating. Run full gates only when closing a slice/feature.

## Git safety
Allowed: local commits and feature branches.
Forbidden:
- git push from autonomous agents
- force push
- reset --hard
- git clean -fd
- rewriting history
- deleting unrelated migrations
- committing secrets

## Context discipline
Do not recursively read or summarize:
- node_modules
- dist/build/coverage
- .git
- historical `.agents/runs/` unless needed for a specific decision
- generated logs

Prefer: relevant spec -> relevant module -> relevant tests -> implementation.

## Reporting
Use concise reports. New work should normally create one report per feature/screen, not dozens of trace files.
