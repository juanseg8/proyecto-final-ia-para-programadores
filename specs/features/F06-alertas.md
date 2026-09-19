# F06 · Motor de alertas

**Estado:** especificada
**Invariantes:** INV-01, INV-05, INV-09

GET /establishments/:id/alerts?from&to
Alerta: code, category, severity, title, message, metric, currentValue, referenceValue opcional, createdAt.
severity: INFO | WARNING | CRITICAL.

Defaults configurables:
BEN-01 GMD >=10% debajo mediana => WARNING.
BEN-02 mortandad >=15% peor mediana => WARNING.
BEN-03 costo/kg >=10% peor mediana => WARNING.
BEN-04 carga fuera p25-p75 => INFO.
HIS-01 GMD cae >=10% vs período anterior => WARNING.
HIS-02 mortandad sube >=0.5 pp => WARNING.
HIS-03 costo/kg sube >=10% => WARNING.
EST-01 sin pesaje 30 días con animales activos => INFO.
EST-02 perfil benchmark incompleto o sin opt-in => INFO.

Variables: ALERT_BEN_GMD_LOW_PCT, ALERT_BEN_MORTALITY_HIGH_PCT, ALERT_BEN_COST_HIGH_PCT, ALERT_HIS_GMD_DROP_PCT, ALERT_HIS_MORTALITY_RISE_PP, ALERT_HIS_COST_RISE_PCT, ALERT_NO_WEIGHING_DAYS.

Si falta dato, no dispara. Nunca ausencia = cero. Sin LLM.
