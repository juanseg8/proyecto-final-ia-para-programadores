# Registro de decisiones

Memoria del proyecto entre sesiones. Los agentes escriben acá los patrones que se repiten,
las decisiones tomadas y los desvíos recurrentes, para no volver a discutirlos en la
próxima feature.

Formato: una entrada por decisión, la más reciente arriba.

---

## 2026-09-22 · Tolerancia a fallos en el Dashboard

**Contexto:** El dashboard principal (F09) integra módulos diversos: clima (externo), indicadores (cálculos pesados), alertas e IA. Si uno fallaba, se caía todo el endpoint.
**Decisión:** Se implementó un patrón *Partial Failure Tolerance* (Try/Catch) en el servicio agrupador del dashboard.
**Alternativas descartadas:** Dejar fallar el request entero y mostrar pantalla de error (mala UX).
**Invariantes afectados:** Ninguno.

---

## 2026-09-22 · Consolidación del entorno de IA

**Contexto:** El proyecto arrancó con una arquitectura experimental multi-agente hiper-compleja (Aider, OpenCode, Ollama, `.agents`). Resultaba inmanejable.
**Decisión:** Eliminar todos los scripts y agentes locales. Migrar y consolidar el desarrollo exclusivamente utilizando Antigravity como inteligencia central.
**Alternativas descartadas:** Mantener los scripts pero deshabilitados.
**Invariantes afectados:** INV-12 (Nuevo).
