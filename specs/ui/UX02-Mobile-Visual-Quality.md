# UX02 — Mobile Visual Quality & Automated UI Review

## Estado

COMPLETADA

## Tipo

UX / Mobile / Visual QA / Refactor

## Prioridad

ALTA

---

# 0. Setup obligatorio de inspección visual

ANTES de modificar cualquier código de UI, dejar operativo el entorno de inspección visual.

Expo MCP es un prerrequisito obligatorio para esta spec.

El agente debe:

1. Inspeccionar la configuración MCP actual de Antigravity.
2. Buscar `.agents/mcp_config.json`.
3. Verificar si Expo MCP ya se encuentra configurado.
4. Si no está configurado, agregar:

   https://mcp.expo.dev/mcp

5. Inspeccionar `mobile/package.json` y determinar:
   - versión de Expo;
   - SDK;
   - React Native;
   - Expo Router;
   - compatibilidad con Expo MCP.

6. Entrar en `/mobile`.

7. Si corresponde, instalar:

   npx expo install expo-mcp --dev

8. Ejecutar:

   npx expo whoami

9. Si Expo requiere login, OAuth, autorización del MCP o cualquier
   interacción humana:
   - configurar primero todo lo automatizable;
   - detenerse únicamente en ese punto;
   - indicarme exactamente qué botón, comando o autorización debo realizar;
   - NO comenzar todavía el rediseño.

10. Una vez autenticado, levantar Expo con las capacidades MCP habilitadas.

En PowerShell:

   $env:EXPO_UNSTABLE_MCP_SERVER="1"
   npx expo start

11. Verificar realmente que el agente puede:
   - abrir la aplicación;
   - navegar una pantalla;
   - obtener un screenshot;
   - inspeccionar visualmente el resultado.

## HARD RULE

Si el agente todavía no puede ver realmente la aplicación,
NO modificar la UI.

No reemplazar esta comprobación mediante análisis estático del JSX.

Si Expo MCP queda bloqueado por una acción externa:

Estado: BLOQUEADA

e informar exactamente qué acción debo realizar.

# 1. Objetivo

Mejorar profesionalmente la interfaz y experiencia de usuario de la aplicación móvil existente.

Esta tarea NO consiste solamente en modificar estilos.

El agente deberá:

1. Analizar la implementación mobile actual.
2. Leer y respetar `specs/ui/UX01-Design-System.md`.
3. Ejecutar realmente la aplicación.
4. Inspeccionar visualmente las pantallas.
5. Capturar screenshots.
6. Detectar problemas visuales y de UX.
7. Corregirlos.
8. Volver a ejecutar la aplicación.
9. Volver a inspeccionarla.
10. Iterar hasta alcanzar los criterios de aceptación de esta spec.

Una pantalla NO se considera terminada simplemente porque:

- compila;
- TypeScript no da errores;
- Jest pasa;
- el JSX parece correcto.

La pantalla debe ser verificada visualmente.

---

# 2. Alcance

Esta spec aplica exclusivamente al proyecto:

```text
/mobile
```

NO modificar:

```text
/backend
/specs/domain
/specs/features
```

salvo que sea estrictamente necesario para solucionar una dependencia de UI previamente existente.

NO modificar contratos de API.

NO cambiar lógica funcional existente salvo que exista un bug evidente relacionado directamente con la UX.

---

# 3. Principio fundamental

El agente NO deberá diseñar la aplicación "a ciegas".

Debe utilizar un ciclo:

```text
INSPECCIONAR
    ↓
EJECUTAR
    ↓
VISUALIZAR
    ↓
CAPTURAR SCREENSHOT
    ↓
ANALIZAR
    ↓
MODIFICAR
    ↓
EJECUTAR
    ↓
CAPTURAR SCREENSHOT
    ↓
COMPARAR
    ↓
ITERAR
```

No finalizar la tarea sin realizar este ciclo.

---

