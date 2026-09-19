# F08 · Asistente Agro IA

**Estado:** especificada
**Invariantes:** INV-01, INV-05, INV-06, INV-07, INV-08, INV-11

POST /establishments/:id/ai/ask
Body: question.
Éxito: answer, deterministicContext, guardrailPassed, model.
Fallback: answer null, deterministicContext, guardrailPassed false, unavailableReason.

Tools autorizadas: getIndicatorsContext, getBenchmarkContext, getAlertsContext, getWeatherContext, getEstablishmentSummary.
backend/src/ai no importa Repository, DataSource ni QueryBuilder.

Proveedor OpenAI-compatible: AI_BASE_URL, AI_API_KEY, AI_MODEL, AI_TIMEOUT_MS.
Sin proveedor => datos determinísticos + answer null.

Guardrails: español; sin diagnóstico/causalidad afirmada; números de answer deben existir en contexto; no datos individuales de terceros.

Persistir AiInteraction: id, userId, establishmentId, question, answer opcional, contextJson, toolsJson, model opcional, guardrailPassed, errorCode opcional, createdAt.
Persistencia en servicio de auditoría separado.
