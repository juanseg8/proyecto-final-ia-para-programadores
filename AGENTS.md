# Agro Intelligence - Project Instructions

Fuente de verdad: constitution -> index -> feature spec -> UX01 si UI -> implementación.

Stack: NestJS + TypeORM + PostgreSQL; React Native + Expo + TypeScript. Producción solo backend/ y mobile/. Nunca root src/.

F01/F02 existen. F03-F09 están definidos para completar MVP.

Invariantes: números determinísticos fuera LLM; benchmark k>=10, sin datos individuales, opt-in; ownership; IA sin DB; fallback IA; auditoría IA; thresholds config; secretos fuera mobile; IA no diagnostica.

NIGHT_BUILD: task -> implement -> compile -> reparación mínima -> commit local -> siguiente. No crear/reparar/ejecutar tests nocturnos.

No escanear repo recursivamente. No node_modules, .git, dist/build/coverage, .agents/runs ni tests.
Nunca push, force push, reset --hard, clean -fd.
UI español, RN primitives, UX01/shared components, sin métricas falsas ni emoji Unicode de producción.