# 4. Precondiciones

Antes de modificar código:

## 4.1 Analizar proyecto

Inspeccionar:

```text
mobile/package.json
mobile/app/
mobile/src/
mobile/components/
mobile/hooks/
mobile/assets/
```

o las rutas equivalentes existentes.

Determinar:

- versión de Expo;
- versión de React Native;
- uso de Expo Router;
- navegación existente;
- librerías UI existentes;
- sistema actual de estilos;
- componentes reutilizables existentes;
- estructura actual del proyecto;
- implementación de safe areas;
- formularios;
- manejo del teclado;
- iconografía;
- fuentes;
- themes existentes.

NO asumir estructura.

Primero inspeccionar.

---

# 5. Expo MCP

El agente deberá verificar si Expo MCP está disponible.

Referencia:

```text
https://mcp.expo.dev/mcp
```

Debe revisar la configuración MCP existente del proyecto o del IDE.

Buscar particularmente:

```text
.agents/mcp_config.json
```

Si no existe, crear la configuración necesaria para utilizar Expo MCP.

Si el MCP requiere autenticación OAuth o una acción manual del usuario:

1. configurar todo lo automatizable;
2. detener únicamente ese paso;
3. indicar exactamente qué acción humana falta;
4. continuar automáticamente cuando la conexión esté disponible.

NO reemplazar Expo MCP por inspección manual del código si existe la posibilidad de utilizar visualización real.

---

# 6. Expo MCP Local Tools

Comprobar compatibilidad con las herramientas locales de Expo MCP.

Cuando corresponda instalar:

```bash
npx expo install expo-mcp --dev
```

Verificar:

```bash
npx expo whoami
```

No actualizar Expo arbitrariamente.

Si la versión actual no soporta una función necesaria:

1. documentar el problema;
2. evaluar impacto de actualización;
3. NO realizar una migración mayor sin justificarla.

---

# 7. Sistema visual

Antes de incorporar nuevas dependencias, leer:

```text
specs/ui/UX01-Design-System.md
```

Esta spec es la fuente de verdad visual.

Toda modificación debe respetar sus definiciones.

---

# 8. UI Library

Evaluar la implementación mobile actual antes de instalar nuevas librerías.

La opción preferida, si no existe una solución equivalente, es:

```text
gluestack-ui v5
```

para componentes reutilizables.

Puede utilizarse:

```bash
npx gluestack-ui@latest init
```

pero solamente si su incorporación:

- no rompe la arquitectura existente;
- no genera una migración masiva innecesaria;
- es compatible con Expo actual;
- simplifica la consistencia visual.

NO reemplazar componentes funcionales únicamente para decir que se utiliza Gluestack.

Migrar progresivamente.

---

# 9. Skill de Gluestack

Si Antigravity soporta Agent Skills y no existe previamente una skill equivalente, instalar:

```bash
npx skills add gluestack/agent-skills --skill gluestack-ui-v5
```

La skill debe utilizarse como conocimiento auxiliar.

La fuente de verdad continúa siendo:

```text
specs/ui/UX01-Design-System.md
```

---

# 10. Design Tokens

Comprobar si ya existen design tokens.

Si no existen o se encuentran dispersos, centralizarlos.

Estructura sugerida:

```text
mobile/src/theme/
├── colors.ts
├── spacing.ts
├── typography.ts
├── radius.ts
├── shadows.ts
├── sizes.ts
└── index.ts
```

No es obligatorio utilizar exactamente estas rutas si la arquitectura actual utiliza otra convención.

Evitar magic numbers repetidos.

Ejemplo INCORRECTO:

```tsx
padding: 17,
marginTop: 13,
borderRadius: 19
```

Preferir:

```tsx
padding: spacing.lg,
marginTop: spacing.md,
borderRadius: radius.lg
```

---

# 11. Componentes reutilizables

Identificar patrones visuales repetidos.

