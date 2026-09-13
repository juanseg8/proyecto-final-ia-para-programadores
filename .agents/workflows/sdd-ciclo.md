---
description: Flujo de orquestación asíncrona real mediante subagentes nativos
---

# Ciclo SDD Hard-Delegated

Feature solicitada: **{ID de feature}**

Este workflow rige la ejecución del orquestador. **Prohibida la ejecución monolítica.** Debes usar herramientas nativas asíncronas de Antigravity (`define_subagent`, `invoke_subagent`, `send_message`, `manage_subagents`) para cada paso.

## 0. Bootstrap de Subagentes
Lee cada archivo `.agents/agents/<nombre>/agent.md` correspondiente a los agentes que necesitarás.
Ejecuta la tool `define_subagent` para registrarlos en el runtime (al menos: `spec-autor`, `test-autor`, `backend-dev`, `mobile-dev`, `spec-verificador`, `revisor-seguridad`).
Si un agente ya existe, ignora el error. Si no logras registrar o invocar a un agente, interrumpe el ciclo con: `SDD_AGENT_DELEGATION_UNAVAILABLE: <nombre>`.

## 1. Anclar y Planificar
El orquestador lee la Spec y los Invariantes.
Escribe el archivo `PLAN.md` y registra la lista de tareas.
**Detén la ejecución** para obtener aprobación explícita del humano (`HUMAN APPROVAL`).

## 2. Ciclo por Tarea (TDD Obligatorio)
Para cada tarea definida en `PLAN.md`, sigue este bucle exacto. En cada invocación asíncrona usa `Workspace: 'inherit'`.

### Paso 2.1: Tests (RED)
- Llama a `invoke_subagent` con `TypeName: "test-autor"`. Envíale el contexto de la tarea y pídele escribir los tests.
- **Espera pasiva:** Termina tu turno. El motor te despertará cuando `test-autor` envíe los resultados.
- Verifica que los tests corran y estén en ROJO. Si están verdes sin código justificado, devuelve a `test-autor` mediante `send_message`.

### Paso 2.2: Implementación (GREEN)
- Llama a `invoke_subagent` con `TypeName: "backend-dev"` o `"mobile-dev"`. Envíale los tests rojos, la spec y la tarea.
- **Espera pasiva:** Termina tu turno.
- Cuando el desarrollador termine, verifica que los tests estén VERDES.

### Paso 2.3: Validación Concurrente o Secuencial
- **Code/Spec Audit:** Llama a `invoke_subagent` con `TypeName: "spec-verificador"`. Pídele: "Auditá esta implementación contra X". **Espera pasiva.**
- **Security Audit (si aplica):** Si la tarea toca seguridad/auth/privacy/IA, llama a `invoke_subagent` con `TypeName: "revisor-seguridad"`. **Espera pasiva.**
- **Evaluación del Orquestador:** No modifiques el veredicto de los verificadores.
  * Si responden `FAIL`: Toma sus findings, envíalos de vuelta a `backend-dev`/`mobile-dev` usando `send_message` (por su conversationId) pidiendo corrección. Repite el proceso de testing.
  * Si responden `PASS`: Avanza al siguiente paso.

## 3. Trazabilidad de la Tarea
Registra la evidencia física de esta tarea en `.agents/runs/{ID de feature}/traceability.md`.
Por cada delegación anota:
* `agent`: Nombre del rol
* `delegatedTask`: Misión solicitada
* `conversationId`: ID real arrojado por Antigravity
* `status`: Completado / Fallido
* `filesModified`: Archivos modificados por el subagente
* `testsExecuted`: Resultado de comandos
* `blockers`: Obstáculos enfrentados

Luego, marca la tarea como `[x]` en `PLAN.md`.

## 4. Cerrar
Una vez terminado el `PLAN.md`:
* Genera el log final de trazabilidad.
* Solicita la invocación de `evidencia-tp` para documentar si aplica.
* Abandona el workflow.

**Regla de Espera:** Nunca continúes generando texto o asumiendo el trabajo mientras "esperas" a un subagente. Finaliza la llamada de herramientas para ceder el control al motor de Antigravity.
