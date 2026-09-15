# Feature F02 — Establecimiento y ubicación

**Estado:** implementada

## 1. Descripción General
Permite a los usuarios autenticados gestionar sus establecimientos ganaderos (campos). El establecimiento es el recurso principal y la unidad organizativa base para todas las operaciones futuras del sistema.

## 2. Invariantes de la Constitución
- **INV-05 (Aislamiento de inquilinos por diseño):** El usuario solo puede operar sobre sus propios establecimientos. El ownership del recurso se determina **exclusivamente** mediante el token de autenticación.
  - *F02 completa por primera vez la aplicación material de INV-05*:
    - no autenticado -> 401
    - propio -> acceso (operación normal)
    - ajeno -> 404
    - inexistente -> 404
    - userId inyectado -> 400
    - listados exclusivamente del usuario autenticado.

## 3. Requisitos Funcionales
- **RF-01 (Crear Establecimiento):** Permite a un usuario autenticado crear un establecimiento especificando nombre, provincia, localidad, latitud, longitud y superficie.
- **RF-02 (Listar):** Retorna la lista exclusiva de establecimientos pertenecientes al usuario autenticado.
- **RF-03 (Detalle):** Muestra los datos completos de un establecimiento particular del usuario.
- **RF-04 (Editar):** Permite modificar los datos básicos y la ubicación de un establecimiento existente.
- **RF-05 (Eliminar):** Permite eliminar un establecimiento existente. Para F02, esta será una eliminación física directa en base de datos (sin soft delete todavía). Como no hay hijos productivos en esta fase, se elimina directo. (Aplica INV-05: retorna `404 Not Found` si es ajeno o inexistente).
- **RF-06 (Ubicación en Mapa):** El mecanismo primario para definir la latitud y longitud debe ser una selección visual en un mapa interactivo (moviendo y confirmando un marcador). No se contempla el ingreso manual numérico de coordenadas. La ubicación debe poder editarse posteriormente con el mismo mecanismo.
- **RF-07 (Atajo GPS):** La interfaz mobile debe proveer un botón opcional "Usar mi ubicación actual" que obtenga las coordenadas mediante el GPS del dispositivo. Si el usuario deniega los permisos de ubicación, el flujo no debe interrumpirse y el usuario debe poder continuar posicionando el marcador manualmente en el mapa.
- **RF-08 (Unicidad de Nombre):** Un usuario no puede registrar dos establecimientos con el mismo nombre normalizado. Sin embargo, usuarios diferentes sí pueden utilizar el mismo nombre de establecimiento. Conceptualmente se aplica `UNIQUE(userId, normalizedName)`.

## 4. Estructura de Datos (Modelo Lógico)
- **ID:** UUID o CUID generado por el sistema.
- **Nombre (`name`):** String, Requerido. Se debe normalizar (trim, case-insensitive) para la validación de unicidad por usuario.
- **Provincia (`province`):** String, Requerido.
- **Localidad (`locality`):** String, Requerido.
- **Latitud (`latitude`):** Float, Requerido. Validar rango: -90 a 90.
- **Longitud (`longitude`):** Float, Requerido. Validar rango: -180 a 180.
- **Superficie (`superficieHa`):** Float, Requerido. Validar que sea mayor a 0 y admita decimales. Expresa la "superficie total declarada del establecimiento", no asume (por ahora) que representa la superficie ganadera productiva efectiva.
- **Auditoría Temporal:** Campos `createdAt` y `updatedAt`, gestionados automáticamente por TypeORM/DB.

## 5. Contrato HTTP y DTOs

**Contrato Canónico (Backend, Mobile y Tests coinciden exactamente):**
```json
{
  "name": "string",
  "province": "string",
  "locality": "string",
  "latitude": 0,
  "longitude": 0,
  "superficieHa": 0
}
```
*No debe quedar ninguna referencia funcional a `provincia`, `surface`, aliases ocultos, hooks TypeORM creados como compatibilidad, ni transformaciones manuales de response.*