Crear componentes compartidos cuando corresponda.

Ejemplos:

```text
ScreenContainer
AppHeader
PrimaryButton
SecondaryButton
AppInput
PasswordInput
AppCard
SectionHeader
EmptyState
ErrorState
LoadingState
StatusBadge
BottomSheet
ConfirmDialog
KeyboardAwareForm
```

No crear abstracciones innecesarias.

Un componente debe extraerse principalmente cuando:

- aparece varias veces;
- tiene lógica visual considerable;
- representa una pieza clara del design system.

---

# 12. Criterios visuales

Cada pantalla deberá evaluarse considerando como mínimo:

## Layout

- alineación;
- márgenes;
- padding;
- espaciado vertical;
- espaciado horizontal;
- distribución;
- densidad de información.

## Jerarquía

Debe distinguirse claramente:

```text
Título principal
↓
Descripción / contexto
↓
Contenido
↓
Acciones principales
↓
Acciones secundarias
```

## Tipografía

Revisar:

- tamaño;
- peso;
- line-height;
- contraste;
- truncamiento;
- textos demasiado extensos.

## Colores

Evitar colores arbitrarios fuera del design system.

Controlar contraste.

## Botones

Los CTA principales deben ser evidentes.

Evitar múltiples botones visualmente dominantes simultáneamente.

## Cards

Evitar:

- exceso de sombras;
- bordes innecesarios;
- demasiadas cards dentro de cards;
- esquinas inconsistentes.

## Inputs

Todos los formularios deben considerar:

- label;
- placeholder;
- error;
- disabled;
- focus;
- loading;
- teclado apropiado;
- password visibility si corresponde.

---

# 13. Mobile UX

Verificar obligatoriamente:

## Safe Area

Contenido no debe quedar debajo de:

- status bar;
- notch;
- dynamic island;
- navegación inferior.

## Keyboard

El teclado no debe cubrir:

- inputs activos;
- botones;
- mensajes de error.

Utilizar comportamiento adecuado para formularios.

## Scroll

Las pantallas deben permitir scroll cuando corresponda.

No generar:

```text
nested scrolling
```

innecesario.

## Touch Targets

Los controles deben tener un área táctil adecuada.

No crear botones diminutos.

## Feedback

Toda acción asíncrona relevante debe tener:

```text
loading
success
error
```

cuando corresponda.

---

# 14. Estados obligatorios

Cada pantalla que obtiene información remota deberá considerar:

```text
LOADING
SUCCESS
EMPTY
ERROR
OFFLINE
```

cuando aplique.

No mostrar simplemente una pantalla en blanco.

---

# 15. Navegación

Revisar consistencia de:

- headers;
- back buttons;
- tabs;
- bottom navigation;
- modals;
- stacks;
- deep navigation.

El usuario siempre debe comprender:

```text
Dónde estoy
Qué puedo hacer
Cómo volver
```

---

# 16. Iconografía

Utilizar una única familia principal de iconos cuando sea posible.

No mezclar arbitrariamente múltiples estilos:

```text
outlined
filled
rounded
sharp
```

Los iconos deben tener significado funcional.

No utilizar iconos únicamente como decoración cuando agreguen ruido visual.

---

# 17. Auditoría inicial

Antes de realizar cambios importantes generar:

```text
specs/ui/reports/UX02-initial-audit.md
```

Debe incluir:

```text
## Pantallas encontradas

## Problemas globales

## Problemas por pantalla

## Componentes duplicados

## Inconsistencias visuales

## Problemas de navegación

## Problemas de formularios

## Problemas de responsive

## Prioridad de correcciones
```

Clasificar problemas:

```text
P0 Bloqueante
P1 Importante
P2 Mejora
P3 Cosmético
```

---

# 18. Screenshots iniciales

Cuando Expo MCP esté funcionando:

capturar el estado inicial de cada pantalla principal.

Guardar evidencia cuando técnicamente sea posible en:

