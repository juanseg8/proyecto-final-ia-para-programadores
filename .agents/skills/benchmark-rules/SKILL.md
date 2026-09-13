---
name: benchmark-rules
description: Reglas de construcción del peer group, k-anonimato y umbrales de alerta. Consultar al implementar o testear benchmark, comparaciones o alertas.
---

# Reglas del benchmark

## Construcción del peer group

Dimensiones y orden de relajación cuando el segmento no alcanza k=10:

| Dimensión | Criterio inicial | ¿Se relaja? | Orden |
|-----------|-----------------|-------------|-------|
| Actividad | Exacta: cría / recría / engorde / ciclo completo | Nunca | — |
| Período | Ventana móvil de 12 meses | Nunca | — |
| Participación | Solo opt-in activo | Nunca | — |
| Escala | Cabezas ±30 % | Sí, a ±50 % | 2 |
| Región | Provincia | Sí: provincia → región productiva → nacional | 1 y 3 |
| Sistema productivo | Exacto: pastoreo / semi-intensivo / feedlot | Sí, agrupa pastoreo + semi-intensivo | 4 |

Algoritmo:

```
segmento = { actividad, sistema, provincia, escala: ±30%, periodo: 12m, optIn: true }
peers = buscar(segmento)

mientras peers.length < K_MIN:
    si escala == ±30%       -> escala = ±50%
    sino si region == prov  -> region = region_productiva
    sino si region == rprod -> region = nacional
    sino si sistema exacto  -> agrupar pastoreo + semi-intensivo
    sino                    -> return DATOS_INSUFICIENTES
    peers = buscar(segmento)

return { mediana, p25, p75, n: peers.length, criterios: segmento }
```

`K_MIN` viene de configuración. Valor del MVP: 10. **Nunca lo bajes para una demo.**

## Contrato de la respuesta

Campos permitidos y ningún otro: `median`, `p25`, `p75`, `peerGroupSize`, `relativePosition`,
`criteria`. El campo `criteria` se devuelve a nivel categoría (provincia, actividad, rango de
escala), nunca como lista de establecimientos.

Cuando no alcanza k, la respuesta es `DATOS_INSUFICIENTES` **sin ningún valor agregado**.
No devuelvas la mediana "por si sirve": con un peer group chico, la mediana es un dato
individual disfrazado.

## Persistencia

Cada cálculo escribe un `BenchmarkSnapshot` con los criterios efectivamente aplicados. Sin
eso no se puede auditar meses después contra qué se comparó a un establecimiento.

## Reglas de alerta

Umbrales iniciales, todos parametrizados en configuración.

| Código | Condición | Severidad |
|--------|-----------|-----------|
| BEN-01 | Entre −5 % y −15 % de la mediana | baja / oportunidad |
| BEN-02 | Entre −15 % y −25 % de la mediana | media / advertencia |
| BEN-03 | Menor a −25 % de la mediana | alta / crítica |
| BEN-04 | Por encima del percentil 75 | informativa / positiva |
| HIS-01 | Caída > 20 % vs período anterior | media |
| HIS-02 | Caída > 20 % vs mismo período del año anterior | media |
| HIS-03 | Mortandad sobre el umbral del rodeo | alta |
| EST-01 | Fuera de ±2 desvíos estándar de la serie propia | baja |
| EST-02 | Variación fisiológicamente improbable entre pesajes | bloqueante en el formulario |

EST-02 es distinto de los demás: no genera alerta, bloquea el guardado y pide confirmación
al usuario. Es prevención de error de tipeo, no detección de anomalía productiva.

## Fórmula de GMD

```
GMD = (peso_actual − peso_anterior) / dias_entre_pesajes
```

Validaciones antes de persistir: `dias > 0`, variación dentro del rango fisiológico de la
categoría, ambos pesajes del mismo rodeo y del mismo establecimiento.

## Trampa conocida

El bug clásico de este dominio es `peers.length > K_MIN` donde va `>=`. Con k=10, esa
diferencia publica un benchmark con exactamente 10 establecimientos o lo suprime de más.
Testeá siempre los dos bordes: 9 y 10.
