# Diagnóstico de Implementación Mobile (Gap Analysis)

Este reporte detalla el estado funcional real de la aplicación móvil frente a las especificaciones originales definidas en `specs/features/`. Se ha revisado el código fuente de `/mobile/src` y el enrutamiento para determinar qué existe a nivel de UI y qué está realmente conectado al Backend/API.

## Resumen de Cobertura

| Feature | Spec | Implementada | Pantalla | Ruta | Accesible | Backend/API | Estado | Acción requerida |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Autenticación (Login/Reg)** | F01 | Parcial | Sí | Sí | Sí | No | ⚠️ Incompleta | El login actual (`LoginScreen`) realiza un mock navegando directo sin llamar a `AuthContext` ni validar JWT. |
| **Establecimiento (CRUD)** | F02 | Parcial | Sí | Sí | Sí | Sí | ⚠️ Incompleta | Lista obtiene datos de API, pero la creación (`EstablishmentFormScreen`) hace navegación directa sin `POST`. |
| **Ubicación / Mapa** | F02 | Parcial | Sí | Sí | Sí | No | ⚠️ Incompleta | Se renderiza `MapView` en el Tab "Mapa", pero las coordenadas actuales son generadas con Math.random() (Mock). |
| **Gestión Ganadera** | F03 | Sí | Sí | Sí | Sí | Sí | ✅ Funcional | Operaciones (Herds, Animals, Weighings, Events) configuradas con `apiClient`. |
| **Indicadores y KPIs** | F04 | No | No | No | No | No | ❌ Faltante | No existe una pantalla de KPIs general ni se consumen los endpoints de métricas avanzadas. |
| **Benchmark Anónimo** | F05 | Parcial | Sí | Sí | Sí | No | ⚠️ Incompleta | Pantalla creada (`BenchmarkScreen`) pero con datos hardcodeados en el front-end. |
| **Alertas** | F06 | Parcial | No | No | No | No | ❌ Faltante | Existe el componente UI `AlertsCard` pero no hay un flujo ni pantalla dedicada que consuma un endpoint de alertas. |
| **Clima (API externa)** | F07 | Sí | Sí | Sí | Sí | Sí | ✅ Funcional | Componente `WeatherCard` en el detalle del establecimiento consume el endpoint correctamente. |
| **Agro IA** | F08 | Parcial | Sí | Sí | Sí | Sí | ⚠️ Rota | La pantalla consume la API, pero al moverse a un Global Tab (`MainTabNavigator`) espera un `route.params.establishmentId` que es undefined, causando error al abrir. |
| **Dashboard** | F09 | Sí | Sí | Sí | Sí | Sí | ✅ Funcional | La pantalla Home consume establecimientos y muestra widgets base. |
| **Perfil y Cierre de Sesión** | N/A | Parcial | Sí | Sí | Sí | No | ⚠️ Incompleta | `ProfileScreen` es visual. El botón "Cerrar sesión" limpia la pila de navegación local pero no elimina el token del backend/context. |

---

## Hallazgos Críticos

1. **Problema de Arquitectura con Agro IA:**
   Actualmente `AgroAiScreen` espera un `establishmentId` como parámetro de ruta para hacer el POST al endpoint de IA. Al integrarlo en el *Bottom Tab Navigator* global (como se solicitó), ya no recibe este ID específico porque la pestaña es global. Se necesita implementar un selector global de establecimiento o hacer que Agro IA funcione a nivel cuenta/usuario (requeriría actualización del backend).

2. **Desconexión del Flujo de Autenticación:**
   A pesar de existir un `AuthContext.tsx` bastante completo con Axios interceptors y refresco de tokens, los formularios de `LoginScreen` y `RegisterScreen` no lo están usando. Hacen navegación falsa saltándose la seguridad real de la API.

3. **Mocks y "Falsa Sensación" de Completitud:**
   La UI luce muy bien y completa, pero acciones clave como *Guardar nuevo establecimiento*, *Ver Benchmark* o *Ver mis puntos en el mapa* son solo animaciones visuales o datos generados aleatoriamente (`Math.random()`).

## Conclusión

La "cáscara" de navegación y la Estructura (UX/UI) están en un estado avanzado, pero la integración con los contratos de API (*Data Fetching* y *Mutations*) presenta grandes brechas. El siguiente paso lógico debería ser consolidar la integración del Backend en el flujo de **Login**, resolver el paso de parámetros a la pestaña de **Agro IA**, y reemplazar los **Mocks** (Benchmark/Mapa) por datos reales de PostgreSQL/API.
