# Agro Intelligence - Project Instructions

Fuente de verdad: specs/constitution.md → specs/000-index.md → spec de la feature → specs/ui/UX01-Design-System.md cuando corresponda → implementación.

Stack: NestJS + TypeORM + PostgreSQL; React Native + Expo + TypeScript. Producción solo en backend/ y mobile/. Nunca crear src/ en raíz.

Invariantes: números visibles determinísticos, benchmark k>=10 sin datos individuales y opt-in, ownership de recursos, IA sin DB directa, fallback de IA, auditoría IA, thresholds configurables, secretos fuera del mobile y sin diagnóstico veterinario.

NIGHT_BUILD: cada task es autocontenida. Leer solo los paths indicados por esa task y sus imports directos cuando sean imprescindibles. Implementar → compilar → reparación mínima → commit local → siguiente.

No leer/editar/ejecutar tests durante NIGHT_BUILD. No node_modules, .git, dist/build/coverage ni .agents/runs.
Nunca push, force push, reset --hard, clean -fd ni rewrite history.

UI: español, React Native primitives, UX01/shared components, sin métricas falsas ni emojis Unicode como iconografía de producción.
