# PLAN FINAL — UX01-FIX01

*Corrección de fidelidad visual y consistencia funcional móvil con TDD estricto por tarea.*

## Reglas Obligatorias
- **Fidelidad visual:** mockup > interpretación libre.
- **Funcionalidad:** spec F01/F02 > mockup.
- **Hard Delegation:** `test-autor` -> RED -> `mobile-dev` -> GREEN. `mobile-dev` NO modifica tests. Si hay defecto, reporta al orquestador.

## Fase 1: Regresiones Funcionales (TDD RED)
- `[x]` Tarea 1 — Navegación + Auto Refresh
  - `test-autor`: RED para error NAVIGATE actual, CREATE actualiza listado, UPDATE actualiza detalle/listado, DELETE actualiza listado. Regresos correctos tras operaciones. No usar hacks de setTimeout.
  - `mobile-dev`: GREEN con sincronización consistente.
- `[x]` Tarea 2 — GeoRef Service + Provincia/Localidad
  - `test-autor`: RED para carga/selección de provincia, selectores dependientes (limpieza), estados (loading/error/retry), payloads conservan string puro. Mocks de red.
  - `mobile-dev`: GREEN. Abstracción `mobile/src/services/georefService.ts`.

## Fase 2: Configuración Mapas y UI Foundation (TDD RED)
- `[x]` Tarea 3 — Google Maps
  - `test-autor`: RED de comportamiento GPS, marcadores, fallbacks manuales.
  - `mobile-dev`: GREEN conservando lógica `react-native-maps`, usando `PROVIDER_GOOGLE`, separando API keys seguras.
- `[x]` Tarea 4 — Foundation + idioma
  - `test-autor`: RED semántico (AppButton, AppInput, roles, labels, disabled, etc.) comprobando textos en español. Sin snapshots gigantes.
  - `mobile-dev`: GREEN consolidando los componentes.

## Fase 3: Refactor Visual y Mockup (TDD RED)
- `[x]` Tarea 5 — Login + Register
  - `test-autor`: RED protegiendo auth, flujos, errores, roles y textos en español.
  - `mobile-dev`: GREEN acercando visualmente ambas pantallas al mockup (branding, anchos, jerarquía, inputs, CTA).
- `[x]` Tarea 6 — Home + navegación principal
  - `test-autor`: RED protegiendo navegación permitida, saludo y Bottom Nav puro sin F03+.
  - `mobile-dev`: GREEN aplicando Mockup (avatar dinámico "Juan Pérez -> JP", fallback seguro, Hero Card decorativa, layout).
- `[x]` Tarea 7 — Mis establecimientos
  - `test-autor`: RED protegiendo empty state, lectura, creación y DTO (`superficieHa`). Sin fotos de Backend.
  - `mobile-dev`: GREEN con fidelidad visual (Cards, iconos, placeholder visual sin imageUrl).
- `[x]` Tarea 8 — Formulario
  - `test-autor`: RED para endpoints, selectores GeoRef, mapa, GPS y payload canónico intacto.
  - `mobile-dev`: GREEN implementando jerarquía visual, selects y mapas coherentes.
- `[x]` Tarea 9 — Detalle + Delete
  - `test-autor`: RED para lectura de detalle, INV-05, ConfirmDialog de borrado y regresos de ruta.
  - `mobile-dev`: GREEN para jerarquía visual (ubicación, superficie, Editar vs Eliminar destructivo).

## Fase 4: Gates y Auditoría
- `[ ]` Tarea 10 — Gate Mobile
  - `orquestador`: Ejecutar `npx jest` y `npx tsc --noEmit`. Todo F01/F02 + UX01 en GREEN.
- `[ ]` Tarea 11 — Visual Fidelity Gate
  - `USER`: DETENER automatización. Validación manual con capturas reales vs mockup oficial.
- `[ ]` Tarea 12 — Auditoría Final
  - `spec-verificador`: Revisar mockup vs implementación vs Specs.
  - `revisor-seguridad`: Comprobar que no haya regresiones (Auth, INV-05, Config maps, DTO).
