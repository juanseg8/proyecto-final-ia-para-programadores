# UX01 — Agro Intelligence Mobile Design System

## Estado

ACTIVO

## Tipo

UX / UI / Design System / Mobile

## Aplicación

Agro Intelligence

## Plataforma principal

React Native + Expo

---

# 1. Objetivo

Este documento define el sistema visual oficial de Agro Intelligence.

Es la fuente de verdad para:

- colores;
- tipografía;
- espaciado;
- bordes;
- sombras;
- componentes;
- iconografía;
- formularios;
- navegación;
- cards;
- estados;
- feedback visual;
- responsive;
- accesibilidad;
- comportamiento mobile.

Toda pantalla nueva o existente debe respetar este documento.

Cuando exista una decisión visual no especificada explícitamente, el agente deberá mantener coherencia con este Design System y con las pantallas ya aprobadas.

---

# 2. Principios de diseño

Agro Intelligence debe transmitir:

```text
Tecnología
+
Campo
+
Confianza
+
Claridad
+
Datos
+
Simplicidad
```

La aplicación NO debe parecer:

- un ERP antiguo;
- un dashboard web reducido a celular;
- una app bancaria;
- una aplicación excesivamente corporativa;
- una interfaz cargada de bordes y tablas;
- una colección de componentes visualmente inconexos.

La experiencia debe sentirse:

```text
MODERNA
LIMPIA
PROFESIONAL
AGRÍCOLA
TECNOLÓGICA
SIMPLE
```

---

# 3. Referencia visual

Existe una referencia visual principal en:

```text
specs/ui/mockups/main-mockup.jpg
```

Esta imagen debe utilizarse como inspiración y referencia visual.

NO debe copiarse de manera rígida pixel por pixel.

Debe extraerse de ella:

- lenguaje visual;
- densidad;
- uso del color;
- jerarquía;
- estilo general;
- composición.

Si existe conflicto entre el mockup y requisitos funcionales reales, prevalece la funcionalidad.

Si existe conflicto entre diferentes pantallas, debe prevalecer este Design System.

---

# 4. Filosofía mobile-first

La interfaz debe diseñarse específicamente para celular.

NO diseñar primero como web y luego reducir.

Priorizar:

- interacción táctil;
- lectura rápida;
- una mano;
- navegación clara;
- información resumida;
- jerarquía fuerte;
- scroll vertical natural.

Las pantallas deben evitar sobrecarga cognitiva.

---

# 5. Paleta de colores

## 5.1 Primary

Color principal asociado al agro, crecimiento y naturaleza.

```ts
primary: {
  50:  '#F1F8F4',
  100: '#DDEFE4',
  200: '#BCE0C9',
  300: '#91C9A8',
  400: '#64AE84',
  500: '#3D9165',
  600: '#2F7551',
  700: '#285E44',
  800: '#234B39',
  900: '#1E3E31',
}
```

Color principal recomendado:

```text
#2F7551
```

Debe utilizarse principalmente para:

- CTA principal;
- elementos seleccionados;
- navegación activa;
- indicadores positivos;
- acciones principales.

---

# 6. Secondary / Technology

Color secundario asociado a tecnología, información y datos.

```ts
secondary: {
  50:  '#F1F7FA',
  100: '#DFEDF3',
  200: '#C3DEE8',
  300: '#98C6D6',
  400: '#66A8BD',
  500: '#478CA4',
  600: '#397187',
  700: '#325C6E',
  800: '#2D4D5B',
  900: '#293F4A',
}
```

Usar de manera secundaria.

No competir visualmente con Primary.

---

# 7. Accent

Puede utilizarse un color cálido para:

- clima;
- métricas destacadas;
- alertas suaves;
- acciones secundarias específicas.

```ts
accent: {
  50:  '#FFF8EB',
  100: '#FCEBCB',
  200: '#F8D58F',
  300: '#F3BC52',
  400: '#EDA52E',
  500: '#DE8918',
}
```

No utilizarlo como color principal global.

---

# 8. Colores neutrales

```ts
neutral: {
  0:   '#FFFFFF',
  50:  '#F8FAF9',
  100: '#F1F4F2',
  200: '#E3E8E5',
  300: '#CCD4CF',
  400: '#9BA8A1',
  500: '#6E7C75',
  600: '#53615A',
  700: '#3E4943',
  800: '#29332E',
  900: '#17201B',
}
```