**Endpoints:**
- `POST   /establishments`
- `GET    /establishments` (Devuelve exclusivamente los establecimientos del usuario autenticado).
- `GET    /establishments/:id`
- `PUT    /establishments/:id`
- `DELETE /establishments/:id`

**Reglas de los DTOs (Create / Update):**
- Los campos internos **jamás** se aceptan desde el cliente: `id`, `userId`, `normalizedName`, `createdAt`, `updatedAt`.
- El campo `normalizedName` es derivado internamente por el backend a partir del `name`.
- Como la API utiliza whitelist estricta, si el cliente intenta inyectar cualquiera de estos campos (`userId` en particular), la petición debe rechazarse con `400 Bad Request`.
- Ante duplicado de nombre para el usuario, se retorna `409 Conflict`.
- `GET`, `PUT` y `DELETE` para un `:id` que pertenece a otro inquilino retornan siempre `404 Not Found`.

## 6. Criterios de Aceptación (BDD)

### Backend
**Escenario: Inyección de userId (INV-05)**
- **Dado** un cliente que intenta vulnerar la seguridad.
- **Cuando** envía un request a `POST /establishments` incluyendo el campo `userId` en el cuerpo.
- **Entonces** el sistema rechaza la solicitud con `400 Bad Request` por violación de whitelist.

**Escenario: Conflicto de nombre duplicado**
- **Dado** que un usuario ya posee un establecimiento llamado "La Margarita".
- **Cuando** intenta crear o renombrar otro establecimiento a " la margarita " (con espacios y minúsculas).
- **Entonces** el sistema normaliza el nombre y devuelve `409 Conflict`.

**Escenario: Nombres idénticos entre diferentes usuarios**
- **Dado** que el Usuario A tiene registrado "Los Álamos".
- **Cuando** el Usuario B intenta registrar su propio establecimiento con el nombre "Los Álamos".
- **Entonces** el sistema permite la creación y responde `201 Created`.

**Escenario: Validaciones de dominio numérico**
- **Dado** un payload de creación o edición.
- **Cuando** se envían coordenadas fuera de rango (ej. latitud 100) o superficie negativa (ej. -10).
- **Entonces** la API responde con `400 Bad Request` indicando el error de validación específico.

### Mobile
**Escenario: Selección visual de coordenadas**
- **Dado** que el usuario se encuentra en el formulario de "Nuevo establecimiento".
- **Cuando** accede a la sección de ubicación.
- **Entonces** se despliega un mapa interactivo (agnóstico al proveedor) donde puede arrastrar y soltar un marcador para confirmar su posición exacta.

**Escenario: Comportamiento ante denegación de permisos GPS**
- **Dado** que el usuario se encuentra en la selección de mapa.
- **Cuando** pulsa el atajo "Usar mi ubicación actual" y el sistema operativo solicita permisos, pero el usuario los deniega.
- **Entonces** la aplicación no bloquea el flujo ni reporta un error fatal, permitiendo al usuario continuar posicionando el marcador manualmente en el mapa de forma ininterrumpida.

## 7. Flujo Mobile
- **Navegación:** `Home` -> `Mis establecimientos` -> `+ Nuevo establecimiento` -> `Formulario Básico (Nombre, Prov, Loc, Superficie)` -> `Asignar Ubicación` -> (Pantalla/Modal de Mapa interactivo con marcador y botón GPS) -> `Confirmar Ubicación` -> `Guardar` -> `Redirección al Detalle`.
- **Detalle del Establecimiento:** Pantalla que muestra todos los datos básicos, un mini-mapa o indicador de la ubicación geográfica, y las acciones de "Editar" y "Eliminar".

## 8. Fuera de Alcance
- Ingreso manual numérico de latitud y longitud.
- Integración con servicios y features futuras: Clima (F07), Gestión de rodeos, animales, pesajes, indicadores, benchmark, alertas, IA.
- Reglas de eliminación en cascada complejas (el MVP define un DELETE simple del recurso físico, las cascadas se definirán al introducir entidades dependientes).
