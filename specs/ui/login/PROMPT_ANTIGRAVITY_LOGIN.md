# Prompt para Antigravity: implementar Login y fijar el logo de Agro Intelligence

Adjunto `login_referencia.png` como referencia visual principal. Implementá primero únicamente la pantalla de Login y el componente de identidad de marca. El objetivo es reproducir esta pantalla con la mayor fidelidad visual posible dentro de la aplicación actual.

## Antes de modificar

1. Revisá la estructura actual del frontend mobile, navegación, pantalla de autenticación, estilos compartidos, assets y logo existente.
2. Revisá las reglas SDD Anchor y las reglas de delegación del repositorio. Seguilas para el análisis, implementación, pruebas y registro de evidencia.
3. Reutilizá la lógica de autenticación actual y sus componentes. No cambies backend, contratos, endpoints ni el flujo de sesión.
4. No reemplaces React Native/Expo ni la arquitectura existente.

## Referencia visual

Usá `login_referencia.png` para comparar el resultado durante la implementación. Conservá su composición y estilo:

- Fondo cálido marfil, marca verde bosque y fotografía rural suave en el borde inferior.
- Isotipo de dos hojas y nombre “Agro Intelligence”, con la bajada “DATOS PARA UN CAMPO MÁS EFICIENTE”.
- Título “Bienvenido nuevamente” y texto “Accedé para gestionar y analizar la información de tu establecimiento.”
- Campos “Correo electrónico” y “Contraseña”, iconos discretos y control para mostrar/ocultar la contraseña.
- Botón principal “Iniciar sesión” con flecha.
- Enlaces “¿No tenés una cuenta? Crear cuenta” y “¿Olvidaste tu contraseña?”.
- Jerarquía, proporciones, alineaciones, espaciados, radios, colores y tipografía visualmente equivalentes a la referencia.
- Centrado óptico vertical con márgenes superior e inferior equilibrados cuando el teclado está cerrado.

No pongas la imagen completa como fondo ni como pantalla: la pantalla debe implementarse con componentes nativos, campos funcionales y texto accesible. El PNG es solo una guía visual. No agregues elementos que no aparecen en la referencia. El engranaje flotante de Expo es una herramienta de desarrollo, no parte de la aplicación.

## Logo único y reutilizable

El archivo `agro-intelligence-logo.svg` es la propuesta de logo canónico para este trabajo. Revisá si el proyecto ya tiene un logo aprobado. Si existe uno, conservá ese asset y usalo como fuente única en toda la app; no crees una segunda versión. Si no existe, incorporá este SVG como fuente de verdad, verificando que la configuración actual de Expo pueda renderizar SVG. Si no puede, convertí el mismo SVG a un formato compatible sin redibujarlo.

Creá o adaptá un único componente compartido (por ejemplo `BrandLogo`) para mostrar variantes del mismo asset: logo completo en autenticación y solo isotipo donde el espacio sea reducido. No vuelvas a dibujar hojas con iconos distintos, no uses texto simulado como logo y no insertes capturas rasterizadas de la marca. Centralizá tamaños/variantes y reutilizá el componente en las demás pantallas cuando se trabajen.

## Responsive, teclado y accesibilidad

- Respetá safe areas de iOS y Android.
- Con teclado abierto, permití scroll/ajuste sin tapar campos, enlaces ni botón.
- En pantallas de poca altura, priorizá formulario desplazable y mantén el CTA accesible; no fuerces centrado vertical que cause overflow.
- Usá labels y estados accesibles; contraste legible; soporte de mostrar/ocultar contraseña.
- Mantené los estados de validación, carga y error que ya use el login actual.

## Validación y entrega

1. Compará una captura del login implementado con `login_referencia.png` en un emulador o simulador. Corrigí diferencias visibles de layout antes de cerrar.
2. Verificá Login → autenticación correcta → navegación posterior ya existente, y errores de credenciales/validación.
3. Ejecutá typecheck y pruebas mobile existentes relacionadas con autenticación.
4. No declares terminado si el CTA, enlaces, teclado, safe areas o autenticación dejan de funcionar.
5. Informá archivos modificados, decisiones de reutilización del logo, pruebas y cualquier diferencia pendiente.

Al finalizar esta etapa, detenete en Login y el componente de logo. No rediseñes Home ni agregues las demás pantallas todavía.
