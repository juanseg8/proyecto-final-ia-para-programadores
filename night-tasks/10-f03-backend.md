# Task 10 - F03 backend gestión ganadera

## Leer
- specs/features/F03-gestion-ganadera.md
- specs/features/F02-Establecimiento.md
- backend/src/app.module.ts
- backend/src/data-source.ts
- backend/src/entities/establishment.entity.ts
- backend/src/establishments/establishment.module.ts
- backend/src/establishments/establishment.controller.ts
- backend/src/establishments/establishment.service.ts
- backend/src/establishments/guards/establishment-ownership.guard.ts

## Crear
- backend/src/entities/herd.entity.ts
- backend/src/entities/animal.entity.ts
- backend/src/entities/weighing.entity.ts
- backend/src/entities/livestock-event.entity.ts
- backend/src/livestock/livestock.module.ts
- backend/src/livestock/livestock.controller.ts
- backend/src/livestock/livestock.service.ts
- backend/src/livestock/dto/herd.dto.ts
- backend/src/livestock/dto/animal.dto.ts
- backend/src/livestock/dto/weighing.dto.ts
- backend/src/livestock/dto/livestock-event.dto.ts
- backend/src/db/migrations/1790000000000-F03Livestock.ts

## Implementar
- endpoints y reglas exactas de F03;
- nested ownership: recurso ajeno/inexistente => 404;
- DELETE de rodeo con animales => 409;
- benchmark settings separado del DTO canónico F02;
- registrar entidades/módulo en data-source/AppModule.

No tests.