---

# 9. Background

Background principal:

```text
#F8FAF9
```

Las pantallas NO deberían utilizar blanco absoluto para absolutamente todo.

Se recomienda:

```text
background → neutral.50

cards → neutral.0
```

Esto permite separar superficies sin abusar de sombras.

---

# 10. Colores semánticos

## Success

```text
#2F855A
```

## Warning

```text
#D69E2E
```

## Error

```text
#C53030
```

## Info

```text
#3182A0
```

Nunca utilizar únicamente color para comunicar un estado.

Debe acompañarse cuando corresponda de:

- icono;
- texto;
- label.

---

# 11. Dark Mode

Dark Mode NO es obligatorio en esta etapa.

No introducirlo parcialmente.

Si se implementa en el futuro deberá realizarse como una feature completa.

---

# 12. Tipografía

Priorizar una tipografía limpia y moderna.

Preferencia:

```text
Inter
```

Alternativa:

```text
System font
```

No utilizar más de una familia tipográfica principal.

---

# 13. Escala tipográfica

```ts
fontSize = {
  xs:   12,
  sm:   14,
  md:   16,
  lg:   18,
  xl:   20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
}
```

---

# 14. Jerarquía tipográfica

## Display

```text
30–36 px
Bold
```

Uso:

- bienvenida;
- pantallas especiales;
- métricas importantes.

Uso limitado.

---

## Screen Title

```text
24 px
SemiBold / Bold
```

Ejemplo:

```text
Mis establecimientos
```

---

## Section Title

```text
18–20 px
SemiBold
```

Ejemplo:

```text
Estado del campo
```

---

## Card Title

```text
16 px
SemiBold
```

---

## Body

```text
16 px
Regular
```

---

## Secondary Body

```text
14 px
Regular
neutral.600
```

---

## Caption

```text
12 px
Medium / Regular
neutral.500
```

---

# 15. Font Weight

Usar principalmente:

```text
400 Regular
500 Medium
600 SemiBold
700 Bold
```

Evitar utilizar Bold indiscriminadamente.

---

# 16. Line Height

Los textos deben respirar.

Orientación:

```text
fontSize 12 → lineHeight 16
fontSize 14 → lineHeight 20
fontSize 16 → lineHeight 24
fontSize 18 → lineHeight 26
fontSize 20 → lineHeight 28
fontSize 24 → lineHeight 32
```

---

# 17. Sistema de espaciado

Usar escala base consistente.

```ts
spacing = {
  0:   0,
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
}
```

Evitar valores arbitrarios como:

```text
13px
17px
21px
27px
```

salvo necesidad excepcional.

---

# 18. Espaciado horizontal de pantalla

Padding horizontal estándar:

```text
16px
```

En pantallas con mayor aire visual:

```text
20px
```

Nunca hacer que el contenido principal toque los bordes.

---

# 19. Espaciado entre secciones

Por defecto:

```text
24px
```

Secciones claramente separadas:

```text
32px
```

---

# 20. Border Radius

```ts
radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
}
```

Uso recomendado:

```text
Inputs        → 12
Buttons       → 12
Cards         → 16
Large cards   → 20
Badges        → full
Avatar        → full
```

Evitar mezclar radios arbitrariamente.

---

# 21. Bordes

Los bordes deben ser sutiles.

Default:

```text
1px solid neutral.200
```

No utilizar bordes negros.

No encerrar absolutamente todo dentro de cajas.

---

# 22. Sombras

Las sombras deben ser suaves.

Priorizar:

```text
background difference
+
border
```

antes que sombras fuertes.

Las cards pueden utilizar una elevación leve.

Evitar:

- sombras negras fuertes;
- sombras gigantes;
- glow;
- múltiples niveles de elevación sin razón.

---

# 23. Cards

Las cards representan agrupaciones reales de información.

Default:

```text
background: white
borderRadius: 16
padding: 16
border: neutral.200
```

Separación entre cards:

```text
12–16px
```

---

# 24. Card Anatomy

Cuando corresponda:

```text
┌────────────────────────────┐
│ Icono        Estado        │
│                            │
│ Título                     │
│ Información secundaria     │
│                            │
│ Métrica / contenido        │
│                            │
│ Acción →                   │
└────────────────────────────┘
```

No todas las cards necesitan todos esos elementos.

---

# 25. Evitar Card Hell

