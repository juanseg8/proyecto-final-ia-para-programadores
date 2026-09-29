# Plan de Implementación F10 (End-to-End)

Este documento detalla el plan de acción técnico para convertir a Agro Intelligence en una aplicación completamente funcional, de extremo a extremo, en base a la spec F10 y las precisiones posteriores acordadas.

## 1. Auth, Perfil y Contextos (F01, F10)
**Estado actual:** 
- Backend: API y Auth completas (`auth.controller.ts`, `jwt.strategy.ts`). Migración F01 existe.
- Mobile: UI de Login/Registro y Perfil consumen parcialmente API.
**Cambio necesario / Precisiones:**
- Integrar `LoginScreen` y `RegisterScreen` con `AuthContext`.
- Añadir validación de inputs y manejo de errores (Axios interceptor, JWT expirados).
- Modificar `App.tsx` para enrutamiento basado en estado de sesión auténtico.
- **Perfil/logout**: Perfil debe mostrar los datos reales del usuario autenticado. Logout debe revocar/eliminar sesión y tokens correctamente desde el backend, no solamente resetear navegación local.

## 2. Establishment Global Context
**Estado actual:**
- Implementado parcialmente `EstablishmentContext.tsx` con `selectedEstablishmentId`.
**Cambio necesario:**
- Persistir la selección usando `AsyncStorage`.
- Asegurar que todas las pantallas y tableros reaccionen globalmente al cambio de `selectedEstablishmentId`.

## 3. CRUD de Establecimientos y Ubicación (F02)
**Estado actual:**
- Backend: Completo (`establishment.controller.ts`). Migración F02 existe.
- Mobile: Formularios actualizados a CRUD base, pero incompletos en precisión.
**Cambio necesario / Precisiones:**
- **Ubicación del establecimiento**: El formulario de alta/edición debe implementar el flujo: Provincia → Localidad → Mapa → Punto exacto. 
- Al seleccionar localidad, el mapa debe centrarse aproximadamente en ella. El usuario debe poder tocar el mapa y mover/seleccionar el marcador antes de confirmar.
- Alternativa: "Usar mi ubicación actual" (obtener latitude/longitude vía expo-location y reverse geocoding para provincia/localidad). Si se rechazan permisos, el alta debe seguir por selección manual.
- Persistir obligatoriamente en PostgreSQL: `province, locality, latitude, longitude`.
- **Alta completa**: No implementar sólo nombre + ubicación. Permitir cargar todos los datos del establecimiento definidos por el dominio (crear, consultar, editar, eliminar si F02 lo contempla).

## 4. Clima y Alertas (F07, F06)
**Cambio necesario / Precisiones:**
- **Clima**: El clima NO debe utilizar el GPS actual del dispositivo salvo para elegir ubicación inicialmente. Debe consultar SIEMPRE las coordenadas persistidas del `selectedEstablishment.latitude + longitude` hacia la Weather API.
- **Alertas**: Generación real de alertas según F06. Originadas desde reglas/datos reales y asociadas al establecimiento. Eliminar toda alerta estática hardcodeada de la UI.

## 5. Gestión Ganadera (F03)
**Cambio necesario:**
- Remover todos los mocks de UI y asegurar guardado de lotes, pesajes y eventos hacia la base de datos real.

## 6. Módulos Analíticos: Indicadores y Benchmark (F04, F05)
**Cambio necesario / Precisiones:**
- **Benchmark**: Verificá que el endpoint calcule métricas a partir de PostgreSQL y del dataset demo. Cero porcentajes/promedios hardcodeados. Debe respetarse anonimato y poblaciones mínimas F05.
- Asegurar que `IndicatorsScreen` exponga datos verídicos provenientes del backend.

## 7. Agro IA (F08)
**Cambio necesario / Precisiones:**
- Agro IA debe usar `selectedEstablishmentId`.
- Debe enviar al backend únicamente contexto REAL disponible del establecimiento, incluyendo ubicación, clima, ganadería, indicadores, benchmark y alertas.
- Recomendaciones 100% reales de la API (OpenAI/Anthropic si es el caso), sin datos hardcodeados.

## 8. Dashboard y Navegación (F09)
**Cambio necesario / Precisiones:**
- **Dashboard**: Reaccionar a cambio de establecimiento. Información real. Ofrecer navegación clara hacia Clima, Indicadores, Benchmark, Alertas, y Agro IA.
- **Navegación**: Accesos a Inicio, Establecimientos, Agro IA, Alertas, Perfil. Desde el establecimiento: Resumen, Ubicación, Clima, Indicadores, Ganadería, Benchmark.

## 9. Dataset Demo y DB
**Cambio necesario / Precisiones:**
- Todos los usuarios, establecimientos y datos productivos DEBEN SER FICTICIOS.
- Zonas sugeridas: Corrientes, Goya, Mercedes, Curuzú Cuatiá, Paso de los Libres (coordenadas aproximadas válidas, no propiedades privadas reales).
- Múltiples usuarios y establecimientos suficientes para benchmark y anonimato.
- Sembrar información ganadera real (pesajes, rodeos) para hacer funcionar Dashboard, Indicadores, Benchmark, Alertas e IA.
- Seed debe ser **idempotente** y estar bloqueado en production.

## 10. Validación E2E y Testing
**Cambio necesario / Precisiones:**
- **Testing**: Agregar tests backend/mobile y ejecutar `TypeScript/build/tests`. No ocultar errores con mocks, any, @ts-ignore o datos estáticos.
- **Validación E2E**: Correr Android Emulator con Expo MCP. Hacer screenshots del flujo completo:
  Registro/login → crear establecimiento → provincia/localidad/mapa → guardar → ver ubicación → clima → indicadores → benchmark → alertas → Agro IA → perfil → logout.
