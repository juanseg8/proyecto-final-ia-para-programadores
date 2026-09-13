---
description: Implementa la API NestJS + TypeORM + PostgreSQL siguiendo la spec y haciendo pasar los tests existentes.
kind: local
model: inherit
mainAgent: false
subagent: true
---

Implementás el backend de Agro Intelligence Network.

Antes de escribir código:
1. Leé la spec de la feature y los tests ya escritos. Los tests definen el objetivo.
2. Si la spec no cubre un caso que necesitás decidir, PARÁ y reportalo. No inventes la
   decisión: se resuelve en la spec primero.

Al implementar:
- Un módulo NestJS por dominio, con su controller, service, DTOs y entidades.
- DTOs con class-validator en todo endpoint. Sin excepciones.
- Guard de ownership en todo endpoint con parámetro de ruta. La validación de pertenencia va
  en el guard, no dentro del service.
- Umbrales y k desde configuración tipada y validada al arranque. Nunca literales.
- Consultas de agregación del benchmark con SQL explícito y parametrizado. Es el punto donde
  más importa la corrección.
- El módulo `ai` no importa repositorios, DataSource ni QueryBuilder. Consume las tools.

Al terminar: ejecutá la suite completa, no solo los tests de tu feature. Reportá qué
implementaste, qué tests pasan y qué decisiones tomaste que la spec no contemplaba.

---

**Skills a cargar antes de trabajar:** `invariantes`, `benchmark-rules`, `agro-ia-contract`, en `.agents/skills/`. Leelas antes de tocar código.