NO crear estructuras como:

```text
Card
  └ Card
      └ Card
          └ Card
```

La interfaz debe respirar.

Usar separación visual y tipografía antes que cajas dentro de cajas.

---

# 26. Botones

Debe existir una jerarquía clara.

## Primary Button

```text
background: primary.600
text: white
height: 48–52
borderRadius: 12
```

Uso:

acción principal de la pantalla.

---

## Secondary Button

```text
background: primary.50
text: primary.700
```

---

## Outline Button

```text
background: transparent
border: neutral.300
text: neutral.800
```

---

## Destructive Button

```text
background: error
text: white
```

Solamente para acciones destructivas reales.

---

## Ghost Button

Para acciones de baja prioridad.

No abusar.

---

# 27. Regla de CTA

Idealmente una pantalla debe tener:

```text
1 acción primaria dominante
```

Puede tener varias acciones secundarias.

Evitar tener:

```text
4 botones verdes idénticos
```

compitiendo por atención.

---

# 28. Tamaño táctil

Todo elemento interactivo deberá tener un área táctil mínima aproximada de:

```text
44 × 44
```

preferentemente:

```text
48 × 48
```

---

# 29. Inputs

Anatomía preferida:

```text
Label

┌───────────────────────────┐
│ Valor / placeholder       │
└───────────────────────────┘

Helper / error
```

---

# 30. Inputs — medidas

Altura aproximada:

```text
48–52px
```

Border radius:

```text
12px
```

Padding horizontal:

```text
16px
```

---

# 31. Input States

Debe existir una representación clara de:

```text
default
focus
filled
disabled
error
```

El error debe mostrarse cerca del campo.

---

# 32. Password Input

Debe incluir control:

```text
mostrar / ocultar contraseña
```

El icono debe tener un touch target adecuado.

---

# 33. Formularios

Evitar formularios extremadamente largos en una única vista si pueden dividirse lógicamente.

Agrupar campos relacionados.

Ejemplo:

```text
Información general

Nombre
CUIT
Actividad

Ubicación

Provincia
Localidad
Dirección
```

---

# 34. Teclado

En formularios:

- el input activo debe permanecer visible;
- el teclado no debe cubrir CTA;
- debe permitirse cerrar teclado;
- utilizar keyboardType correcto.

Ejemplos:

```text
email
numeric
phone-pad
decimal-pad
```

según corresponda.

---

# 35. Navegación principal

La navegación principal debe ser simple.

Si existe Bottom Tab Navigation:

preferir entre:

```text
3 y 5 destinos
```

Evitar más de 5 elementos.

---

# 36. Bottom Navigation

Cada destino debe tener:

```text
icono
+
label
```

El destino actual debe diferenciarse claramente.

Ejemplo conceptual:

```text
Inicio
Campos
Agro IA
Alertas
Perfil
```

La lista definitiva depende de las features implementadas.

---

# 37. Headers

Los headers deben mantenerse consistentes.

Pantalla raíz:

```text
Título
opcionalmente acción derecha
```

Pantalla secundaria:

```text
←
Título
opcionalmente acción derecha
```

No reinventar el header en cada pantalla.

---

# 38. Dashboard / Home

La Home debe responder rápidamente:

```text
¿Qué está pasando?
¿Qué necesita mi atención?
¿Qué puedo hacer?
```

Evitar llenar Home con toda la información disponible.

Priorizar:

```text
Resumen
Alertas
Indicadores principales
Acciones rápidas
Información contextual
```

---

# 39. Métricas

Una métrica debe mostrar:

```text
valor
+
unidad
+
contexto
```

Ejemplo:

```text
72%
Humedad del suelo
```

Mejor que:

```text
72
```

sin contexto.

---

# 40. Datos y gráficos

Los gráficos deben utilizarse cuando aportan comprensión real.

No usar gráficos simplemente para decorar.

Todo gráfico debe tener:

- título;
- contexto;
- unidad;
- período temporal si aplica.

---

# 41. Clima

La información climática debe ser:

- muy legible;
- rápida de interpretar;
- contextual.

Priorizar:

```text
temperatura
condición
precipitación
viento
humedad
pronóstico
```

sin convertir la pantalla en una estación meteorológica profesional salvo que la feature lo requiera.

---

# 42. Alertas

Las alertas deben diferenciar prioridad.

Ejemplo:

