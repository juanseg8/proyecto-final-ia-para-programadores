---
name: agro-ia-contract
description: Contrato del módulo Agro IA: tools autorizadas, esquema del contexto, prompt de sistema, guardrails y fallback.
---

# Contrato del módulo Agro IA

Principio: el LLM **explica**, no calcula, no consulta y no decide.

## Tools autorizadas

Son las únicas. No agregues una tool genérica de consulta ni una que acepte SQL.

| Tool | Devuelve | Restricción |
|------|----------|-------------|
| `getFarmSummary(farmId)` | Datos del establecimiento, ubicación, actividad, escala | Solo el del usuario autenticado |
| `getHerdMetrics(herdId)` | GMD, peso promedio, evolución, cabezas | Valida pertenencia del rodeo |
| `getBenchmark(herdId \| farmId)` | Mediana, percentiles, tamaño del grupo, criterios | Aplica k-anonimato antes de responder |
| `getActiveAlerts(farmId)` | Alertas vigentes con severidad y desvío | Solo del propio establecimiento |
| `getRecentWeighings(herdId)` | Últimos pesajes | Límite fijo de registros |
| `getFarmWeather(farmId)` | Clima actual y pronóstico corto | Sin histórico extenso en el MVP |

## Esquema del contexto

El backend construye el contexto y lo valida contra un JSON Schema estricto **antes** de
llamar al modelo. Si no valida, no se llama al modelo.

```json
{
  "farm":    { "name", "province", "activity", "system", "heads" },
  "herd":    { "name", "category", "headCount" },
  "indicators": [{ "type", "value", "unit", "periodStart", "periodEnd" }],
  "benchmark":  { "type", "median", "p25", "p75", "peerGroupSize",
                  "relativePosition", "criteria" },
  "alerts":     [{ "ruleCode", "severity", "deviation", "title" }],
  "weather":    { "tempC", "humidity", "rain7dMm" },
  "dataQuality":{ "weighingsCount", "lastWeighingDate" }
}
```

Si el peer group no alcanza k, el bloque `benchmark` se omite entero. El asistente explica
el indicador propio aclarando que no hay comparación disponible.

## Prompt de sistema

Reglas que no se pueden ablandar:

1. Usar únicamente datos del bloque CONTEXTO. No inventar ni estimar números.
2. No recalcular ningún indicador. Los valores dados son definitivos.
3. Si falta el dato, decir explícitamente que no se cuenta con esa información. Nunca
   completar el vacío con una suposición.
4. Puede sugerir factores a revisar. No puede afirmar causalidad.
5. No emite diagnóstico veterinario ni indicación sanitaria.
6. Aclara que el benchmark es una comparación estadística anónima, no una evaluación del
   productor.
7. Lenguaje del dominio ganadero, sin jerga de software.
8. Máximo 150 palabras salvo pedido explícito de más detalle.

## Guardrails de salida

Se aplican **antes** de devolver la respuesta, en este orden:

1. **Numérico.** Extraer todo número del texto generado y verificar que exista en el contexto
   enviado, con tolerancia de redondeo. Si aparece uno que el motor determinístico no
   produjo, se descarta la respuesta entera. No se corrige el número: se descarta.
2. **De alcance.** Detectar formulaciones de diagnóstico o prescripción sanitaria y bloquear.
3. **De formato.** Longitud y estructura esperadas.

## Fallback

| Falla | Comportamiento |
|-------|----------------|
| Timeout o error del proveedor | 200 con indicadores, benchmark y alertas; `aiExplanation: null` y aviso |
| Guardrail numérico rechaza | Se descarta la respuesta, se persiste con `guardrailPassed: false`, se muestra la vista determinística |
| Contexto no valida | No se llama al modelo; se informa falta de información suficiente |
| Peer group < k | Contexto sin bloque benchmark; el asistente lo aclara |
| Usuario supera el límite | Rate limiting con mensaje explícito |

La regla detrás de toda esta tabla: **el producto nunca queda roto porque falló el LLM.**
El valor central son los indicadores y la comparación, que son determinísticos.

## Auditoría

Toda llamada persiste en `ai_interactions`: pregunta, respuesta, tools invocadas, contexto
enviado, modelo, resultado del guardrail, timestamp. También las rechazadas — sobre todo
las rechazadas, que son las que hay que revisar.
