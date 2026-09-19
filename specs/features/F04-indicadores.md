# F04 · Motor determinístico de indicadores

**Estado:** especificada
**Invariantes:** INV-01, INV-05, INV-09

## Indicadores MVP
Para establecimiento o rodeo y período from/to:

1. gmdGramsDay: por animal con dos pesajes válidos, (pesoFinal-pesoInicial)/días, expresado gramos/día. Agregado = promedio de GMD individuales. Sin datos => null + INSUFFICIENT_DATA.
2. activeHeadCount: animales ACTIVE actuales.
3. stockingRateHeadsHa: activeHeadCount / superficieHa; superficie <= 0 => null.
4. mortalityPct: muertes período / (activeHeadCount + muertesPeriodo) * 100; denominador 0 => 0.
5. costPerKgProduced: COST + amounts de FEEDING/HEALTH dividido por kg positivos de ganancia observada; kg <= 0 => null.

GET /establishments/:id/indicators?from=YYYY-MM-DD&to=YYYY-MM-DD&herdId?

Respuesta: period, scope, gmdGramsDay, activeHeadCount, stockingRateHeadsHa, mortalityPct, costPerKgProduced, calculatedAt.
Puede persistirse IndicatorSnapshot.

Fechas inválidas/from>to => 400. Ownership => 404. Máximo dos decimales salvo GMD entero.