```text
specs/ui/reports/screenshots/before/
```

No modificar todavía una pantalla sin comprender su estado actual.

---

# 19. Orden de trabajo

Trabajar por flujo de usuario, NO aleatoriamente.

Prioridad sugerida:

```text
1. Autenticación
2. Navegación principal
3. Dashboard / Home
4. Establecimientos
5. Gestión ganadera
6. Indicadores
7. Benchmark
8. Alertas
9. Clima
10. Agro IA
11. Perfil / configuración
```

Adaptar esta lista a las pantallas realmente implementadas.

NO implementar features inexistentes sólo porque aparecen en esta lista.

---

# 20. Procedimiento por pantalla

Para CADA pantalla:

## Paso 1

Abrir pantalla actual.

## Paso 2

Capturar screenshot BEFORE.

## Paso 3

Analizar:

```text
layout
spacing
typography
colors
hierarchy
touch targets
forms
navigation
loading
errors
empty states
safe areas
keyboard
scroll
```

## Paso 4

Corregir código.

## Paso 5

Ejecutar nuevamente.

## Paso 6

Capturar screenshot AFTER.

## Paso 7

Comparar.

## Paso 8

Si todavía existen problemas visibles:

volver al Paso 3.

Una sola iteración NO es necesariamente suficiente.

---

# 21. Tamaños

La UI debe funcionar correctamente en diferentes tamaños mobile.

Como mínimo revisar visualmente:

```text
Android pequeño
Android estándar
iPhone estándar
iPhone con notch / Dynamic Island
```

Cuando no sea posible utilizar todos los dispositivos, utilizar dimensiones equivalentes en emuladores.

---

# 22. Responsive

No utilizar posiciones absolutas para construir layouts normales.

Evitar valores dependientes de una sola resolución.

Evitar:

```tsx
width: 390
height: 844
```

salvo usos específicamente justificados.

Preferir:

```text
flex
maxWidth
minWidth
percentage
content-driven sizing
```

cuando corresponda.

---

# 23. Accesibilidad

Verificar:

- contraste;
- labels accesibles;
- tamaño táctil;
- botones identificables;
- inputs descriptivos;
- estados disabled perceptibles.

Cuando corresponda agregar:

```tsx
accessibilityLabel
accessibilityRole
accessibilityHint
```

---

# 24. Performance visual

Evitar:

- renders innecesarios;
- imágenes gigantes;
- listas sin virtualización;
- sombras extremadamente costosas;
- animaciones innecesarias;
- componentes pesados repetidos.

Para listas extensas utilizar el mecanismo apropiado, por ejemplo:

```text
FlatList
FlashList
```

según dependencias y necesidades existentes.

---

# 25. Animaciones

Las animaciones deben utilizarse solamente cuando ayudan a comprender:

- navegación;
- cambio de estado;
- expansión;
- feedback;
- transición.

No agregar animaciones decorativas excesivas.

---

# 26. Tests

Luego del refactor ejecutar:

```bash
npm test
```

o el comando existente correspondiente.

También:

```bash
npx tsc --noEmit
```

cuando aplique.

Corregir errores introducidos por esta tarea.

No ocultar errores mediante:

```text
@ts-ignore
any indiscriminado
eslint-disable global
```

---

# 27. Visual Regression

La validación visual tiene prioridad en esta spec.

Mantener evidencia AFTER cuando sea posible:

```text
specs/ui/reports/screenshots/after/
```

y generar:

```text
specs/ui/reports/UX02-final-report.md
```

---

# 28. Reporte final

El reporte deberá incluir:

```markdown
# UX02 Final Report

## Resumen

## Herramientas configuradas

## Expo MCP

## Design System aplicado

## Dependencias agregadas

## Componentes creados

## Pantallas revisadas

## Problemas corregidos

## Screenshots before/after

## Tests ejecutados

## Resultado TypeScript

## Problemas pendientes

## Decisiones técnicas
```

