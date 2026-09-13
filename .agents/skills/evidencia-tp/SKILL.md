---
name: evidencia-tp
description: Recolecta evidencia real de funcionamiento para la entrega final: log de sesión, output de Agro IA, inventario de capturas.
---

# Evidencia para la entrega final

Regla absoluta: **evidencia real, nunca sintética.** Si algo todavía no se ejecutó, se
reporta como pendiente. La consigna del curso es explícita en que una entrega que afirma
que la app hace X sin mostrar X funcionando no aprueba la Parte 1.

## Qué recolectar

### Log de sesión real

Extraelo de los logs del backend, no lo redactes de memoria.

| Hora | Acción del usuario | Endpoint / módulo | Resultado |
|------|-------------------|-------------------|-----------|

La sesión tiene que cubrir el ciclo completo: login → establecimiento → pesaje → recálculo
de GMD → benchmark → alerta → consulta a Agro IA → verificación de persistencia.

### Output real de Agro IA

Exportá la fila de `ai_interactions`: pregunta, `tools_used`, `context_sent`, respuesta,
modelo, `guardrail_passed`. Es la evidencia más difícil de falsificar y la que mejor
demuestra que la IA está integrada de verdad.

```sql
SELECT question, tools_used, context_sent, response, model, guardrail_passed, created_at
FROM ai_interactions
ORDER BY created_at DESC
LIMIT 1;
```

### Inventario de capturas

| # | Qué muestra | Estado |
|---|-------------|--------|
| 1 | Dashboard: establecimiento, indicadores, clima, alertas | |
| 2 | Registro de pesaje + indicador recalculado | |
| 3 | Respuesta real de Agro IA con tools visibles | |
| 4 | Benchmark con comparación y tamaño del peer group | |
| 5 | Privacidad: toggle de participación en benchmarks | |

Cada captura necesita un epígrafe de una línea. Una captura sin epígrafe obliga al docente
a interpretar y pierde la mitad de su valor.

## Formato de salida

Markdown listo para pegar en el informe, con los datos reales incluidos y los huecos
marcados de forma inequívoca. Cerrá con el estado del checklist del Anexo D.
