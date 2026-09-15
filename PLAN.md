# PLAN de Ejecución: F02 — Establecimiento y ubicación

**Feature Spec:** `specs/features/F02-Establecimiento.md`
**Invariantes:** INV-05

*Nota: Estructura TDD estricta (test-autor -> RED -> dev -> GREEN) por bloque funcional.*

## Tarea 1 — Modelo Establishment + Migración
- `[x]` **test-autor:** RED tests para entidad, ManyToOne User, userId obligatorio, campos completos y UNIQUE(userId, normalizedName).
- `[x]` **backend-dev:** Implementar entidad, relación, migración, índices. Ejecutar tests, migration run/revert/run hasta GREEN.

## Tarea 2 — Crear y listar establecimientos
- `[x]` **test-autor:** RED tests para POST (201, 400 por campos inyectados o inválidos, 409 duplicados) y GET (solo propios, sin exponer ownership manipulable).
- `[x]` **backend-dev:** Implementar DTOs, normalización, service, controller. GREEN.

## Tarea 3 — Detalle + INV-05
- `[x]` **test-autor:** RED tests para GET /:id (200 propio, 404 ajeno/inexistente, 401 unauth).
- `[x]` **backend-dev:** Implementar. GREEN.

## Tarea 4 — Edición + INV-05
- `[x]` **test-autor:** RED tests para PUT /:id (edición válida, renombre con 409, campos prohibidos 400, ajeno/inexistente 404).
- `[x]` **backend-dev:** Implementar. GREEN.

## Tarea 5 — Eliminación física + INV-05
- `[x]` **test-autor:** RED tests para DELETE /:id (físico, GET posterior 404, ajeno/inexistente 404, sin soft delete).
- `[x]` **backend-dev:** Implementar. GREEN.

## Tarea 6 — Gate Backend F02
- `[x]` Ejecutar `npm test`, `npm run test:e2e`, `npm run test:cov`, `npm run build`. Verificar migraciones UP/DOWN. 100% GREEN.

## Tarea 7 — Mobile: navegación y listado
- `[x]` **test-autor:** RED tests para Home -> Mis establecimientos, estado vacío, navegación.
- `[x]` **mobile-dev:** Implementar (sin mapa/GPS todavía). GREEN.

## Tarea 8 — Mobile: formulario básico
- `[x]` **test-autor:** RED tests para campos básicos, payload limpio (sin userId), manejo 400/409.
- `[x]` **mobile-dev:** Implementar formulario. GREEN.

## Tarea 9 — Mobile: ubicación mediante mapa
- `[x]` **test-autor:** RED tests agnósticos para selección de punto, marcador editable y coordenadas en form.
- `[x]` **mobile-dev:** Implementar mapa (decisión técnica interna). GREEN.

## Tarea 10 — Mobile: GPS y permisos
- `[x]` **test-autor:** RED tests para flujo concedido, flujo denegado (no bloqueante), y manejo de error.
- `[x]` **mobile-dev:** Implementar. GREEN.

## Tarea 11 — Mobile: detalle, edición y eliminación
- `[x]` **test-autor:** RED tests para detalle, actualización, warning DELETE y retorno a lista.
- `[x]` **mobile-dev:** Implementar lógica cruzada con form preexistente. GREEN.

## Tarea 12 — Gate Mobile
- `[x]` Ejecutar tests, tsc, lint y/o expo checks reales configurados.

## Tarea 13 — Auditoría independiente
- `[x]` `invoke_subagent(spec-verificador)`: Auditoría integral F02 vs spec y ACs.
- `[x]` `invoke_subagent(revisor-seguridad)`: Auditoría INV-05 en DB y Controllers.
- `[x]` (Ambos deben reportar PASS verificable, sin bloqueos ni features falsas).