---

# 29. Prohibiciones

Está prohibido:

- rehacer toda la aplicación sin necesidad;
- modificar backend;
- cambiar contratos de API;
- inventar funcionalidades;
- eliminar funcionalidades existentes;
- introducir datos mock permanentes;
- reemplazar lógica real por mocks;
- marcar la tarea completa sin abrir la app;
- marcar la tarea completa únicamente porque compile;
- diseñar sin inspeccionar screenshots;
- ignorar UX01;
- cambiar arbitrariamente colores por preferencia del agente;
- agregar dependencias duplicadas;
- tener dos librerías UI para resolver lo mismo sin justificación.

---

# 30. Hard Rule — Visual Verification

Esta es una regla obligatoria:

> Ninguna modificación visual importante puede considerarse terminada sin validación visual posterior.

Después de modificar una pantalla:

```text
RUN APP
↓
OPEN SCREEN
↓
SCREENSHOT
↓
ANALYZE
↓
FIX IF NECESSARY
```

Si no se realizó esta secuencia, la pantalla continúa:

```text
PENDIENTE
```

---

# 31. Autonomía

El agente puede tomar decisiones técnicas menores necesarias para alcanzar esta spec.

NO debe preguntar al usuario por decisiones triviales como:

```text
¿Cambio este padding?
¿Uso 16 o 18?
¿Centro este texto?
```

Debe resolverlas según:

```text
UX01-Design-System.md
+
buenas prácticas mobile
+
resultado visual
```

Solamente detenerse si existe:

- cambio arquitectónico importante;
- migración mayor;
- riesgo de pérdida de funcionalidad;
- necesidad de credenciales;
- OAuth;
- decisión funcional no definida por las specs.

---

# 32. Criterios de aceptación

UX02 se considera COMPLETADA solamente cuando:

- [ ] se inspeccionó la arquitectura mobile actual;
- [ ] se leyó UX01;
- [ ] Expo MCP quedó configurado o se documentó explícitamente el bloqueo externo;
- [ ] la app fue ejecutada;
- [ ] las pantallas principales fueron inspeccionadas visualmente;
- [ ] existen screenshots de validación cuando las herramientas lo permiten;
- [ ] se corrigieron inconsistencias globales;
- [ ] existe un sistema coherente de spacing;
- [ ] existe tipografía coherente;
- [ ] existen colores coherentes;
- [ ] existe manejo correcto de safe areas;
- [ ] el teclado no rompe formularios;
- [ ] las pantallas soportan scroll cuando corresponde;
- [ ] loading/error/empty están correctamente manejados;
- [ ] los componentes repetidos fueron normalizados razonablemente;
- [ ] TypeScript pasa;
- [ ] tests existentes pasan;
- [ ] no existen regresiones funcionales conocidas;
- [ ] se generó UX02-final-report.md;
- [ ] cada pantalla modificada fue inspeccionada DESPUÉS de su modificación.

---

# 33. Definición de DONE

```text
CODE DONE
≠
UX DONE
```

UX02 solamente está:

```text
DONE
```

cuando:

```text
CODE
+
TEST
+
RUN
+
VISUAL INSPECTION
+
ITERATION
+
FINAL VERIFICATION
```

han sido completados.

---

# 34. Ejecución autónoma

Una vez iniciada esta spec:

continuar de forma autónoma pantalla por pantalla.

No detenerse después de mejorar solamente Login o Home.

Continuar con todas las pantallas actualmente implementadas que formen parte del flujo mobile.

Mantener cambios incrementales y verificables.

Actualizar el estado de esta spec durante la ejecución.

Estados permitidos:

```text
PENDIENTE
EN_PROGRESO
BLOQUEADA
COMPLETADA
```

Al terminar modificar:

```text
Estado: COMPLETADA
```

únicamente si todos los criterios obligatorios fueron satisfechos.