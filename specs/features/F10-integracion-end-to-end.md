# F10 — Integración End-to-End y Completitud Funcional

## Estado

PENDIENTE

## Tipo

Integración / Backend / Mobile / End-to-End

## Prioridad

CRÍTICA

---

# 1. Objetivo

Convertir Agro Intelligence en una aplicación funcional end-to-end.

Actualmente existen pantallas, componentes y features que:

- utilizan mocks;
- contienen datos hardcodeados;
- están desconectadas del backend;
- tienen rutas inaccesibles;
- poseen lógica parcialmente implementada;
- no persisten información;
- dependen de parámetros de navegación incorrectos.

Esta spec debe eliminar esas brechas.

La aplicación final debe permitir realizar de manera real:

1. registro;
2. login;
3. logout;
4. gestión de perfil;
5. creación de establecimientos;
6. edición de establecimientos;
7. ubicación geográfica del establecimiento;
8. visualización en mapa;
9. obtención de clima según ubicación real;
10. gestión ganadera;
11. indicadores;
12. benchmark anónimo;
13. alertas;
14. recomendaciones mediante Agro IA;
15. dashboard;
16. navegación completa entre todas las funcionalidades.

NO debe utilizar datos estáticos para simular funcionalidades que deberían provenir del backend.

---

# 2. Fuentes de verdad

Antes de implementar, leer obligatoriamente:

```text
specs/domain/glosario.md

specs/features/F01-autenticacion.md
specs/features/F02-Establecimiento.md
specs/features/F03-gestion-ganadera.md
specs/features/F04-indicadores.md
specs/features/F05-benchmark-anonimo.md
specs/features/F06-alertas.md
specs/features/F07-clima.md
specs/features/F08-agro-ia.md
specs/features/F09-dashboard.md

specs/ui/UX01-Design-System.md
specs/ui/UX02-Mobile-Visual-Quality.md

specs/ui/constitution.md
specs/ui/decisiones.md
```

También leer:

```text
specs/ui/reports/mobile-feature-gap-analysis.md
```

Este reporte representa el diagnóstico inicial de F10.

---

# 3. Regla fundamental

NO considerar una feature implementada simplemente porque existe una pantalla.

Una feature se considera funcional solamente si existe:

```text
UI
+
NAVIGATION
+
VALIDATION
+
API
+
BACKEND
+
DATABASE
+
ERROR HANDLING
+
REAL DATA
+
TEST
```

cuando corresponda.

---

# 4. Prohibición de mocks funcionales

Eliminar mocks que simulen lógica real.

Especialmente revisar:

```text
Math.random()
arrays hardcodeados
benchmarks estáticos
coordenadas simuladas
login falso
navegación simulando success
datos climáticos ficticios
alertas estáticas
KPIs constantes
```

Los mocks pueden permanecer únicamente:

- en tests;
- fixtures;
- Storybook;
- previews;
- ambientes explícitos de desarrollo.

Nunca como comportamiento normal de la aplicación.

---

# 5. Auditoría técnica previa

Antes de modificar código:

analizar `/mobile` y `/backend`.

Identificar:

```text
entidades
DTOs
controllers
services
repositories
migrations
endpoints
navigation
contexts
hooks
api clients
screens
components
```

Generar:

```text
specs/features/reports/F10-implementation-plan.md
```

con:

```text
Feature
Backend existente
Mobile existente
DB existente
Gap
Cambio necesario
Archivos afectados
Tests requeridos
```

Después comenzar la implementación.

No detenerse para pedir autorización por decisiones técnicas menores.

---

# 6. Autenticación real — F01

Corregir el flujo actual.

## Login

`LoginScreen` debe utilizar el sistema real de autenticación existente.

Debe:

```text
email/password
↓
backend
↓
access token
+
refresh/session
↓
AuthContext
↓
authenticated navigation
```

Eliminar navegación ficticia.

---

## Registro

`RegisterScreen` debe crear realmente el usuario.

Después:

