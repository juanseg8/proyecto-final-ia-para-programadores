# Prompt para Antigravity: implementar Home de Agro Intelligence

En esta carpeta están `home_referencia.png` y `logo_hojas.png`. La Home que hay que reproducir es **la pantalla del teléfono del medio** de `home_referencia.png`; los teléfonos laterales son otras pantallas y no forman parte de este trabajo.

Implementá ahora únicamente la pantalla Home de la aplicación actual, con componentes nativos de React Native y Expo. Tomá la Home del centro como referencia visual directa: respetá su composición, jerarquía, alineación, colores, tipografía, proporciones, tarjetas, iconografía y espacios. Usá el isotipo de hojas de `logo_hojas.png` cuando corresponda; si ya está incorporado como asset compartido en el proyecto, reutilizá ese mismo archivo/componente.

## Antes de modificar código

1. Revisá la estructura del frontend mobile, la pantalla Home, navegación, componentes visuales, estilos, manejo de sesión y fuentes de datos.
2. Revisá las reglas SDD Anchor y de delegación del repositorio. Cumplilas en análisis, implementación, validación y evidencia.
3. Identificá qué datos y acciones de Home ya están conectados a servicios/backend y reutilizalos.
4. Mantené React Native + Expo + TypeScript y la arquitectura actual. No cambies backend, endpoints, autenticación ni contratos.

## Composición visual de Home

Tomá como referencia el teléfono del centro:

- Encabezado con saludo personalizado (“Buen día, [nombre]”), una frase secundaria breve y avatar/iniciales del usuario.
- Tarjeta principal con fotografía rural, frase breve superpuesta y paginación discreta si el carrusel ya existe o es reutilizable.
- Sección “Tus establecimientos”, con acción “Ver todos” y tarjeta resumida del usuario.
- Tarjeta de resumen con cantidad real de establecimientos, descripción breve e icono/flecha consistente.
- Sección “Acciones rápidas”, con tarjetas compactas y alineadas para las acciones disponibles (crear establecimiento y ver establecimientos, según rutas reales).
- Tarjeta informativa de indicadores y benchmarking, siguiendo la referencia. Si aún no está disponible, mostrarla como “Próximamente” o deshabilitada de forma honesta; no simular que ya funciona.
- Navegación inferior consistente con la navegación que ya existe en la aplicación.

Conservá los tonos verdes, el fondo cálido claro, las tarjetas blancas, los bordes suaves y la estética agropecuaria de la referencia. Usá iconos del sistema de iconografía existente; no representes flechas como caracteres de texto si el proyecto ya tiene iconos.

## Comportamiento y datos

- El saludo debe usar el perfil autenticado disponible.
- La cantidad y las tarjetas de establecimientos deben venir de la fuente real existente.
- Las acciones deben navegar a rutas reales y funcionales. No agregues accesos que terminen en pantallas vacías.
- No copies nombres, ubicaciones, números ni superficies de ejemplo desde la imagen a la app.
- Si el usuario no tiene establecimientos, mostrar un estado vacío diseñado con el mismo estilo y una acción funcional para crear el primero.
- Si falla la carga, mostrar un error recuperable y opción de reintentar.
- Si no hay foto disponible, usar un fallback visual coherente sin romper el diseño.
- No elimines rutas o funcionalidades actuales. Adaptá la barra inferior al mapa de navegación existente, sin agregar destinos ficticios.

## Reglas de implementación

- La imagen es una guía visual; no la uses como fondo completo ni como captura incrustada. Construí la pantalla con componentes y datos reales.
- No rediseñes Login, Registro, recuperación de contraseña ni otras pantallas ya trabajadas.
- No hagas todavía la implementación de detalle, clima o benchmarking; en Home solo conservá la tarjeta correspondiente con el estado real disponible.
- Respetá safe areas, scroll, accesibilidad y tamaños de pantalla habituales.
- Eliminá márgenes y espacios excesivos; alineá títulos, tarjetas, iconos y acciones con una grilla consistente.
- El engranaje flotante de Expo es una herramienta de desarrollo, no parte de la UI de la aplicación.

## Validación requerida

1. Ejecutá la app y compará una captura de Home con la pantalla central de `home_referencia.png`.
2. Corregí las diferencias visibles antes de cerrar.
3. Verificá Home con sesión autenticada, con establecimientos y sin establecimientos, y los estados de carga/error.
4. Probá todas las acciones y destinos visibles; confirmá que no haya botones sin acción ni pantallas vacías.
5. Ejecutá typecheck y las pruebas mobile existentes relacionadas con Home/navegación.
6. Informá los archivos modificados, fuentes de datos reutilizadas, pruebas ejecutadas y cualquier elemento que siga pendiente.

Al terminar esta etapa, detenete en Home. No avances a otras pantallas.
