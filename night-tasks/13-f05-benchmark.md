# Task 13 - F05 benchmark anónimo

## Leer
- specs/features/F05-benchmark-anonimo.md
- backend/src/app.module.ts
- backend/src/data-source.ts
- backend/src/entities/establishment.entity.ts
- backend/src/entities/indicator-snapshot.entity.ts
- backend/src/indicators/indicators.service.ts

## Crear
- backend/src/entities/benchmark-snapshot.entity.ts
- backend/src/benchmark/benchmark.module.ts
- backend/src/benchmark/benchmark.controller.ts
- backend/src/benchmark/benchmark.service.ts
- backend/src/benchmark/benchmark.config.ts
- backend/src/db/migrations/1790000002000-F05Benchmark.ts

Implementar k>=10, opt-in, exclusión del establecimiento consultante, relajación progresiva y respuesta sin datos individuales de terceros. Registrar config/módulo/entidad. No tests.
