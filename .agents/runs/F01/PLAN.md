# PLAN · F01: Autenticación y control de acceso

## Tarea 1: Base de datos y Entidades Base
- [x] Crear entidad `User` (`id`, `email` [UNIQUE, normalizado], `passwordHash` [Argon2id], `name`, `createdAt`, `updatedAt`).
- [x] Crear entidad `Session` (`id`, `userId` [FK -> User], `refreshTokenHash` [SHA-256], `expiresAt`, `revokedAt`, `createdAt`, `updatedAt`).
- [ ] Generar migraciones iniciales de TypeORM explícitamente (`synchronize: false`). *(Pendiente: PostgreSQL inalcanzable localmente)*.
- [ ] **Dependencias:** Ninguna.
- [ ] **Invariantes:** Ninguno.

## Tarea 2: Registro e Inicio de sesión (Auth/JWT Core)
- [x] Configurar `@nestjs/passport` y `@nestjs/jwt`.
- [x] Integrar Argon2id para hasheo de contraseñas.
- [x] Implementar `POST /auth/register` (normalización, validación con `class-validator`).
- [x] Implementar `POST /auth/login` (emisión de `accessToken` con `sub` y `sid`, y persistencia de la sesión).
- [ ] **Dependencias:** Tarea 1.
- [ ] **Invariantes:** Ninguno.

## Tarea 3: Rotación de Refresh Tokens y Logout
- [x] Diseñar RT como JWT firmado (secreto distinto) con `sub` y `sid`.
- [x] Implementar lógica `refresh` buscando sesión por `sid`. Validar existencia, pertenencia a `sub`, no revocada, no expirada, y coincidencia SHA-256 del hash completo.
- [x] Rotación: emitir nuevos AT y RT, reemplazar hash, el anterior deja de ser válido. Retornar HTTP 401 si falla cualquier validación.
- [x] Implementar lógica `logout` que marque la sesión `sid` como revocada.
- [x] Implementar los endpoints en el Controller correspondientes.
- [ ] **Dependencias:** Tarea 2.
- [ ] **Invariantes:** Ninguno.

## Tarea 4: Recuperación de contraseña
- [x] Crear entidad `PasswordResetToken` (`id`, `userId` [FK], `tokenHash` [SHA-256], `expiresAt`, `usedAt`, `createdAt`).
- [x] Implementar lógica `forgot-password` (respuesta genérica, genera token aleatorio, persiste hash, invalida anteriores activos).
- [x] Implementar lógica `reset-password` (valida token, no usado, expiración; actualiza `passwordHash` Argon2id; invalida todos los tokens activos del usuario). No revocar sesiones.
- [x] Implementar los endpoints en el Controller correspondientes.

### Verificación y Calidad
- [x] Pruebas unitarias de Entidades y Lógica Pura (AuthService, hashing, normalización)
- [x] Migraciones TypeORM (UP y DOWN verificados en Postgres)
- [x] Pruebas E2E / Integración (Postgres `agro_test`) con todos los casos de la spec
- [x] Revisión de cobertura de flujos críticos
- [x] Revisión de invariantes (No aplica enumeración en reset password, no salen hashes al frontend)

- [ ] **Dependencias:** Tarea 1.
- [ ] **Invariantes:** Ninguno.

## Tarea 5: Infraestructura Ownership (INV-05) y Auth Guard
- [x] Implementar JWT Guard para proteger rutas y extraer el `userId`.
- [x] Limpieza: Se eliminó código especulativo (`ownership.guard.ts`) que no valida nada real en F01. INV-05 se pospone estrictamente para F02.
- [x] Implementar `GET /auth/me`.
- [ ] **Dependencias:** Tarea 2.
- [ ] **Invariantes:** INV-05 (Preparado para F02).

## Tarea 6: Integración Mobile (React Native)
- [x] Inicializar proyecto Mobile y configurar `expo-secure-store`.
- [x] Implementar Auth State, login, register, y logout.
- [x] Configurar cliente HTTP (Axios/Fetch) con interceptor transparente para HTTP 401. Manejar concurrencia.
- [x] En caso de fallo de refresh: limpiar SecureStore, limpiar estado auth, redirigir a login.
- [x] Restore session al iniciar la app.
- [ ] **Dependencias:** Tareas 2 y 3.
- [ ] **Invariantes:** Ninguno.