- autenticar según contrato existente;
- o volver a Login si la spec define ese comportamiento.

No navegar simulando éxito.

---

## Persistencia de sesión

Al reiniciar la aplicación:

- recuperar sesión;
- validar token;
- refrescar cuando corresponda;
- redirigir correctamente.

---

## Logout

Cerrar sesión debe:

1. invalidar/revocar sesión backend cuando corresponda;
2. eliminar tokens almacenados localmente;
3. limpiar AuthContext;
4. limpiar estado sensible;
5. volver al flujo de autenticación;
6. impedir volver atrás hacia pantallas autenticadas.

No limitarse a limpiar el navigation stack.

---

# 7. Perfil

Debe existir una pantalla accesible:

```text
Perfil
```

Debe mostrar como mínimo los campos disponibles reales del usuario.

Permitir editar solamente los campos contemplados por el modelo actual.

Debe contener:

```text
Datos personales
Configuración disponible
Cerrar sesión
```

No inventar configuraciones que el backend no soporte.

---

# 8. Navegación principal

La navegación debe permitir descubrir toda la aplicación.

Propuesta principal:

```text
BOTTOM NAVIGATION

Inicio
Establecimientos
Agro IA
Alertas
Perfil
```

Mantener entre 3 y 5 destinos principales según UX01.

---

# 9. Contexto global de establecimiento

Implementar un mecanismo único para representar:

```text
Establecimiento activo
```

Ejemplo conceptual:

```text
SelectedEstablishmentContext
```

o solución equivalente consistente con la arquitectura existente.

Debe contener como mínimo:

```ts
selectedEstablishment
selectedEstablishmentId
selectEstablishment()
clearSelection()
```

Persistir la selección si resulta apropiado.

---

# 10. Selector de establecimiento

Cuando exista más de un establecimiento:

el usuario debe poder cambiar el establecimiento activo.

Agregar selector reutilizable.

Ejemplo conceptual:

```text
Establecimiento actual

Estancia San José
Corrientes Capital

⌄ Cambiar
```

Utilizarlo donde tenga sentido:

- Dashboard;
- Agro IA;
- Clima;
- Indicadores;
- Benchmark;
- Alertas.

---

# 11. Corregir Agro IA

Actualmente Agro IA depende de:

```text
route.params.establishmentId
```

y falla como tab global.

Eliminar esa dependencia arquitectónica.

Agro IA deberá utilizar:

```text
selectedEstablishmentId
```

desde el estado global.

---

# 12. Agro IA — funcionamiento

La pantalla debe consumir realmente el backend.

La IA debe recibir contexto real del establecimiento cuando corresponda.

Contexto disponible puede incluir, según las specs:

```text
establecimiento
ubicación
clima
ganadería
indicadores
benchmark
alertas
```

No enviar datos inexistentes.

---

# 13. Agro IA — recomendaciones

La pantalla debe priorizar recomendaciones útiles.

Ejemplo conceptual:

```text
Recomendaciones para
Estancia San José

⚠ Disponibilidad hídrica
...

📊 Rendimiento
...

🐄 Ganadería
...

🌧 Clima
...
```

No generar recomendaciones hardcodeadas.

Deben provenir del endpoint real de Agro IA.

---

# 14. CRUD real de establecimientos

Completar F02.

Debe permitir:

```text
crear
consultar
editar
eliminar
```

según permisos y contratos de la spec.

---

# 15. Alta de establecimiento

El formulario deberá guardar realmente mediante API.

No navegar simulando success.

Flujo:

```text
FORM
↓
VALIDATE
↓
POST API
↓
DATABASE
↓
SUCCESS
↓
DETAIL
```

---

# 16. Datos del establecimiento

Permitir cargar todos los campos definidos realmente por F02 y las entidades backend.

No inventar campos nuevos sin verificar modelo y spec.

Organizar visualmente por secciones.

Ejemplo:

```text
Información general

Ubicación

Actividad / producción

Datos complementarios
```

según corresponda.

---

