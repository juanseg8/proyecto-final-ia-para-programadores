# SPEC — Detalle de establecimiento

## Objetivo
Rediseñar la pantalla de detalle de un establecimiento rural para que la información esté ordenada, sea fácil de recorrer en móvil y use datos reales del establecimiento seleccionado. La referencia visual se compone de cinco vistas del mismo detalle: **Resumen, Indicadores, Clima, Datos y Mapa**.

## Referencias incluidas
- `01_resumen.png`
- `02_indicadores_benchmark.png`
- `03_clima.png`
- `04_datos.png`
- `05_mapa.png`

Las imágenes muestran una dirección visual. Los valores, temperaturas, estados del tiempo, pronósticos, nombres auxiliares y elementos del mapa que aparecen son **datos ilustrativos**. No deben copiarse al código como contenido real ni persistirse en backend.

## Alcance y reglas de implementación
1. Antes de modificar, inspeccionar la pantalla actual, navegación, modelo y servicios existentes relacionados con establecimientos, clima, indicadores, benchmark y mapas.
2. Reutilizar rutas, componentes, API clients, tipos y persistencia existentes. No crear endpoints, datos de ejemplo permanentes, mocks de producción ni cambios de esquema sin una necesidad comprobada.
3. Mantener el stack, convenciones y arquitectura existentes del proyecto.
4. Todas las vistas pertenecen al establecimiento recibido por la ruta/estado de navegación. Cambiar de tab no debe cambiar de establecimiento.
5. Mantener safe areas, scroll vertical, tipografía y paleta ya usada por la aplicación. La barra inferior global existente debe seguir funcionando y no quedar tapada por contenido.
6. La fila de tabs superiores debe poder desplazarse horizontalmente en teléfonos angostos, sin recortar etiquetas ni provocar overflow.
7. Mantener la terminología vigente en la app. No renombrar globalmente “establecimiento”/“campo” como parte de esta pantalla.
8. Reutilizar el logo institucional aprobado cuando corresponda en la identidad global; no inventar un logo nuevo ni repetirlo innecesariamente dentro del detalle.

## Estructura de navegación
- Encabezado compacto con volver, nombre del establecimiento, ubicación secundaria y favorito si la funcionalidad ya existe.
- Tabs internas: **Resumen | Indicadores | Clima | Datos | Mapa**.
- Tab activa distinguible con color y subrayado, también para accesibilidad.
- Tab Mapa puede ocupar el área principal disponible; las demás vistas deben tener scroll vertical normal.
- Acciones de edición deben navegar al flujo de edición existente y respetar permisos actuales.

## Contenido por vista

### 1. Resumen
Orden sugerido:
- Imagen del establecimiento si existe una imagen real; si no, placeholder sobrio (no imagen inventada que se presente como foto del campo).
- Nombre, localidad/provincia y superficie si están disponibles.
- Tarjetas breves de actividad principal y última actualización, con estados “Sin datos cargados”/“Sin registros” cuando aplique.
- Resumen de clima real y acceso a Clima.
- Alertas del establecimiento si la aplicación tiene alertas reales; estado vacío si no hay.
- Indicadores resumidos solo si se pueden calcular con información válida.

### 2. Indicadores y benchmark
- Mostrar únicamente indicadores disponibles y calculados por lógica existente con datos reales de este establecimiento.
- Si faltan datos productivos, explicar qué información hace falta y ofrecer la acción existente para cargarla.
- Presentar benchmark zonal dentro de esta vista, separado visualmente de los indicadores propios.
- No comparar hasta contar con muestra suficiente y datos comparables. Explicar claramente el estado vacío y permitir ver criterios/metodología si ya existe esa funcionalidad.
- No inventar promedios, rankings, porcentajes, recomendaciones ni series.

### 3. Clima
- Consultar el proveedor/servicio actual de clima asociado a las coordenadas reales.
- Resumen actual y métricas que el proveedor entregue (por ejemplo temperatura, humedad, viento y precipitación), junto con pronóstico solo si existe.
- Mostrar fuente y hora real de actualización según el servicio.
- Si no hay coordenadas, indicar que falta ubicación y dar acceso a editarla.
- Si el proveedor falla o no hay conexión, conservar la pantalla y mostrar error/última actualización disponible con reintento; no mostrar datos de muestra como reales.

### 4. Datos
- Agrupar información general: nombre, actividad, superficie y ubicación.
- Agrupar datos productivos existentes y mostrar campos faltantes de manera explícita.
- Usar el formulario y guardado existentes. Los cambios deben persistir y refrescar los datos que dependan de ellos.
- CTAs “Editar información” y “Cargar datos” deben ejecutar acciones reales ya disponibles; ocultar/deshabilitar con explicación cuando no estén implementadas.
- No crear campos de negocio nuevos solo porque aparecen en una referencia visual.

### 5. Mapa
- Mostrar el mapa real centrado en las coordenadas válidas de este establecimiento, con un marcador identificable.
- No dibujar límites de parcelas/perímetros salvo que el backend ya provea geometría real.
- Si faltan coordenadas, no centrar en una ubicación aproximada ni inventar un marcador: mostrar estado vacío con acción para agregar/editar ubicación.
- Mantener atribución/licencia exigida por el proveedor de mapas y controles táctiles apropiados.

## Estados transversales
Cada vista debe resolver:
- Carga: indicador/skeleton sin saltos grandes de layout.
- Error: mensaje claro y reintento cuando corresponda.
- Vacío o datos insuficientes: explicar qué falta y una acción útil si existe.
- Offline o proveedor externo no disponible: conservar el resto de la pantalla y comunicar el estado.
- Texto largo, nombre extenso y valores ausentes sin desbordes.

## Criterios de aceptación
- Se puede entrar desde una tarjeta de establecimiento y se muestra el establecimiento correcto en las cinco vistas.
- Las cinco tabs navegan, conservan el contexto y marcan cuál está seleccionada.
- Todos los datos visibles provienen del backend/servicios existentes o se presentan explícitamente como faltantes; ningún valor de las imágenes queda hardcodeado como dato real.
- Favoritos, volver, editar, cargar datos y reintentos funcionan solo si esas funciones ya existen; si alguna falta, documentarla en vez de simularla.
- El mapa no inventa coordenadas ni perímetros.
- Clima y benchmark contemplan ausencia/fallo de sus fuentes.
- Diseño usable en iPhone y Android angostos: sin clipping, navegación inferior visible, safe areas y scroll correcto.
- Ejecutar las validaciones estándar del proyecto (al menos typecheck/lint pertinente) y reportar archivos cambiados y cualquier limitación real.

## Verificación antes de cerrar
1. Probar establecimiento con coordenadas y sin coordenadas.
2. Probar con y sin datos productivos; probar vacío de benchmark.
3. Probar error/ausencia de clima y recuperación por reintento.
4. Probar nombres y localidades largos, cambio entre tabs y regreso.
5. Comparar capturas en tamaños móviles con estas referencias sin tratar sus textos ni cifras como fuente de verdad.
