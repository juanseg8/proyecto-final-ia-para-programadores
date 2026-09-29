# SPEC — Mis establecimientos

## 1. Objetivo

Implementar una experiencia mobile funcional para que una persona pueda consultar sus establecimientos en tres modos: **Todos**, **Mapa** y **Favoritos**. Las imágenes de esta carpeta son referencias visuales independientes para esos tres estados. La implementación debe usar componentes nativos y datos reales del proyecto.

## 2. Alcance

Incluye la pantalla de listado con tres tabs, tarjetas de establecimientos, mapa con marcadores, filtro de favoritos, acceso a crear un establecimiento y navegación al detalle existente.

No incluye la creación de nuevos contratos de backend, edición del establecimiento, detalle completo ni cambios a autenticación. Antes de agregar lógica o rutas, auditar lo que ya existe.

## 3. Datos y fuentes

- Usar la sesión y el usuario autenticado actuales.
- Consultar los establecimientos mediante el servicio o endpoint ya implementado.
- Reutilizar campos reales que existan, por ejemplo identificador, nombre, localidad/provincia, superficie, unidad, coordenadas y estado de favorito.
- No copiar nombres, cantidades, superficies, ubicaciones ni imágenes de las referencias como datos permanentes.
- Si la API no entrega coordenadas, no inventar ubicaciones en el mapa. Mostrar un estado explicativo para establecimientos sin ubicación y mantenerlos visibles en Todos/Favoritos.
- Si favorito aún no tiene persistencia, revisar el modelo y servicios primero. No agregar un endpoint duplicado. Informar la limitación y conservar un comportamiento coherente con la arquitectura actual.

## 4. Estructura compartida

- Encabezado: título **Mis establecimientos** y botón `+` para la ruta real de alta.
- Tabs: **Todos (n)**, **Mapa**, **Favoritos (n)**. Los contadores deben derivarse de datos reales.
- Mantener la navegación inferior actual, sus rutas y el estilo de la aplicación.
- Respetar safe areas de iOS/Android. La barra inferior no debe recortar iconos o etiquetas ni dejar un bloque vacío innecesario.
- Reutilizar componentes, tokens, tipografía, colores e iconos existentes. No incluir el control flotante de desarrollo de Expo en la UI.

## 5. Tab Todos

- Mostrar todos los establecimientos del usuario en una lista desplazable.
- Cada tarjeta debe incluir, cuando estén disponibles: imagen/thumbnail, nombre, ubicación, superficie con valor y unidad, estado favorito y affordance para abrir el detalle.
- Si no hay imagen, usar un fallback visual consistente; no mostrar imágenes inventadas como si correspondieran al campo.
- Tocar la tarjeta abre el detalle del establecimiento seleccionado. La estrella solo cambia favorito y no debe activar la navegación de la tarjeta.
- El botón `+` navega al flujo de alta que ya exista.

## 6. Tab Mapa

- Mostrar todos los establecimientos que tengan coordenadas válidas, con un marcador por establecimiento.
- Ajustar el encuadre inicial para incluir los marcadores disponibles; evitar empezar con un mapa excesivamente alejado.
- Al tocar un marcador, mostrar una tarjeta resumida con nombre, ubicación y superficie disponible. Desde allí debe poder abrirse el detalle real.
- Ofrecer controles solo si ya existen o son compatibles con el mapa usado por el proyecto; no agregar controles decorativos sin acción.
- Si ningún establecimiento tiene coordenadas válidas, mostrar un estado vacío con acceso a corregir/agregar ubicación, usando rutas existentes.

## 7. Tab Favoritos

- Mostrar únicamente establecimientos marcados como favoritos.
- La cantidad del tab representa el número real de favoritos.
- Permitir quitar de favoritos desde la tarjeta y actualizar el estado según el mecanismo existente.
- Si no hay favoritos, mostrar un empty state claro que invite a marcar establecimientos desde Todos.

## 8. Estados y comportamiento

Implementar estados de carga, error recuperable con reintento, lista vacía, favoritos vacíos y mapa sin coordenadas. Cambiar de tab no debe provocar navegación incorrecta ni datos cruzados. Mantener interacciones táctiles suficientemente grandes y distinguir el área de la estrella de la tarjeta.

## 9. Criterios de aceptación

1. Los tabs Todos, Mapa y Favoritos muestran el contenido correcto y actualizan sus contadores.
2. Todos lista los registros reales del usuario; ninguna tarjeta presenta unidad sin valor.
3. Favoritos filtra correctamente y el cambio de estrella no abre el detalle accidentalmente.
4. El mapa dibuja solo ubicaciones válidas y tocar un marcador permite abrir el establecimiento correcto.
5. Alta, detalle y navegación inferior usan rutas existentes y no llegan a pantallas blancas.
6. Loading, error y empty states son visibles, recuperables y coherentes con la identidad visual.
7. En iPhone y Android, títulos, tabs, tarjetas, marcadores, iconos, barra inferior y safe areas se ven completos; los textos no se recortan.
8. Typecheck y pruebas mobile existentes pasan. Comparar capturas de los tres tabs contra `01_todos.png`, `02_mapa.png` y `03_favoritos.png`.

## 10. Entrega

Informar pantallas/rutas revisadas, componentes y servicios reutilizados, archivos modificados, resultados de pruebas y cualquier funcionalidad pendiente por falta de datos o soporte backend. No marcar como terminado un criterio que no se haya verificado.