# 17. Ubicación — estrategia

La carga de ubicación deberá combinar:

```text
Provincia
+
Localidad
+
Punto exacto en mapa

O

Ubicación actual
```

No utilizar coordenadas aleatorias.

---

# 18. Selección de provincia

Agregar selector:

```text
Provincia
```

Para esta etapa debe permitir las provincias necesarias según el alcance funcional existente.

Idealmente obtener catálogo desde fuente confiable/API o backend.

No hardcodear catálogos innecesariamente si existe fuente real disponible.

---

# 19. Selección de localidad

Después de seleccionar provincia:

```text
Provincia
↓
Localidades correspondientes
```

El selector de localidad debe depender de provincia.

Ejemplo:

```text
Provincia:
Corrientes

Localidad:
Corrientes
Goya
Mercedes
Paso de los Libres
Curuzú Cuatiá
...
```

No mostrar localidades de otras provincias simultáneamente.

---

# 20. Selección mediante mapa

Después de seleccionar localidad:

mostrar mapa centrado aproximadamente en esa localidad.

El usuario podrá:

```text
tocar mapa
↓
mover marcador
↓
confirmar ubicación
```

Persistir:

```text
latitude
longitude
province
locality
```

y demás datos contemplados por el modelo.

---

# 21. Usar ubicación actual

Agregar:

```text
Usar mi ubicación
```

Solicitar permisos mediante Expo.

Si el usuario acepta:

```text
GPS
↓
latitude
longitude
↓
map marker
```

Cuando sea posible determinar provincia/localidad mediante geocodificación, completar esos campos.

Nunca bloquear la creación del establecimiento si el usuario rechaza GPS y puede seleccionar manualmente.

---

# 22. Permisos de ubicación

Implementar correctamente estados:

```text
unknown
requested
granted
denied
```

Si es denegado:

mostrar opción manual.

---

# 23. Persistencia geográfica

Las coordenadas deben almacenarse en backend/database.

No recalcular aleatoriamente en frontend.

---

# 24. Detalle de establecimiento

Debe existir una pantalla funcional:

```text
Establecimiento
```

con secciones accesibles.

Propuesta:

```text
Resumen
Ubicación
Clima
Indicadores
Ganadería
Benchmark
```

No es obligatorio utilizar tabs si existe una navegación mejor según UX01.

---

# 25. Mapa

Mostrar la posición REAL persistida del establecimiento.

Marker:

```text
latitude
longitude
```

provenientes de API.

Eliminar cualquier uso de:

```ts
Math.random()
```

para posicionamiento funcional.

---

# 26. Clima

F07 ya dispone de integración funcional según auditoría.

Asegurar que el clima utilice:

```text
latitude
longitude
```

del establecimiento seleccionado.

No utilizar ubicación fija.

---

# 27. Clima — comportamiento

Mostrar según UX01:

```text
temperatura
condición
precipitación
viento
humedad
pronóstico
```

si esos datos están disponibles en la API.

No inventar campos inexistentes.

---

# 28. Cambio de establecimiento

Cuando cambia:

```text
selectedEstablishment
```

actualizar automáticamente:

```text
clima
dashboard
indicadores
benchmark
alertas
Agro IA
```

cuando corresponda.

---

# 29. Indicadores — F04

Implementar la pantalla faltante.

Primero revisar backend.

Si los endpoints especificados por F04 ya existen:

consumirlos.

Si no existen:

implementarlos respetando F04.

La pantalla debe mostrar KPIs reales.

---

# 30. Indicadores

No hardcodear KPIs.

Los valores deben calcularse con información real existente.

Cada métrica debe tener:

```text
valor
unidad
contexto
período
```

cuando corresponda.

---

# 31. Benchmark anónimo — F05

Eliminar valores hardcodeados.

El benchmark debe calcularse a partir de datos reales persistidos.

Debe preservar anonimato según F05.

Nunca devolver información que permita identificar otro productor.

---

# 32. Benchmark — población de comparación

