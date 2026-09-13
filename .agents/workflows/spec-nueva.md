---
description: Crea la especificación de una feature nueva delegando en spec-autor
---

# Nueva especificación Hard-Delegated

Feature: **{ID de feature}**

Este workflow **prohíbe la ejecución monolítica**. Debes usar `invoke_subagent` para delegar la creación y el diálogo en `spec-autor`.

## 1. Bootstrap
Si `spec-autor` no está registrado en el runtime, regístralo leyendo su prompt de `.agents/agents/spec-autor/agent.md` mediante `define_subagent`.

## 2. Invocación
- Ejecuta `invoke_subagent` asignando a `spec-autor` (con `Workspace: 'inherit'`) la misión de dialogar con el usuario, recolectar información y escribir `specs/features/{ID}.md`.
- Transmítele la orden de usar `specs/_template/feature-spec.md` y hacer preguntas explícitas sobre invariantes, origen de los datos y casos límite.

## 3. Espera Pasiva
- **Detén tu ejecución** (no llames más tools) para permitir que `spec-autor` asuma el control de la conversación asíncrona.
- Cuando `spec-autor` devuelva el resultado de la spec consolidada, registra la finalización y actualiza `specs/000-index.md`.

## Reglas Críticas
No actúes asumiendo la personalidad de `spec-autor`. No redactes la spec tú mismo. Si la delegación falla, devuelve: `SDD_AGENT_DELEGATION_UNAVAILABLE: spec-autor`.
