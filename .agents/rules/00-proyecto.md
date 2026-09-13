---
trigger: always_on
description: Reglas del proyecto Agro Intelligence Network y metodología spec-anchored
---

Plataforma de inteligencia ganadera colaborativa. App móvil (React Native + Expo + TypeScript)
sobre API NestJS + TypeORM + PostgreSQL. El diferenciador es el benchmarking anónimo entre
establecimientos comparables.

## Metodología: spec-anchored development

La especificación vive en `specs/` y es la fuente de verdad. Código y spec evolucionan juntos.

- `specs/constitution.md` — invariantes no negociables del sistema. **Leelo antes de cualquier
  tarea que toque benchmark, IA, autorización o alertas.**
- `specs/000-index.md` — índice de features y su estado.
- `specs/features/FXX-*.md` — una spec por feature. Describe QUÉ, no CÓMO.
- `specs/domain/glosario.md` — vocabulario del dominio. Usalo en nombres de código y en UI.
- `PLAN.md` — plan de ejecución de la tarea en curso. Es volátil y no se versiona.

Regla central: **si cambiás comportamiento, actualizá la spec en el mismo cambio**. Una spec
desactualizada es peor que no tener spec, porque el próximo agente confía en ella.

## Ciclo de trabajo

Usá el workflow `/sdd-ciclo` para el ciclo completo: spec → plan → tests → implementación
→ verificación → actualización de spec. No implementes features completas en una sola sesión.

## Reglas duras (resumen de la constitución)

1. Ningún número que ve el usuario proviene del LLM. Todo cálculo es determinístico.
2. Un benchmark no se publica con menos de 10 establecimientos en el peer group.
3. La respuesta de benchmark nunca contiene datos individuales de terceros.
4. Todo endpoint con identificador valida ownership contra el usuario autenticado.
5. El módulo de IA no accede a la base de datos: solo a las tools declaradas.
6. Si el LLM falla, los indicadores determinísticos siguen visibles.
7. Los umbrales son configuración validada al arranque, no literales en el código.

## Convenciones

- Español para dominio, negocio, comentarios y UI. Inglés para identificadores de código.
- Vocabulario del dominio en la UI: establecimiento, rodeo, cabezas, pesaje, GMD, recría.
  Nunca "registro", "entidad" o "instancia" en texto visible al usuario.
- Backend: un módulo NestJS por dominio. DTOs con class-validator en todo endpoint.
  Guards de ownership, nunca validación de pertenencia dentro del service.
- Tests: Jest. El test del invariante se escribe antes que la implementación.
- Commits: conventional commits en inglés (`feat:`, `fix:`, `test:`, `docs:`, `chore:`).
  La historia de commits es evidencia evaluable del proceso: commits chicos y progresivos.

## Qué NO hacer

- No agregar Redis, Kafka, PostGIS, microservicios ni ML. Están fuera del MVP a propósito.
- No mover cálculos al LLM "porque es más simple".
- No relajar k=10 para que el benchmark "muestre algo" durante el desarrollo. Usá seeds con
  volumen suficiente en su lugar.
- No hardcodear umbrales para una demo.