```text
INFO
WARNING
CRITICAL
```

No hacer todas rojas.

Rojo debe reservarse para situaciones importantes.

---

# 43. Estados vacíos

Nunca mostrar solamente:

```text
No hay datos
```

Preferir estructura:

```text
[Icono]

Todavía no tenés establecimientos

Agregá tu primer establecimiento para comenzar
a utilizar Agro Intelligence.

[Agregar establecimiento]
```

Cuando exista una acción lógica.

---

# 44. Loading

Evitar pantallas completamente bloqueadas cuando no sea necesario.

Preferir:

```text
skeleton
```

para contenido estructurado.

Usar spinner para operaciones puntuales.

---

# 45. Error

Un error debe explicar:

```text
Qué pasó
Qué puede hacer el usuario
```

Ejemplo:

```text
No pudimos cargar tus establecimientos.

Revisá tu conexión e intentá nuevamente.

[Reintentar]
```

---

# 46. Offline

Cuando la aplicación no tenga conexión y la feature requiera Internet:

mostrar un estado explícito.

No dejar contenido eternamente cargando.

---

# 47. Success Feedback

Para acciones simples:

- toast;
- snackbar;
- feedback inline.

Evitar abrir un modal por cada operación exitosa.

---

# 48. Modales

Utilizar modal cuando la decisión requiera atención.

NO usar modal para navegación normal.

---

# 49. Bottom Sheet

Preferible para:

- acciones contextuales;
- filtros;
- selección;
- detalles rápidos;
- acciones secundarias.

---

# 50. Confirmaciones

Solicitar confirmación únicamente para acciones significativas.

Ejemplo:

```text
Eliminar establecimiento
Cerrar sesión
Descartar cambios importantes
```

No confirmar cada acción trivial.

---

# 51. Iconografía

Utilizar una única librería principal.

Preferencia si ya existe:

```text
Lucide
```

o la librería actualmente adoptada por Expo.

No mezclar iconos de múltiples familias sin necesidad.

---

# 52. Tamaños de iconos

Orientación:

```text
16 → inline
20 → secondary
24 → standard
28–32 → prominent
```

No utilizar iconos gigantes sin una razón.

---

# 53. Imágenes

Las imágenes deben:

- respetar aspect ratio;
- tener loading apropiado;
- utilizar placeholder si corresponde;
- no deformarse.

---

# 54. Avatares

Default:

```text
40–48px
```

Avatares pequeños:

```text
32px
```

---

# 55. Chips y badges

Usarlos para:

- estados;
- filtros;
- categorías;
- selección.

No utilizarlos como botón universal.

---

# 56. Información secundaria

Debe utilizar menor contraste.

Ejemplo:

```text
neutral.500
neutral.600
```

No toda la pantalla debe tener texto negro intenso.

---

# 57. Separadores

Utilizar separadores solamente cuando agregan claridad.

Preferir spacing antes que líneas.

---

# 58. Safe Areas

Toda pantalla debe respetar:

```text
top safe area
bottom safe area
```

Especialmente:

- notch;
- Dynamic Island;
- Android status bar;
- home indicator.

---

# 59. Scroll

La estructura más común debe ser:

```text
SafeArea
  ↓
Header
  ↓
ScrollView / List
```

cuando corresponda.

No crear scroll anidado sin necesidad.

---

# 60. Listas

Para listas grandes utilizar:

```text
FlatList
```

o una solución virtualizada equivalente.

No renderizar cientos de elementos con:

```text
ScrollView + map
```

---

# 61. Responsive

No utilizar una única resolución fija.

Evitar:

```tsx
width: 390
height: 844
```

La aplicación debe adaptarse.

Priorizar:

```text
flex
percentage
minWidth
maxWidth
aspectRatio
content-based sizing
```

---

# 62. Orientación

La aplicación está optimizada inicialmente para:

```text
portrait
```

No es obligatorio soportar landscape salvo feature específica.

---

# 63. Accesibilidad

Agregar cuando corresponda:

```tsx
accessibilityLabel
accessibilityRole
accessibilityHint
```

Debe existir contraste suficiente.

No comunicar información exclusivamente mediante color.

---

# 64. Copywriting

El texto debe ser:

```text
directo
breve
humano
claro
```

Evitar lenguaje excesivamente técnico frente al usuario.

---

# 65. Español

Idioma principal:

