# AGRO INTELLIGENCE — MVP EXECUTION PLAN

Resultado: app móvil + backend que cubren autenticación, establecimientos/ubicación, gestión ganadera, indicadores, benchmark, alertas, clima, Agro IA y dashboard.

Principios: monolito modular, TypeORM, ownership, números determinísticos fuera LLM, k>=10, IA sin DB/fallback, secretos solo backend.

Cola V8:
02 F02 navegación
03 GeoRef
04 UI foundation
05 mapa
10 F03 backend
11 F03 mobile
12 F04 indicadores
13 F05 benchmark
14 F06 alertas
15 F07 clima
16 F08 IA
17 F09 dashboard
18 integración final

Cada tarea: sesión nueva → implementar → compilar → reparar compile máximo dos veces → commit local → siguiente.
