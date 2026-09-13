# Constitución — Agro Intelligence Network

Reglas no negociables del sistema. Toda spec de feature las hereda. Ninguna spec puede
relajarlas; solo puede endurecerlas. Un cambio a este archivo es una decisión de arquitectura
y requiere actualizar el informe de la entrega.

Cada invariante tiene: un ID, un enunciado verificable y el test que lo prueba. Si un
invariante no tiene test, no está cumplido: está declarado.

---

## INV-01 · Ningún número mostrado al usuario proviene del LLM

Todo valor numérico visible (GMD, carga animal, mortandad, mediana, percentiles, desvíos)
se calcula en el backend con lógica determinística. El LLM recibe esos valores ya calculados
y solo los explica.

**Verificación:** test que envía un contexto conocido al servicio de IA, mockea el LLM para
que devuelva un número inexistente en el contexto, y espera que el guardrail rechace la
respuesta.
**Test:** `test/ai/guardrail-numeric.spec.ts`

---

## INV-02 · Un benchmark no se publica con menos de 10 establecimientos

`peerGroupSize >= 10` es condición de publicación. Si el segmento no llega, se amplía según
el orden definido en `specs/features/F05-benchmark.md`. Si tras ampliar no llega, la respuesta
es `DATOS_INSUFICIENTES` y no incluye ningún valor agregado.

**Verificación:** test con 9 establecimientos en el segmento que espera `DATOS_INSUFICIENTES`
y ausencia total de campos `median`, `p25`, `p75` en la respuesta.
**Test:** `test/benchmark/k-anonymity.spec.ts`

---

## INV-03 · La respuesta de benchmark nunca contiene datos individuales de terceros

El DTO de benchmark expone únicamente: `median`, `p25`, `p75`, `peerGroupSize`,
`relativePosition` y `criteria` a nivel categoría. No expone listas de establecimientos,
identificadores, ni registros individuales, ni siquiera anonimizados.

**Verificación:** test de contrato sobre el DTO que falla si aparece cualquier campo fuera
de la lista permitida.
**Test:** `test/benchmark/dto-contract.spec.ts`

---

## INV-04 · La participación en el benchmark es opt-in y reversible

Un establecimiento con `participatesInBenchmark = false` no integra ningún peer group.
Desactivarlo tiene efecto en el siguiente cálculo, sin intervención manual.

**Verificación:** test que desactiva el flag y verifica que el establecimiento desaparece
del peer group y que `peerGroupSize` baja en uno.
**Test:** `test/benchmark/opt-in.spec.ts`

---

## INV-05 · Todo endpoint que recibe un identificador valida ownership

Ningún recurso se resuelve solo por ID. Se valida que el recurso pertenezca al
establecimiento del usuario autenticado. Vale para farms, herds, animals, weighings,
events, indicators, alerts y ai.

**Verificación:** test parametrizado que recorre todos los endpoints con parámetro de ruta
y verifica 403 o 404 con el ID de otro usuario.
**Test:** `test/security/ownership.spec.ts`

---

## INV-06 · El LLM no accede a la base de datos

El módulo de IA solo puede leer datos a través de las tools declaradas en
`specs/features/F08-agro-ia.md`. No hay SQL generado por el modelo, ni tool genérica de
consulta, ni acceso al repositorio de TypeORM desde el servicio de IA.

**Verificación:** test de arquitectura que falla si el módulo `ai` importa un repositorio,
un DataSource o un QueryBuilder.
**Test:** `test/architecture/ai-isolation.spec.ts`

---

## INV-07 · Si el LLM falla, el producto sigue funcionando

Timeout, error del proveedor, guardrail rechazado o contexto inválido devuelven los
indicadores, el benchmark y las alertas con un aviso de que la explicación no está
disponible. Nunca un error que rompa la pantalla.

**Verificación:** test que mockea el proveedor con timeout y espera 200 con los datos
determinísticos presentes y `aiExplanation: null`.
**Test:** `test/ai/fallback.spec.ts`

---

## INV-08 · Toda interacción con el LLM se persiste

Cada llamada escribe una fila en `ai_interactions` con pregunta, respuesta, tools invocadas,
contexto enviado, modelo y resultado del guardrail. También las rechazadas.

**Verificación:** test que provoca un rechazo de guardrail y verifica la fila con
`guardrailPassed = false`.
**Test:** `test/ai/audit-log.spec.ts`

---

## INV-09 · Los umbrales son configuración, no código

Los umbrales de alerta (BEN-01/02/03/04, HIS-01/02/03, EST-01/02) y el valor de k viven en
configuración tipada y validada al arranque. No aparecen como literales en la lógica.

**Verificación:** test que cambia el umbral por configuración y verifica que cambia la
severidad de la alerta generada, sin tocar código.
**Test:** `test/alerts/thresholds-config.spec.ts`

---

## INV-10 · Ninguna credencial sale hacia el cliente

Las API keys (LLM, clima) viven en variables de entorno del backend. La app móvil nunca
llama a un servicio externo que requiera credenciales. `.env` está fuera del repositorio.

**Verificación:** chequeo en CI que falla si aparece una clave con forma de secreto en el
bundle de la app o en el repositorio.
**Test:** `scripts/check-secrets.sh` en el pipeline.

---

## INV-11 · La IA no diagnostica

El asistente puede señalar factores a revisar. No puede afirmar causalidad, ni emitir
indicación sanitaria o veterinaria.

**Verificación:** conjunto de casos de evaluación con preguntas que inducen diagnóstico;
el guardrail de alcance debe rechazar las respuestas que lo emitan.
**Test:** `test/ai/scope-guardrail.spec.ts`

---

## Cómo usar esta constitución

- Antes de implementar cualquier tarea, identificar qué invariantes toca.
- El test del invariante se escribe **antes** que la implementación.
- Un PR que toca benchmark o IA sin ejecutar los tests de INV-01 a INV-08 no se mergea.
- Si una decisión de implementación entra en conflicto con un invariante, se detiene la
  implementación y se discute el invariante. No se implementa la excepción en silencio.
