# Task 12 - F04 indicadores determinísticos

## Leer
- specs/features/F04-indicadores.md
- backend/src/app.module.ts
- backend/src/data-source.ts
- backend/src/entities/establishment.entity.ts
- backend/src/entities/herd.entity.ts
- backend/src/entities/animal.entity.ts
- backend/src/entities/weighing.entity.ts
- backend/src/entities/livestock-event.entity.ts
- backend/src/livestock/livestock.service.ts

## Crear
- backend/src/entities/indicator-snapshot.entity.ts
- backend/src/indicators/indicators.module.ts
- backend/src/indicators/indicators.controller.ts
- backend/src/indicators/indicators.service.ts
- backend/src/db/migrations/1790000001000-F04Indicators.ts

Implementar exactamente GMD, cabezas activas, carga animal, mortandad y costo/kg según F04. Ningún cálculo depende del LLM. Registrar módulo/entidad. No tests.
