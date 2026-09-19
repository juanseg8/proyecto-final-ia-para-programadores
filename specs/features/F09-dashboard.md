# F09 · Dashboard móvil integrado

**Estado:** especificada
**Invariantes:** INV-01, INV-05, INV-07

GET /establishments/:id/dashboard?from&to
Compone establishment, indicators, benchmarkSummary, alerts, weather, generatedAt. Fallos parciales no vacían todo.

Mobile Inicio:
- establecimiento activo/selector;
- saludo y nombre campo;
- CTA Gestión Ganadera;
- KPIs GMD, carga, mortandad, costo/kg;
- Mi campo vs similares;
- alertas;
- clima;
- CTA Preguntale a Agro IA.

Benchmark: indicador seleccionable, Tu campo vs mediana vs p25/p75, peerGroupSize solo publicable, criterios y DATOS_INSUFICIENTES.
Agro IA: pregunta/respuesta; si proveedor no disponible, contexto determinístico + aviso.
UX01, español, sin métricas falsas, sin AgroScore no especificado.