```text
Español
```

Mantener consistencia terminológica.

Ejemplo:

usar siempre:

```text
Establecimiento
```

y no alternar arbitrariamente con:

```text
Campo
Finca
Propiedad
Establecimiento
```

salvo que representen entidades diferentes.

---

# 66. Microcopy

Incorrecto:

```text
Ha ocurrido un error inesperado en la petición.
```

Preferido:

```text
No pudimos cargar la información.
Intentá nuevamente.
```

---

# 67. IA

La sección Agro IA debe distinguir visualmente conversación de contenido tradicional.

Sin embargo, debe continuar formando parte del mismo producto.

No crear una aplicación visual completamente distinta dentro de Agro Intelligence.

---

# 68. Chat

Mensajes del usuario y de Agro IA deben distinguirse claramente.

Evitar burbujas gigantes.

El input debe permanecer accesible al abrir teclado.

---

# 69. Animaciones

Las animaciones deben ser:

```text
rápidas
sutiles
funcionales
```

Orientación:

```text
150–300 ms
```

No utilizar animaciones largas salvo necesidad.

---

# 70. Motion

Utilizar animación principalmente para:

- cambio de estado;
- entrada de modal;
- bottom sheet;
- selección;
- expansión;
- feedback.

No para decorar cada interacción.

---

# 71. Consistencia

Si dos elementos realizan la misma función deben verse y comportarse de manera similar.

Ejemplo:

todos los PrimaryButton deben compartir:

```text
height
radius
typography
colors
loading
disabled
```

---

# 72. Componentes base

Idealmente el proyecto debe converger hacia componentes reutilizables como:

```text
ScreenContainer
AppHeader

PrimaryButton
SecondaryButton
OutlineButton
IconButton

AppInput
PasswordInput
SearchInput

AppCard
MetricCard
WeatherCard
AlertCard

StatusBadge
Chip

EmptyState
ErrorState
LoadingState

AppModal
ConfirmDialog
BottomSheet
```

No es obligatorio crearlos todos inmediatamente.

Crear cuando tengan uso real.

---

# 73. ScreenContainer

Debe normalizar:

- SafeArea;
- background;
- padding;
- keyboard;
- scroll cuando corresponda.

Evitar repetir lógica de layout en cada pantalla.

---

# 74. Design Tokens

Las propiedades visuales repetidas deben centralizarse.

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

Adaptar a la arquitectura existente si fuera necesario.

---

# 75. Magic Numbers

Evitar:

```tsx
marginTop: 17
padding: 13
borderRadius: 19
```

Preferir:

```tsx
marginTop: spacing.lg
padding: spacing.md
borderRadius: radius.lg
```

---

# 76. Inline Styles

Evitar grandes cantidades de estilos inline repetidos.

Utilizar el mecanismo de estilos definido por el proyecto.

Si se adopta NativeWind o Gluestack, mantener consistencia.

No mezclar cuatro estrategias de estilos simultáneamente.

---

# 77. Gluestack UI

Puede utilizarse Gluestack UI v5 como base de componentes si UX02 determina que corresponde.

Gluestack NO reemplaza este Design System.

Debe configurarse para seguir estas reglas.

---

# 78. NativeWind

Puede utilizarse cuando ayude a mantener:

- consistencia;
- velocidad de desarrollo;
- responsive;
- tokens.

No utilizar clases arbitrarias en cada pantalla ignorando el Design System.

---

# 79. Pantallas prioritarias

El sistema visual debe aplicarse principalmente a:

```text
Autenticación
Dashboard
Establecimientos
Ganadería
Indicadores
Benchmark
Alertas
Clima
Agro IA
Perfil
```

solamente cuando esas features existan.

---

# 80. Login

El Login debe ser:

```text
limpio
simple
con marca visible
sin distracciones
```

Debe priorizar:

```text
Logo / identidad
Título
Email
Contraseña
CTA
Recuperar contraseña
```

---

# 81. Home / Dashboard

Debe utilizar jerarquía.

Orden conceptual recomendado:

```text
Saludo / contexto
↓
Establecimiento seleccionado
↓
Información importante
↓
Métricas
↓
Alertas
↓
Acciones
```

No es obligatorio seguir exactamente ese orden si el producto requiere otro.

---

# 82. Establecimientos

Cada establecimiento debería ser reconocible fácilmente.

Mostrar únicamente información útil en la lista.

