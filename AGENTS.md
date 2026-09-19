# Agro Intelligence - Project Instructions

## 1. Source of truth
Read in this order:
1. `specs/constitution.md`
2. `specs/000-index.md`
3. the relevant feature spec under `specs/features/`
4. `specs/ui/UX01-Design-System.md` for mobile UI
5. existing implementation

Do not invent business rules when the specs are silent. Record a blocker instead.

## 2. Architecture boundaries
Production code lives only in:
- `backend/`
- `mobile/`

Never create a root-level `src/` directory.
Do not duplicate entities/services that already exist in backend or mobile.
Before creating a new module, search the existing project for the same concept.

## 3. Stack
Backend: NestJS + TypeORM + PostgreSQL.
Mobile: React Native + Expo + TypeScript.
Local autonomous worker: OpenCode + Ollama.

## 4. Development modes
Use the lightest mode that is safe.

### FAST - default
Ordinary CRUD, wiring and low-risk feature work:
spec -> short plan -> implement vertical slice -> focused tests -> build/typecheck -> concise review.

### STRICT
Only for auth, ownership, security/privacy, risky migrations, deterministic calculations, benchmark anonymity, AI isolation/guardrails, or an explicitly STRICT task.

### UI_FAST
Visual/mobile work:
ui-ux-director -> react-native-ui-dev -> real screenshot -> visual-redteam -> human approval.
Invoke test-autor only when behavior changes.

### NIGHT_BUILD
Used by OpenCode/Ollama. Follow `OVERNIGHT-MVP.md` and the task files in `night-tasks/`.
Night build is an executor, not an architect.

## 5. Existing stable functionality
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

## 6. UI rules
The visual authority is `specs/ui/UX01-Design-System.md`.
Visible UI must be Spanish.
Do not use Unicode emoji as production iconography.
Reuse the shared UI foundation before creating new components.
Do not expose future features as if they already work.
Mockup defines look and feel; functional specs define behavior.

React Native code must use React Native primitives. Do not use HTML elements such as `input`, `div`, `ul` or `li`.

## 7. Testing policy
Test high-value behavior:
- business logic and formulas
- API contracts
- ownership/security
- persistence/migrations
- navigation and state changes
- external service adapters
- critical error/fallback paths

Do not spend tests on exact colors, pixels, padding, margins, radii or giant snapshots.
Run the smallest relevant suite while iterating. Run full gates when closing a slice.

## 8. Git safety
Allowed: local feature branches.
Autonomous agents must not commit directly; the Night Build wrapper validates and commits GREEN slices.
Forbidden:
- git push
- force push
- reset --hard
- git clean -fd
- rewriting history
- deleting unrelated migrations
- committing secrets

## 9. Context discipline
Do not recursively read:
- node_modules
- dist/build/coverage
- .git
- historical `.agents/runs/` unless needed
- generated logs

Prefer: relevant spec -> relevant module -> relevant tests -> implementation.

## 10. Reporting
Use concise reports. New work should normally create one report per feature/screen, not dozens of trace files.
