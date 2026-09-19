# F07 · Contexto climático

**Estado:** especificada
**Invariantes:** INV-05, INV-10

Backend adapter Open-Meteo por defecto. Config WEATHER_BASE_URL y timeout.
GET /establishments/:id/weather

Respuesta: current, daily, fetchedAt, provider.
current: temperatureC, apparentTemperatureC opcional, precipitationMm, windSpeedKmh, weatherCode.
daily hasta 7: date, tempMinC, tempMaxC, precipitationProbabilityPct.

Mobile nunca llama proveedor externo. Coordenadas vienen del establecimiento autorizado.
Timeout/error => 200 con status UNAVAILABLE. No secretos hardcodeados.
