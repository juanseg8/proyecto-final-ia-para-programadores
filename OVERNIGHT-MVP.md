# Agro Intelligence - NIGHT BUILD V8 FULL MVP

Objetivo: terminar MVP funcional. El modelo ejecuta specs ya definidas.

Queue: 02 navegación, 03 GeoRef, 04 UI, 05 mapa, 10 F03 backend, 11 F03 mobile, 12 F04, 13 F05, 14 F06, 15 F07, 16 F08, 17 F09, 18 integración.

Cada task: leer AGENTS, este archivo, plan, spec relevante y task; implementar; validar paths; compilar área; reparar compile máximo 2; commit local; continuar.

Sin Jest nocturno.
Backend gate: npm run build.
Mobile gate: npx tsc --noEmit.

Permitido editar backend producción/migrations/package/env example, mobile producción/package/env example, NIGHT_REPORT y README solo task18.
Prohibido root src, tests, .agents/runs, secretos, push/reset/clean/force.

Éxito: Task18 + compile final backend/mobile GREEN.
