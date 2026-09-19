# Agro Intelligence - Project Instructions

## 1. Source of truth
Read in this order:
1. `specs/constitution.md`
2. `specs/000-index.md`
3. the relevant feature spec under `specs/features/`
4. `specs/ui/UX01-Design-System.md` for mobile UI
5. existing implementation

Do not invent business rules when specs are silent. Record a blocker instead.

## 2. Architecture boundaries
Production code lives only in:
- `backend/`
- `mobile/`

Never create root-level `src/`.
Do not duplicate existing entities/services/components.
Search the existing implementation before creating a new concept.

## 3. Stack
Backend: NestJS + TypeORM + PostgreSQL.
Mobile: React Native + Expo + TypeScript.
Local autonomous worker: OpenCode + Ollama.

## 4. Development modes

### FAST
Normal CRUD and low-risk work:
spec -> short plan -> implementation -> compile/build -> review.

### STRICT
Auth, ownership, security/privacy, migrations, deterministic calculations, benchmark anonymity and AI guardrails:
use the relevant high-value tests and security review.

### UI_FAST
UI work:
design-system -> implementation -> TypeScript -> screenshot/device review.
Do not create visual snapshot-test churn.

### NIGHT_BUILD
Local overnight execution is deliberately simpler:
task -> implement -> TypeScript compile -> compile repair if needed -> local commit -> next task.

NIGHT_BUILD must NOT create, repair or run UI/Jest tests. Existing tests remain in the repository for deliberate daytime/STRICT verification.

## 5. Existing stable functionality
F01 Authentication is implemented.
F02 Establishments and Location is implemented.
Do not change their backend contracts without an approved spec.

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
Visual authority: `specs/ui/UX01-Design-System.md`.
Visible UI is Spanish.
No Unicode emoji as production iconography.
Reuse shared UI components/theme.
Do not present future functionality as active.
React Native code uses React Native primitives, never HTML tags.

## 7. Testing policy
Tests are selective, not the primary Night Build gate.

High-value tests belong to:
- auth and ownership
- API contracts and canonical payloads
- deterministic calculations
- persistence/migrations
- external adapters
- critical navigation/state flows
- security/privacy invariants

Avoid fragile tests for visual text layout, colors, spacing, pixels and implementation details.
During NIGHT_BUILD, do not read/edit/run `mobile/__tests__/`.
The overnight gate is TypeScript compilation plus path safety.
Run deliberate test suites later in STRICT/daytime verification.

## 8. Git safety
Autonomous work may create local commits only.
Never:
- push
- force push
- reset --hard
- clean -fd
- rewrite history
- commit secrets

## 9. Context discipline
Do not recursively read:
- node_modules
- dist/build/coverage
- .git
- historical .agents/runs
- mobile/__tests__ during NIGHT_BUILD

Prefer: task -> relevant production files -> compile -> fix.

## 10. Reporting
Keep NIGHT_REPORT.md concise: changes, compile result, commit, blockers.
