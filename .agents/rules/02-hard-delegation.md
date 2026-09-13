---
description: Reglas de delegación estricta (Hard Delegation) para el motor agentic
---

# SDD-HARD-01 — Prohibición de simulación
Si un workflow requiere un agente especializado:
* DEBE utilizar una invocación real de subagente usando la tool nativa `invoke_subagent` (o su homóloga provista por el runtime).
* Está estrictamente prohibido adoptar su personalidad.
* Está estrictamente prohibido simular su respuesta.
* Está estrictamente prohibido decir "actuando como...".
* Leer un archivo `agent.md` NO cuenta como delegación.

# SDD-HARD-02 — Orquestador no implementa
`sdd-orquestador` (el agente principal) tiene permitido modificar:
* Archivos de trazabilidad.
* `PLAN.md` y estados del workflow.
* Configuración puramente operativa necesaria para ejecutar gates (ej. `tsconfig.json`, settings de lint, dependencias de tests), **únicamente** cuando no modifica comportamiento funcional.
* Leer specs, planificar, delegar, recibir resultados y decidir.

No puede bajo ninguna circunstancia:
* Escribir lógica de negocio.
* Implementar componentes productivos, Services, Controllers, Hooks, Contexts o UI.
* Escribir los tests funcionales de la tarea.
* Implementar código destinado a hacer pasar tests.
* Hacer code review de su propio código.
* Hacer security review o autoaprobar cumplimiento de spec.

El orquestador **nunca** debe usar la excepción de tooling para implementar una feature.

# SDD-HARD-03 — Fail closed
Si un agente requerido no puede ser definido o invocado:
ABORTAR el workflow.
Formato de salida esperado en consola/respuesta:
`SDD_AGENT_DELEGATION_UNAVAILABLE: <agent-name>`
Nunca continuar en modo monolítico. No existe fallback de "lo hago yo".

# SDD-HARD-04 — Resultado verificable
Toda delegación debe producir trazabilidad mínima por ciclo de delegación, registrada idealmente en `.agents/runs/`.
Campos mínimos a persistir en cada paso:
* `agent`: El agente invocado.
* `delegatedTask`: Descripción de la tarea.
* `conversationId` / `subagentId`: Identificador asíncrono real si aplica.
* `status`: Estado actual.
* `filesCreated` / `filesModified`: Impacto real.
* `commandsExecuted` / `testsExecuted`: Aserciones físicas logradas.
* `result`: PASS / FAIL.
* `blockers`: Bloqueos encontrados.
No inventar campos que el runtime no proporcione; registrar solamente evidencia real asíncrona.