El backend debe seleccionar únicamente establecimientos comparables según los criterios definidos por F05.

Utilizar criterios existentes de la spec.

No inventar comparaciones arbitrarias.

Cuando corresponda considerar:

```text
zona
actividad
categoría
escala
métrica
período
```

solamente según lo especificado.

---

# 33. Benchmark — mínimo de participantes

Respetar cualquier regla existente de anonimato/k-anonymity o población mínima definida por F05.

Si no hay suficientes participantes:

mostrar:

```text
Todavía no hay suficientes establecimientos comparables.
```

No revelar registros individuales.

---

# 34. Datos demo para Benchmark

Crear datos sintéticos de desarrollo suficientes para probar benchmark real.

NO utilizar personas reales.

NO utilizar información personal real.

Los datos deben ser claramente DEMO.

---

# 35. Usuarios demo

Crear seed idempotente para entorno desarrollo/test.

Ejemplo conceptual:

```text
demo01@agro.test
demo02@agro.test
demo03@agro.test
demo04@agro.test
demo05@agro.test
demo06@agro.test
demo07@agro.test
demo08@agro.test
```

Utilizar contraseña DEMO común documentada solamente para desarrollo.

Nunca ejecutar este seed automáticamente en producción.

---

# 36. Establecimientos demo

Crear múltiples establecimientos sintéticos ubicados en la provincia de Corrientes.

Distribuirlos razonablemente entre distintas localidades.

Ejemplos de nombres ficticios:

```text
Estancia Horizonte
Establecimiento El Ceibo
Campo Santa Clara
Estancia Los Lapachos
Campo del Iberá
Establecimiento San Miguel
Estancia La Esperanza
Campo Las Palmeras
```

Estos nombres son ficticios.

---

# 37. Distribución geográfica demo

Generar establecimientos demo en distintas zonas de Corrientes.

Utilizar coordenadas válidas de demostración y localidades reales.

Los puntos NO deben representar intencionalmente propiedades privadas concretas.

Preferir puntos aproximados cercanos a centros/localidades para datos demo.

---

# 38. Dataset demo

Los establecimientos demo deben contener suficientes datos para que funcionen:

```text
Dashboard
Indicadores
Benchmark
Alertas
Agro IA
Clima
Ganadería
```

según los modelos actuales.

---

# 39. Seed reproducible

Crear un mecanismo explícito como:

```text
npm run seed:demo
```

o equivalente consistente con backend.

Debe ser:

```text
idempotente
repetible
seguro para development/test
```

---

# 40. Protección production

El seed demo debe verificar entorno.

No ejecutarse automáticamente si:

```text
NODE_ENV=production
```

o equivalente.

---

# 41. Benchmark real con dataset demo

El usuario demo principal debe poder compararse contra los otros establecimientos demo.

Ejemplo conceptual:

```text
Mi establecimiento

Producción:
+8% respecto de establecimientos comparables

Mortalidad:
-2.1 pp

Peso promedio:
...
```

Los cálculos deberán provenir del backend.

No escribir esos porcentajes manualmente.

---

# 42. Alertas — F06

Implementar pantalla de alertas.

Debe existir:

```text
AlertsScreen
```

o equivalente.

Accesible desde navegación principal.

---

# 43. Generación de alertas

Las alertas deben originarse de reglas reales.

Revisar F06 antes de implementar.

Ejemplos solamente si coinciden con la spec:

```text
clima
indicadores
eventos ganaderos
umbrales
datos faltantes críticos
```

No generar alertas aleatorias.

---

# 44. Alertas climáticas

Cuando la API meteorológica provea información suficiente y F06 lo permita:

generar alertas relacionadas a:

```text
temperaturas extremas
precipitaciones
viento
otros eventos relevantes
```

No afirmar eventos que la API no reporte.

---

# 45. Alertas persistidas vs calculadas

Analizar F06 y arquitectura existente.

Elegir:

```text
persistidas
```

o:

```text
calculadas
```

según necesidades reales.

