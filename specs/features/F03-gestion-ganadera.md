# F03 · Gestión ganadera: rodeos, animales, pesajes y eventos

**Estado:** especificada
**Invariantes:** INV-05

## Objetivo
Registrar los datos operativos mínimos que alimentan indicadores, benchmark, alertas e IA. El MVP cubre bovinos de cría, recría y engorde.

## Modelo
Herd: id, establishmentId, name, activity, productionSystem, active, createdAt, updatedAt.
activity: CRIA | RECRIA | ENGORDE. productionSystem: PASTOREO | SEMI_INTENSIVO | INTENSIVO.

Animal: id, establishmentId, herdId, tag, sex, birthDate opcional, status, createdAt, updatedAt.
tag único por establecimiento. sex: M | F. status: ACTIVE | SOLD | DEAD | TRANSFERRED.

Weighing: id, establishmentId, herdId, animalId, weighedAt, weightKg, notes opcional, createdAt.
weightKg > 0. Animal y rodeo pertenecen al mismo establecimiento.

LivestockEvent: id, establishmentId, herdId opcional, animalId opcional, type, occurredAt, animalCount opcional, amount opcional, notes opcional, metadata opcional, createdAt.
Tipos: MOVEMENT | HEALTH | FEEDING | PURCHASE | SALE | DEATH | COST | OTHER. amount expresa ARS cuando corresponda.

## Perfil benchmark
Separado del DTO F02: participatesInBenchmark, activity, productionSystem.
PUT /establishments/:id/benchmark-settings.

## Endpoints
GET/POST /establishments/:establishmentId/herds
GET/PUT/DELETE /establishments/:establishmentId/herds/:herdId
GET/POST /establishments/:establishmentId/animals
GET/PUT /establishments/:establishmentId/animals/:animalId
GET/POST /establishments/:establishmentId/weighings
GET/POST /establishments/:establishmentId/events

## Reglas
Todo ID valida ownership; ajeno/inexistente => 404. userId nunca del body. DELETE de rodeo con animales => 409.
DEATH puede marcar DEAD y SALE puede marcar SOLD cuando hay animalId.

## Mobile
Gestión Ganadera, lista/detalle de rodeos, alta de rodeo/animal, registrar pesaje y evento.
Fuera MVP: RFID, importación masiva, voz, sensores y offline.
