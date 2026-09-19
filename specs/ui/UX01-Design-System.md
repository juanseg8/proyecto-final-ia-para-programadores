# Iniciativa UX01 - Design System / Mobile UI Foundation (FIX01)

**Estado:** NO APROBADA / REQUIERE CORRECCIÓN (UX01-FIX01)

## 1. Referencia Visual Oficial
El mockup adjunto (`C:/Users/guili/.gemini/antigravity/brain/8944850d-03e0-4727-a1d0-9e54ce164906/.user_uploaded/media_1789610719229.jpg`) es la referencia visual oficial de UX01.

**Regla de Interpretación (Mockup vs Spec):**
- **Para decisiones puramente visuales:** Mockup > Interpretación libre del agente.
- **Para comportamiento funcional:** Specs F01/F02 > Mockup.

*No se permite una inspiración aproximada. La implementación debe ser visualmente cercana al mockup, dentro de las limitaciones de React Native, respetando estrictamente las funcionalidades ya implementadas.*

## 2. Idioma Único: Español
Toda la UI visible al usuario debe estar en español. Los nombres técnicos de screens o rutas nunca deben ser visibles al usuario.
- **Ejemplos:**
  - `Home` → Inicio
  - `EstablishmentList` → Mis establecimientos
  - `EstablishmentDetail` → Detalle del establecimiento
  - `NewEstablishment` → Nuevo establecimiento
  - `Register` → Crear cuenta
  - `Login` → Iniciar sesión
  - `Logout` → Cerrar sesión

## 3. Arquitectura y Navegación
- **Navegación Visual (Bottom Navigation / Headers):** Deben coincidir con el mockup. No inventar features para rellenar. Si se incluyen features futuras (ej. "Indicadores"), deben ser puramente informativas/inactivas, no interactivas.
- **Flujos de Navegación y Auto-Refresco:** 
  - Tras `CREATE`, `UPDATE` o `DELETE`, el listado de establecimientos debe refrescarse automáticamente (refetch al focus, estado local, invalidación, etc.).
  - Las pantallas de detalle y listado deben mostrar la información fresca sin que el usuario deba salir y entrar manualmente.
- **Errores Internos de RN:** El usuario nunca debe ver errores técnicos (ej. "The action 'NAVIGATE' with payload...").

## 4. Formularios: GeoRef Argentina y Google Maps
- **Provincias y Localidades (GeoRef):** Los campos `province` y `locality` ya no pueden ser de texto libre. Se debe integrar la API de GeoRef Argentina.
  - Flujo: Seleccionar provincia → Cargar localidades → Seleccionar localidad.
  - UX: Searchable, manejo de estados (loading, error, retry), localidad deshabilitada hasta elegir provincia, limpieza al cambiar provincia.
  - Fallback (Resiliencia): Si GeoRef falla, mostrar error recuperable y permitir reintentos, sin romper la app y sin hacer fallback automático a input libre sin aprobación humana.
  - **Contrato Backend INTACTO:** No se deben enviar IDs al backend, el payload mantiene `province: string` y `locality: string`.
- **Google Maps:** Se debe utilizar `react-native-maps` con `PROVIDER_GOOGLE` para iOS y Android.
  - API keys separadas/restringidas configuradas correctamente vía variables de entorno.
  - La lógica del GPS, fallback manual y marcador (F02) debe mantenerse intacta, solo cambia el proveedor y su presentación.

## 5. Pantallas Obligatorias y Refactor Visual
- **Login & Register:** Branding Agro Intelligence real (logo), título/subtítulo, inputs de ancho adecuado, jerarquía CTA, Safe Area correcta.
- **Home (Inicio):** Saludo, accesos rápidos, CTA a Mis establecimientos, sección "Próximamente" informativa, botón de logout integrado armónicamente (no debe dominar la pantalla).
- **Mis Establecimientos:** Tarjetas (Cards) de calidad con la información de contrato (nombre, localidad, provincia, superficie en ha). No usar fotografías (`imageUrl`), usar placeholder gráfico o icono local. Empty State oficial si no hay registros.
- **Detalle del Establecimiento:** Jerarquía visual clara (nombre, ubicación, superficie). Botón Editar vs Botón Eliminar (el de eliminar debe ser destructivo). Integración del `ConfirmDialog` al eliminar.
- **Formulario (Crear/Editar):** Rediseño con labels claros, selectores de provincia/localidad y mapa Google Maps integrado coherentemente.

## 6. Foundation y Tokens (AgTech Premium)
Reutilización **estricta** de: `AppScreen`, `AppHeader`, `AppButton`, `AppInput`, `AppCard`, `FormField`, `EmptyState`, `ConfirmDialog`.
Si una screen tiene su propio diseño manual duplicado, UX01 se considera incumplida.

**Tokens Visuales Innegociables:**
- `forest`: #173F35, `primaryLight`: #2F6655, `leaf`: #6E9F72
- `background`: #F6F7F2, `surface`: #FFFFFF, `surfaceSecondary`: #EEF2EC
- `textPrimary`: #17221E, `textSecondary`: #66736D, `border`: #DCE4DE
- `success`: #2F7D4A, `warning`: #C58A24, `error`: #B9473F, `info`: #3F6F8F
- Mantener alto contraste, superficies limpias, y espaciados/radios coherentes.
