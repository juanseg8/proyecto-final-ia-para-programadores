# Agro Intelligence Network

Mobile-first livestock intelligence MVP.

## Stack
- Mobile: React Native + Expo + TypeScript
- Backend: NestJS + TypeORM + PostgreSQL
- Agentic development: Antigravity (interactive) + OpenCode/Ollama (local autonomous work)

## Current product state
- F01 Authentication: implemented
- F02 Establishments & location: implemented
- UX01 Design System: correction/polish in progress
- F03–F09: pending according to `specs/000-index.md`

## Development workflow
This repository uses four execution modes documented in `AGENTS.md`:
- FAST: default product development
- STRICT: security/invariant-sensitive work
- UI_FAST: visual/mobile work with screenshot review
- NIGHT_BUILD: local autonomous execution with OpenCode + Ollama

The old fully hard-delegated SDD is retained as history but is no longer the default.

## Local setup

### Backend
```bash
cd backend
npm install
npm run build
npm test
npm run test:e2e
```

### Mobile
```bash
cd mobile
npm install
npx tsc --noEmit
npx jest
npx expo start
```

Copy `mobile/.env.example` to `mobile/.env` and fill local values.

## Local AI worker
See `local-ai/README.md`.

Quick setup on Windows:
```powershell
powershell -ExecutionPolicy Bypass -File scripts/setup-local-ai.ps1
```

Dry-run OpenCode first. When ready:
```powershell
powershell -ExecutionPolicy Bypass -File scripts/night-build.ps1
```

The autonomous worker may create local commits but must never push.
