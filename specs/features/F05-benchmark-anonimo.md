# F05 · Benchmark anónimo

**Estado:** especificada
**Invariantes que toca:** INV-02, INV-03, INV-04, INV-05, INV-09
**Trazabilidad:** informe de entrega final, sección 7 (Especificación del benchmarking)

Esta spec sirve además como ejemplo del nivel de detalle esperado. El benchmark es el
componente de mayor riesgo del producto, así que está especificado fino. Un CRUD de rodeos
se especifica mucho más grueso.

---

## Contexto

Es el diferenciador del producto. Un indicador aislado no permite decidir: 640 g/día puede
ser muy bueno o muy malo. El benchmark responde "¿comparado con qué?" usando datos agregados
de establecimientos productivamente similares, sin exponer los datos de ninguno.

El riesgo específico no es técnico convencional: si un productor puede inferir de quién
provienen los datos de un segmento, el producto pierde la confianza que lo hace posible.

## Usuarios

Productor ganadero (principal), asesor agropecuario y veterinario (consulta).

---

## Requisitos funcionales

**RF-01.** Dado un rodeo con al menos un indicador calculado, el sistema construye un grupo
comparable de establecimientos según las dimensiones de la tabla de peer group.

**RF-02.** El grupo comparable incluye únicamente establecimientos con
`participatesInBenchmark = true`.

**RF-03.** Si el grupo comparable tiene menos de `K_MIN` establecimientos, el sistema amplía
el segmento en el orden definido, una dimensión por vez, recalculando después de cada
ampliación.

**RF-04.** Si tras agotar las ampliaciones el grupo sigue por debajo de `K_MIN`, el sistema
devuelve `DATOS_INSUFICIENTES` sin ningún valor agregado.

**RF-05.** Cuando el grupo alcanza `K_MIN`, el sistema calcula mediana, percentil 25,
percentil 75 y la posición relativa del establecimiento consultante respecto de la mediana,
expresada en porcentaje con un decimal.

**RF-06.** El sistema persiste un `BenchmarkSnapshot` con el resultado y los criterios
efectivamente aplicados en el campo `peerCriteria`.

**RF-07.** La respuesta expone los criterios aplicados a nivel categoría, de forma que el
usuario pueda saber contra qué grupo se lo comparó.

**RF-08.** El endpoint valida que el rodeo o establecimiento consultado pertenezca al usuario
autenticado.

**RF-09.** `K_MIN` y los rangos de escala provienen de configuración validada al arranque.

---

## Reglas del peer group

| Dimensión | Criterio inicial | ¿Se relaja? | Orden de relajación |
|-----------|-----------------|-------------|---------------------|
| Actividad | Exacta | Nunca | — |
| Período | Ventana móvil 12 meses | Nunca | — |
| Participación | Solo opt-in activo | Nunca | — |
| Escala | Cabezas ±30 % | Sí, a ±50 % | 2 |
| Región | Provincia | Sí: provincia → región productiva → nacional | 1 y 3 |
| Sistema productivo | Exacto | Sí, agrupa pastoreo + semi-intensivo | 4 |

Justificación del orden: relajar la región mantiene la comparación válida desde el punto de
vista productivo. Relajar la actividad no: comparar recría con cría produce un número que
parece información y no lo es.

---

## Contrato de la respuesta

Campos permitidos, y ningún otro:

```
{ median, p25, p75, peerGroupSize, relativePosition, criteria }
```

`criteria` se devuelve a nivel categoría: `{ activity, system, region, scaleRange, period }`.

Respuesta cuando no alcanza k:

```
{ status: "DATOS_INSUFICIENTES", reason: "peer_group_below_minimum" }
```

Sin `median`, sin `p25`, sin `p75`, sin `peerGroupSize`. Devolver el tamaño del grupo cuando
es chico ya es información que permite inferir.

---

## Criterios de aceptación

**CA-01 · Borde inferior de k**
Dado un segmento con exactamente 9 establecimientos participantes y ninguna ampliación posible
Cuando se consulta el benchmark
Entonces la respuesta es `DATOS_INSUFICIENTES` y no contiene ningún valor agregado.

**CA-02 · Borde exacto de k**
Dado un segmento con exactamente 10 establecimientos participantes
Cuando se consulta el benchmark
Entonces se devuelven mediana, percentiles y `peerGroupSize = 10`.

**CA-03 · Ampliación progresiva**
Dado un segmento provincial con 6 establecimientos y uno regional con 14
Cuando se consulta el benchmark
Entonces se amplía la región, se devuelve el resultado con `peerGroupSize = 14` y `criteria`
indica región productiva en lugar de provincia.

**CA-04 · Opt-in respetado**
Dado un segmento con 10 participantes, uno de los cuales desactiva su participación
Cuando se consulta el benchmark
Entonces el establecimiento desactivado no integra el grupo y, si no hay ampliación posible,
la respuesta pasa a `DATOS_INSUFICIENTES`.

**CA-05 · Sin datos de terceros**
Dado cualquier benchmark exitoso
Cuando se inspecciona la respuesta completa
Entonces no aparece ningún identificador, nombre ni registro individual de otro establecimiento.

**CA-06 · Ownership**
Dado un usuario autenticado
Cuando consulta el benchmark de un rodeo de otro establecimiento
Entonces la respuesta es 403 o 404, nunca el dato.

**CA-07 · Actividad no se relaja**
Dado un segmento de recría que no alcanza k ni siquiera a nivel nacional
Cuando se consulta el benchmark
Entonces la respuesta es `DATOS_INSUFICIENTES` y en ningún caso se incorporan
establecimientos de otra actividad.

**CA-08 · Auditoría**
Dado cualquier benchmark exitoso
Cuando se consulta la base
Entonces existe un `BenchmarkSnapshot` con los criterios efectivamente aplicados.

---

## Casos borde y caminos no felices

| Caso | Comportamiento esperado |
|------|------------------------|
| El establecimiento consultante no participa del benchmark | Se calcula igual su indicador propio, sin comparación, con mensaje explicativo |
| El indicador propio no existe todavía (sin pesajes suficientes) | No se consulta benchmark; se informa que faltan pesajes |
| Peer group con valores nulos en algunos establecimientos | Se excluyen del cálculo, pero cuentan para k solo si tienen el indicador |
| Todos los peers tienen el mismo valor | Mediana = p25 = p75; la respuesta es válida y la UI no debe romperse |
| El establecimiento consultante está en el peer group | Se excluye a sí mismo del cálculo de mediana y percentiles |
| Escala declarada en cero o nula | El establecimiento no puede participar del benchmark hasta completar el dato |

El penúltimo caso es fácil de pasar por alto y sesga el resultado: si el campo se compara
contra un grupo que lo incluye, se está comparando parcialmente contra sí mismo.

---

## Fuera de alcance

- Benchmark por localidad o por trimestre. Requiere ruido diferencial antes de habilitarse.
- Ruido diferencial sobre percentiles. Documentado como opción, no implementado en el MVP.
- Precálculo por job nocturno. Entra cuando el cálculo supere 1,5 s en p95.
- Benchmark de costos. El MVP compara indicadores productivos.

---

## Notas de implementación

No son parte de la spec: son advertencias para quien implemente.

- El bug clásico es `>` donde va `>=` en la comparación contra `K_MIN`. Testear 9 y 10.
- La consulta de agregación debe ser SQL explícito y parametrizado, no query builder
  encadenado: es el punto del sistema donde más importa poder leer exactamente qué se
  está calculando.
- Durante el desarrollo, si el benchmark no muestra nada, sembrá 15 establecimientos.
  No bajes `K_MIN`.
