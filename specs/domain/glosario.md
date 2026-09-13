# Glosario del dominio

Vocabulario obligatorio. Se usa en identificadores de código (en inglés) y en texto visible
al usuario (en español). Nunca aparece "registro", "entidad" o "instancia" en la UI.

| Término (UI) | Código | Definición |
|--------------|--------|------------|
| Establecimiento | `Farm` | Unidad productiva del usuario. Tiene ubicación, actividad, sistema y escala. |
| Rodeo | `Herd` | Conjunto de animales manejados como grupo dentro de un establecimiento. |
| Cabezas | `headCount` | Cantidad de animales. Nunca "unidades" ni "ítems". |
| Pesaje | `Weighing` | Registro de peso promedio de un rodeo en una fecha. Es la carga más frecuente. |
| GMD | `gmd` | Ganancia media diaria, en g/día. Indicador central de recría y engorde. |
| Carga animal | `stockingRate` | Equivalentes vaca por hectárea (EV/ha). |
| Mortandad | `mortalityRate` | Porcentaje de bajas sobre el rodeo en un período. |
| Actividad | `activity` | Cría, recría, engorde o ciclo completo. |
| Sistema productivo | `productionSystem` | Pastoreo, semi-intensivo o feedlot. |
| Grupo comparable | `peerGroup` | Establecimientos similares contra los que se compara. |
| Mediana del grupo | `median` | Valor central del grupo comparable. Nunca "promedio". |
| Posición relativa | `relativePosition` | Diferencia porcentual contra la mediana del grupo. |
| Alerta | `Alert` | Desvío detectado por una regla determinística. Nunca un diagnóstico. |

## Precisiones que importan

**Mediana, no promedio.** El promedio se distorsiona con un solo establecimiento atípico.
En la UI dice "mediana" aunque suene más técnico: es más honesto y el productor lo entiende
cuando se le explica una vez.

**Alerta, no diagnóstico.** Una alerta dice que un indicador está fuera de un umbral. No
dice por qué ni qué hacer. Esa distinción define el límite de responsabilidad del producto.

**Comparable, no mejor o peor.** El benchmark posiciona, no califica. El texto de la UI evita
formulaciones que suenen a evaluación del productor.
