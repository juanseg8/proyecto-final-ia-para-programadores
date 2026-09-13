# F01 · Autenticación y control de acceso

**Estado:** implementada
**Invariantes que toca:** INV-05
**Trazabilidad:** [Directorio .agents/runs/F01/](.agents/runs/F01/)

> **Nota sobre INV-05**: F01 implementa identidad autenticada confiable y las primitivas de autorización. La comprobación concreta de ownership sobre recursos se implementará en F02, cuando exista el recurso `Establishment`. Esto NO constituye una falla pendiente de F01, ya que todavía no existe un recurso real sobre el cual aplicar ownership.

---

## Contexto

El sistema Agro Intelligence Network requiere asegurar que la información de los establecimientos ganaderos solo sea accesible por sus dueños o personal autorizado. Dado que el diferencial del producto es el benchmarking anónimo y el uso de IA, la confianza en la privacidad y titularidad de los datos es crítica. Esta feature establece los mecanismos profesionales para el ciclo de vida de la sesión (Access y Refresh Tokens con rotación persistida), el registro de usuarios, la recuperación de contraseñas y la base de la protección centralizada de recursos asegurando que los identificadores ajenos sean completamente invisibles (404 Not Found) para evitar cualquier tipo de enumeración.

## Usuarios

*   **Productor / Usuario de la App:** Ingresa desde la app móvil (React Native) para registrar pesajes, consultar indicadores o interactuar con Agro IA.

---

## Requisitos funcionales

**RF-01.** El sistema debe permitir el registro mediante email y contraseña. El email debe normalizarse (lowercase, sin espacios) antes de persistir y comparar.
**RF-02.** La política de contraseñas exige mínimo 8 y máximo 128 caracteres validados con `class-validator`, sin reglas adicionales de complejidad. Las contraseñas deben almacenarse exclusivamente mediante hash Argon2id (nunca texto plano ni reversibles).
**RF-03.** El sistema debe emitir un token de acceso (JWT, ~15 min) y un token de refresco (duración ~30 días) tras una autenticación exitosa (login o registro), creando una Sesión Persistida. El Access Token debe identificar al usuario (`sub`) y a la sesión (`sid`).
**RF-04.** El sistema debe proveer rotación de Refresh Tokens asociada a la sesión (`sid`). Al refrescar con un token válido, se rota el Refresh Token persistido. Si el Refresh Token enviado es inválido, expirado, revocado o ya fue rotado, se devuelve HTTP 401. Los Refresh Tokens no se almacenan en texto plano (solo su hash).
**RF-05.** `POST /auth/logout` revoca exclusivamente la sesión identificada por el `sid` del usuario autenticado, impidiendo que vuelva a utilizar `/auth/refresh`.
**RF-06.** El sistema debe implementar un mecanismo de recuperación de contraseña de un solo uso (expiración ~30 min). Al resetear la contraseña, se invalida el token utilizado y cualquier otro token de recuperación activo del usuario. El endpoint de solicitud responde genéricamente para no enumerar usuarios.
**RF-07.** Todo endpoint protegido debe rechazar peticiones (HTTP 401) si no cuentan con un Access Token válido.
**RF-08.** **(Invariante INV-05)** El control de acceso a los recursos (Ownership) debe ser transversal. El `userId` a autorizar proviene exclusivamente del token autenticado (nunca del cliente). Si un usuario intenta operar un recurso ajeno, el sistema devuelve HTTP 404 Not Found para ocultar la existencia del recurso. Esta infraestructura se establece aquí, pero la validación real comenzará en F02. No se crearán entidades ficticias en F01.

---

## Contrato

### Endpoints Públicos
*   `POST /auth/register` (Registra y devuelve tokens)
*   `POST /auth/login` (Inicia sesión y devuelve tokens)
*   `POST /auth/refresh` (Recibe RT actual, devuelve nuevos tokens)
*   `POST /auth/forgot-password` (Solicita token de reseteo)
*   `POST /auth/reset-password` (Aplica nueva contraseña usando el token)

### Endpoints Protegidos
*   `POST /auth/logout` (Revoca sesión actual)
*   `GET /auth/me` (Devuelve el perfil del usuario actual)