Documentar decisión.

---

# 46. Alertas UI

Debe mostrar:

```text
prioridad
tipo
establecimiento
mensaje
fecha/hora
estado
```

cuando esos datos existan.

---

# 47. Dashboard

F09 debe integrar el establecimiento seleccionado.

Mostrar información REAL.

No crear tarjetas con información ficticia.

---

# 48. Dashboard — accesos

Desde Dashboard debe ser posible navegar hacia features relevantes.

Ejemplo:

```text
Clima
Indicadores
Alertas
Benchmark
Agro IA
```

sin sobrecargar la pantalla.

---

# 49. Gestión ganadera

F03 figura funcional.

No reescribir innecesariamente.

Verificar solamente:

- navegación;
- establecimiento activo;
- consistency;
- errores;
- integración con dashboard/IA/indicadores cuando corresponda.

---

# 50. Errores

Toda llamada API debe considerar:

```text
loading
success
empty
error
offline
```

cuando aplique.

No ignorar errores de Axios/fetch.

---

# 51. Loading

Evitar doble submit.

Durante mutations importantes:

deshabilitar CTA y mostrar estado.

---

# 52. Validaciones

Validar en:

```text
frontend
+
backend
```

Backend continúa siendo la autoridad final.

---

# 53. API Contracts

Antes de crear un endpoint nuevo:

buscar si ya existe.

No duplicar APIs.

Si existe discrepancia entre frontend y backend:

preferir adaptar integración respetando specs y contratos existentes.

---

# 54. Database

Si faltan columnas/relaciones necesarias para cumplir specs existentes:

crear migraciones TypeORM.

NO usar:

```text
synchronize: true
```

como sustituto de migraciones en un proyecto persistente.

---

# 55. TypeORM

Mantener TypeORM como ORM oficial.

No introducir Prisma.

---

# 56. Datos reales

Todos estos módulos deben quedar alimentados por información real:

```text
Establecimientos
Ubicación
Clima
Indicadores
Benchmark
Alertas
Agro IA
Dashboard
Perfil
```

"Real" incluye datos demo persistidos en DB para desarrollo.

No incluye constantes hardcodeadas en componentes.

---

# 57. Navegación final esperada

Flujo conceptual:

```text
AUTH
│
├── Login
├── Registro
└── Recuperación
       │
       ▼
MAIN APP
│
├── Inicio
│
├── Establecimientos
│      │
│      ├── Lista
│      ├── Crear
│      └── Detalle
│            ├── Resumen
│            ├── Ubicación
│            ├── Clima
│            ├── Indicadores
│            ├── Ganadería
│            └── Benchmark
│
├── Agro IA
│
├── Alertas
│
└── Perfil
       └── Cerrar sesión
```

Puede ajustarse si la arquitectura actual posee una solución mejor.

---

# 58. Agro IA y contexto

Antes de solicitar recomendaciones:

debe existir un establecimiento seleccionado.

Si no existe:

mostrar selector / empty state.

Nunca provocar exception por `undefined establishmentId`.

---

# 59. Empty states

Ejemplo:

```text
Todavía no tenés establecimientos.

Creá uno para empezar a utilizar Clima,
Benchmark y Agro IA.

[Crear establecimiento]
```

---

# 60. Tests backend

Agregar/actualizar tests para:

```text
auth
establishments
location
metrics
benchmark
alerts
Agro IA
```

según cambios realizados.

---

# 61. Tests mobile

Agregar/actualizar tests para:

```text
login real
registro
crear establecimiento
selección establecimiento
Agro IA
benchmark
alertas
logout
```

---

# 62. E2E happy path

Validar flujo completo:

```text
registrar usuario
↓
login
↓
crear establecimiento
↓
seleccionar provincia/localidad
↓
elegir ubicación en mapa
↓
guardar
↓
ver establecimiento
↓
ver ubicación
↓
ver clima
↓
ver indicadores
↓
ver benchmark
↓
ver alertas
↓
consultar Agro IA
↓
perfil
↓
logout
```