El detalle puede contener información más profunda.

---

# 83. Datos ganaderos

Cuando existan métricas ganaderas:

priorizar lectura rápida mediante:

```text
valor
+
unidad
+
variación
+
contexto
```

---

# 84. Benchmark

Las comparaciones deben dejar claro:

```text
Mi valor
vs
Referencia
```

Nunca utilizar colores sin etiquetas como único mecanismo de comparación.

---

# 85. Alertas prioritarias

Visualmente:

```text
CRITICAL
WARNING
INFO
```

deben diferenciarse, pero sin saturar la pantalla.

---

# 86. Clima

Puede adoptar elementos visuales ligeramente más expresivos.

Aun así debe compartir:

```text
tipografía
radius
spacing
cards
navigation
```

con el resto del producto.

---

# 87. Agro IA

Puede utilizar Primary + Secondary para generar identidad tecnológica.

No utilizar gradientes excesivos o estética "AI neon".

Agro Intelligence es una aplicación productiva, no una demo de IA.

---

# 88. Prohibiciones visuales

Evitar:

```text
gradientes aleatorios
neón
glassmorphism excesivo
sombras pesadas
demasiados colores
demasiados bordes
demasiadas cards
texto diminuto
botones pequeños
íconos inconsistentes
layouts desktop adaptados
```

---

# 89. Regla de simplicidad

Cuando existan dos alternativas visuales equivalentes:

elegir la más simple.

---

# 90. Regla de jerarquía

El usuario debe poder identificar en pocos segundos:

```text
Dónde está
Qué información es importante
Qué puede hacer
```

---

# 91. Regla de consistencia

No resolver el mismo problema visual de tres maneras distintas.

Si existe un componente aprobado, reutilizarlo.

---

# 92. Regla de densidad

Mobile no significa colocar menos información arbitrariamente.

Significa priorizarla.

Utilizar:

```text
summary
→
details on demand
```

cuando sea apropiado.

---

# 93. Regla de implementación

Antes de crear un componente visual nuevo:

1. buscar componente existente;
2. verificar Design System;
3. verificar librería UI existente;
4. solamente después crear uno nuevo.

---

# 94. Validación visual

Toda modificación relevante debe seguir:

```text
IMPLEMENT
↓
RUN
↓
SCREENSHOT
↓
REVIEW
↓
FIX
```

según:

```text
UX02-Mobile-Visual-Quality.md
```

---

# 95. Fuente de verdad

Orden de prioridad para decisiones visuales:

```text
1. Requisitos funcionales de specs/features
2. UX01-Design-System.md
3. UX02-Mobile-Visual-Quality.md
4. Mockups aprobados
5. Componentes existentes coherentes
6. Buenas prácticas mobile
```

---

# 96. No alterar funcionalidad

Una mejora visual NO habilita al agente a:

- eliminar campos;
- cambiar flujos;
- eliminar validaciones;
- cambiar API;
- alterar permisos;
- simplificar lógica funcional.

Si un cambio UX requiere modificación funcional importante:

documentar y consultar.

---

# 97. Definition of Design Done

Una pantalla se considera visualmente correcta cuando:

- respeta palette;
- respeta spacing;
- respeta typography;
- respeta radius;
- presenta jerarquía clara;
- CTA principal es identificable;
- no existen overlaps;
- safe area funciona;
- keyboard funciona;
- scroll funciona;
- loading está tratado;
- error está tratado;
- empty state está tratado cuando aplica;
- touch targets son adecuados;
- fue inspeccionada visualmente.

---

# 98. Relación con UX02

```text
UX01
=
QUÉ aspecto debe tener la aplicación

UX02
=
CÓMO verificar que realmente lo tenga
```

Ambas specs deben utilizarse conjuntamente.

---

# 99. Regla final para agentes

No improvisar un nuevo lenguaje visual para cada pantalla.

Toda decisión de UI debe hacer que Agro Intelligence parezca:

```text
UNA ÚNICA APLICACIÓN
```

y no un conjunto de pantallas desarrolladas por diferentes personas.

---

# 100. Estado del Design System

Este documento es:

```text
ACTIVO
```

Toda feature UI nueva debe respetarlo.

Si una decisión visual permanente cambia, actualizar primero este documento o registrar la decisión en:

```text
specs/ui/decisiones.md
```

antes de propagarla al resto del proyecto.