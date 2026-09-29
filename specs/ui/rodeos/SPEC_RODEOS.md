# SPEC — Módulo de Rodeos

## Objetivo
Mejorar el trabajo diario con rodeos y animales. El usuario debe poder crear y consultar rodeos, administrar sus animales, y registrar pesadas y eventos desde el animal correspondiente, consultando sus registros anteriores antes de cargar uno nuevo.

## Referencias visuales
1. `01_lista_rodeos.png` — listado y acceso a creación.
2. `02_crear_rodeo.png` — formulario de nuevo rodeo.
3. `03_detalle_rodeo_animales.png` — detalle y listado de animales del rodeo.
4. `04_agregar_animales.png` — selección de animales para incorporar.
5. `05_detalle_animal_historial.png` — detalle individual e historial.
6. `06_registrar_pesada.png` — alta de pesada contextual.
7. `07_registrar_evento.png` — alta de evento contextual.

Los nombres, cantidades, identificadores, categorías, fechas, pesos, variaciones, ubicaciones y eventos visibles en las imágenes son **ejemplos ilustrativos de diseño**. No son datos reales ni deben hardcodearse o persistirse como contenido de prueba en producción.

## Reglas de implementación
- Antes de modificar, inspeccionar las pantallas, rutas, entidades, contratos API y servicios existentes para rodeos/animales/pesadas/eventos.
- Reutilizar el flujo y las capacidades existentes de alta de animal, registro de pesada y registro de evento. No duplicar formularios, endpoints ni modelos si ya existen.
- Mantener arquitectura, stack, convenciones y navegación global actuales.
- La pantalla debe respetar el establecimiento actual/seleccionado y los permisos existentes.
- No alterar módulos ajenos a Rodeos ni rediseñar la barra de navegación global dentro de este alcance.
- La lista de rodeos debe reflejar registros reales y estados reales. No agregar categorías/estados persistidos nuevos sin validar el modelo actual.
- Toda operación iniciada desde el detalle de un animal debe recibir el identificador real de ese animal y el contexto del rodeo cuando el dominio lo requiera.

## Flujos

### A. Listar y crear un rodeo
- Entrada desde el módulo de navegación existente, con rótulo **Rodeos**.
- Listado de rodeos accesible, con estado activo/finalizado solo si el modelo actual lo contempla.
- Permitir búsqueda y filtros únicamente si son compatibles con el volumen y los datos disponibles.
- Acción `Crear rodeo` abre el formulario existente o uno nuevo que se integre con el contrato actual.
- Campos del mockup (nombre, establecimiento, categoría, sistema productivo, fecha, notas) son sugerencias visuales: mostrar solo campos que existan o que se apruebe incorporar al modelo.
- Al crear, persistir mediante el servicio real y abrir el detalle del rodeo creado o volver a la lista actualizada.

### B. Ver detalle del rodeo y sus animales
- Mostrar identidad y datos reales del rodeo: nombre, establecimiento, estado y atributos disponibles.
- Listar los animales asignados al rodeo con búsqueda/filtro si los datos actuales lo permiten.
- Cada fila de animal debe ser seleccionable y abrir el detalle del animal conservando el contexto de regreso.
- Permitir agregar animales desde esta pantalla.
- Seleccionar un animal debe habilitar acciones contextuales `Registrar pesada` y `Registrar evento`, o permitir abrir su detalle y ejecutar las acciones desde allí. No exigir buscar/seleccionar nuevamente el mismo animal en esos formularios.
- Evitar acciones masivas ambiguas: las operaciones de pesada/evento pertenecen a un animal individual.

### C. Agregar animales al rodeo
- Mostrar animales existentes que se puedan vincular según las reglas reales del dominio.
- Permitir seleccionar uno o varios si la API ya soporta asociación múltiple; si no, respetar el flujo individual existente.
- Evitar duplicados en el mismo rodeo y bloquear o explicar asociaciones incompatibles con otro rodeo.
- Permitir continuar al alta de un animal nuevo mediante la funcionalidad existente. Al finalizar el alta, asociarlo al rodeo solo si ese comportamiento está respaldado por el modelo/API; de lo contrario, dejar clara la acción posterior para incorporarlo.
- Confirmar cuántos animales se agregan y actualizar el detalle después de guardar.

### D. Consultar un animal y sus historiales
- Detalle individual con identificador/caravana y atributos reales disponibles.
- Secciones o tabs claras para `Resumen`, `Pesadas` y `Eventos`.
- Mostrar pesadas y eventos en orden cronológico definido por la aplicación; incluir fecha, tipo y datos disponibles.
- Mostrar variación de peso solo cuando existan al menos dos pesadas comparables y se pueda calcular correctamente.
- Si no hay registros, mostrar estado vacío específico y ofrecer la acción correspondiente.
- Acciones disponibles: `Registrar pesada` y `Registrar evento`.

### E. Registrar pesada
- Abrir desde un animal ya seleccionado, pasando su ID real y contexto del rodeo. No pedir volver a elegirlo.
- Mostrar el animal seleccionado de forma visible y permitir volver atrás para cambiarlo.
- Antes del formulario, mostrar un resumen breve de pesadas anteriores del mismo animal. Si no hay, informar que será la primera pesada.
- Capturar únicamente campos que soporte el modelo/API actual (por ejemplo peso, fecha y observación si existen).
- Validar campos obligatorios, rangos y unidades conforme a reglas existentes.
- Guardar con el servicio real. Al éxito, volver al detalle/historial y reflejar el nuevo registro; ante error, conservar los datos ingresados y ofrecer reintento.

### F. Registrar evento
- Abrir desde el animal ya seleccionado; no pedir seleccionarlo de nuevo.
- Mostrar identidad del animal y rodeo como contexto.
- Mostrar eventos anteriores del animal antes del formulario, con acceso al historial completo si existe.
- Cargar solo tipos de evento y campos que estén soportados por el modelo y backend. No introducir como opciones de producción las etiquetas ilustrativas del mockup sin validación.
- Validar y persistir usando la funcionalidad real. Al éxito, actualizar historial; ante error, mantener el formulario y permitir reintento.

## Estados y comportamiento móvil
- Loading, error con reintento, vacío y datos insuficientes en listas e historiales.
- Confirmación de éxito y protección frente a doble envío.
- Formularios scrolleables y compatibles con teclado; CTA principal visible/accesible.
- Safe areas, scroll vertical, textos largos, objetivos táctiles y navegación atrás probados en iOS y Android.
- Si no hay conexión, explicar el estado y no fingir que la operación se guardó.

## Criterios de aceptación
1. Se puede crear un rodeo y verlo en la lista/detalle con datos persistidos reales.
2. Desde un rodeo se ven sus animales y se puede incorporar un animal permitido sin duplicarlo.
3. Abrir un animal mantiene la relación con el rodeo y permite consultar sus pesadas y eventos.
4. Desde el animal se inicia una pesada sin volver a seleccionarlo; se muestran sus pesadas previas.
5. Desde el animal se inicia un evento sin volver a seleccionarlo; se muestran sus eventos previos.
6. Al guardar, la lista correspondiente se actualiza y el animal/contexto correcto queda asociado.
7. Las imágenes no son fuente de verdad: ningún nombre, peso, fecha, evento, conteo o estado de muestra queda hardcodeado.
8. Se respetan contratos API y reglas existentes; cualquier capacidad que falte se informa y no se simula.
9. Ejecutar pruebas y validaciones estándar del proyecto (al menos typecheck/lint pertinentes) e informar resultado y archivos modificados.