---

# 63. Dataset demo happy path

También validar:

```text
login usuario demo
↓
establecimiento demo
↓
datos productivos
↓
benchmark contra otros demos
↓
alertas
↓
clima
↓
Agro IA
```

---

# 64. Verificación visual

Una vez completada cada feature funcional:

utilizar Expo MCP.

Procedimiento:

```text
RUN
↓
OPEN
↓
INTERACT
↓
SCREENSHOT
↓
VERIFY
```

---

# 65. No romper UX01

Todo componente nuevo debe seguir:

```text
specs/ui/UX01-Design-System.md
```

---

# 66. UX02 posterior

F10 NO reemplaza UX02.

Después de completar F10:

ejecutar nuevamente UX02 sobre TODA la aplicación ahora accesible.

---

# 67. Evidencia

Guardar cuando sea posible:

```text
specs/features/reports/F10/
```

Incluyendo:

```text
implementation-report.md
test-report.md
api-report.md
seed-report.md
screenshots/
```

---

# 68. Reporte final

Generar:

```text
specs/features/reports/F10/F10-final-report.md
```

Debe indicar por feature:

```text
implementado
endpoint
pantalla
persistencia
tests
validación visual
problemas pendientes
```

---

# 69. Criterios de aceptación

F10 solamente puede marcarse COMPLETADA cuando:

- [ ] Login utiliza backend real.
- [ ] Registro utiliza backend real.
- [ ] Sesión se persiste correctamente.
- [ ] Logout real funciona.
- [ ] Perfil es accesible.
- [ ] Establecimientos se crean realmente.
- [ ] Establecimientos se editan realmente.
- [ ] Ubicación se persiste.
- [ ] No existen coordenadas random.
- [ ] Provincia/localidad funcionan.
- [ ] El usuario puede seleccionar punto en mapa.
- [ ] Existe opción usar ubicación actual.
- [ ] Clima usa coordenadas del establecimiento.
- [ ] Gestión ganadera sigue funcional.
- [ ] Indicadores utilizan datos reales.
- [ ] Benchmark utiliza backend y datos reales.
- [ ] Benchmark respeta anonimato.
- [ ] Dataset demo permite benchmark real.
- [ ] Alertas funcionan.
- [ ] Agro IA funciona con establecimiento seleccionado.
- [ ] Dashboard utiliza información real.
- [ ] Todas las features tienen navegación accesible.
- [ ] No existen mocks funcionales en runtime normal.
- [ ] Tests pasan.
- [ ] TypeScript pasa.
- [ ] Backend compila.
- [ ] Mobile compila.
- [ ] Happy path E2E fue validado.
- [ ] Expo MCP fue utilizado para verificar flujos mobile.
- [ ] Existe reporte final.

---

# 70. Definition of Done

```text
FEATURE VISIBLE
≠
FEATURE DONE
```

DONE significa:

```text
DATABASE
+
BACKEND
+
API
+
MOBILE
+
NAVIGATION
+
REAL DATA
+
TEST
+
VISUAL VERIFICATION
```

---

# 71. Ejecución autónoma

Trabajar feature por feature.

Orden recomendado:

```text
1. Auth
2. Perfil / logout
3. Establishment CRUD
4. Ubicación
5. SelectedEstablishment global
6. Clima
7. Indicadores
8. Benchmark
9. Dataset demo
10. Alertas
11. Agro IA
12. Dashboard
13. navegación integral
14. E2E
15. UX02 completo
```

No detenerse por decisiones de implementación triviales.

Solamente detenerse ante:

- credenciales externas;
- decisiones funcionales no cubiertas por specs;
- cambios destructivos;
- migraciones incompatibles;
- costos de servicios externos;
- bloqueos externos que requieran intervención humana.

---

# 72. Estado final

Cambiar:

```text
Estado: PENDIENTE
```

a:

```text
Estado: COMPLETADA
```

únicamente cuando TODOS los criterios obligatorios estén satisfechos.