### DTOs principales
*   **RegisterDTO:** `email` (string, email), `password` (string, min 8, max 128), `name` (string).
*   **LoginDTO:** `email` (string, email), `password` (string).
*   **RefreshDTO:** `refreshToken` (string).
*   **ForgotPasswordDTO:** `email` (string, email).
*   **ResetPasswordDTO:** `token` (string), `newPassword` (string).
*   **AuthResponseDTO:** `accessToken` (string), `refreshToken` (string), `user` (id, email, name). *Jamás incluir passwordHash u otros campos sensibles*.

### Modelos de Datos Mínimos
*   **User:** `id`, `email` (unique), `passwordHash`, `name`, `createdAt`, `updatedAt`.
*   **Session:** `id`, `userId` (FK), `refreshTokenHash`, `expiresAt`, `revokedAt`, `createdAt`, `updatedAt`.

---

## Criterios de aceptación

**CA-01 · Registro y política de claves**
*   **Dado** un payload con " PEdro@Agro.com " y "12345678"
*   **Cuando** se envía a `/auth/register`
*   **Entonces** persiste "pedro@agro.com" y hash Argon2id, retornando HTTP 201 y los tokens.

**CA-02 · Rotación determinista de Refresh Tokens**
*   **Dado** un RT válido asociado a la sesión S1
*   **Cuando** se envía a `/auth/refresh`
*   **Entonces** el hash del RT en S1 se actualiza, retorna HTTP 200 con nuevos tokens.
*   **Y Cuando** se envía un RT expirado, ya rotado o revocado
*   **Entonces** retorna HTTP 401.

**CA-03 · Prevención de enumeración en recuperación**
*   **Dado** una petición a `/auth/forgot-password` con email inexistente
*   **Entonces** responde HTTP 200 OK con mensaje genérico ("Si el correo existe...").

**CA-04 · Reset de contraseña determinista**
*   **Dado** un usuario con múltiples tokens de recuperación activos
*   **Cuando** envía uno válido y su nueva contraseña a `/auth/reset-password`
*   **Entonces** actualiza el hash Argon2id, invalida todos sus tokens de recuperación activos y responde HTTP 200 OK.

**CA-05 · Logout y revocación**
*   **Dado** un usuario autenticado con sesión `sid`
*   **Cuando** hace petición a `/auth/logout`
*   **Entonces** se setea `revokedAt = NOW()` en la sesión `sid` y responde HTTP 200 OK.

**CA-06 · Ownership y visibilidad nula (INV-05)**
*   **Dado** infraestructura preparada para proteger recursos
*   **Cuando** un decorador o guard intercepta petición a recurso con un owner distinto al `userId` del JWT
*   **Entonces** responde HTTP 404 Not Found (indistinguible de un recurso que no existe).

---

## Casos borde y caminos no felices

| Caso | Comportamiento esperado |
|------|------------------------|
| Payload de clave < 8 o > 128 caracteres | HTTP 400 Bad Request interceptado por `class-validator`. |
| Login con email inexistente o password errónea | HTTP 401 Unauthorized ("Credenciales inválidas"). Sin discriminar causa. |
| Inyección de `userId` en Body | Ignorado totalmente. Se usa `req.user.id` provisto por el JWT. |

---

## Fuera de alcance

*   Logout de todos los dispositivos simultáneamente (queda para futura iteración).
*   Revocación automática de todas las sesiones al resetear password.
*   Detección avanzada de robo de familia de tokens.
*   Login social / Single Sign-On (Google/Apple/Facebook).
*   Manejo de roles complejos (Administrador, Veterinario, Peón).
*   Integración final de proveedor real de mailing (se usará Logger/mock).

---

## Notas de implementación

*   **Mobile (React Native):** Usar exclusivamente `expo-secure-store` para guardar tokens. Interceptar HTTP 401 en Axios/Fetch para disparar silenciosamente `/auth/refresh` enviando el RT guardado, reintentando la cola de peticiones si hay éxito.
*   **Backend (NestJS):** La sesión persistida (Session) es una tabla en PostgreSQL. El `accessToken` debe portar `{ sub: userId, sid: sessionId }`. La validación del JWT debe extraer estos valores. Argon2id mandatorio.
