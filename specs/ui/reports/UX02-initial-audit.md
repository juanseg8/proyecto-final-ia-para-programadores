# Auditoría Inicial UX02 - Agro Intelligence Mobile

## Pantallas Encontradas
1. LoginScreen
2. HomeScreen
3. AgroAiScreen
4. CreateAnimalScreen
5. CreateHerdScreen
6. EstablishmentDetailScreen
7. EstablishmentFormScreen
8. EstablishmentListScreen
9. HerdDetailScreen
10. LivestockScreen
11. RegisterLivestockEventScreen
12. RegisterScreen
13. RegisterWeighingScreen

## Problemas Globales
- **Card Hell & Nested Borders (P1)**: Existen componentes (ej. en LoginScreen) que están envueltos innecesariamente dentro de múltiples contenedores y cajas que rompen la limpieza visual.
- **Botones y Touch Targets (P1)**: Los botones principales están utilizando `border-radius` cuadrados en lugar del `12px` definido en UX01, y colores oscuros no estandarizados a `primary.600`.
- **Backgrounds Absolutos (P1)**: Elementos de layout están utilizando dimensiones absolutas o ocupan el 100% tocando los bordes (ej. el recuadro inferior en la pantalla de login) de manera inconsistente.
- **Tipografía y Colores (P2)**: Los textos secundarios y *placeholders* en los inputs requieren ajuste para alinearse con `neutral.500` / `neutral.600` de la paleta.

## Problemas por Pantalla: LoginScreen
- **[P1] Jerarquía Visual y Layout:** El contenedor principal inferior verde es muy pesado visualmente y distrae la atención de los elementos accionables.
- **[P1] Inputs:** El contenedor de inputs posee un `border` excesivo que los engloba, creando el efecto "Card dentro de Card". Deben ser inputs individuales con su propio `border-radius: 12` y separaciones con `spacing.md` o `spacing.lg`.
- **[P0] Botón Primario:** El botón "Iniciar sesión" es cuadrado, con color desfasado (`#285E44` en lugar de `#2F7551` o similar) y falta de padding horizontal.
- **[P3] Tipografía:** Falta peso "SemiBold" en el título "Bienvenido nuevamente".

## Prioridad de Correcciones
1. **P0/P1**: Estandarizar `theme.ts` (Tokens, Colors, Spacing).
2. **P0/P1**: Refactorizar componentes reusables base (`AppInput`, `AppButton`, `AppCard`) según las normas de UX01.
3. **P0/P1**: Rediseñar la pantalla de Autenticación (`LoginScreen` / `RegisterScreen`).
4. **P1/P2**: Iterar por pantallas principales: `HomeScreen`, `EstablishmentListScreen`.
5. **P1/P2**: Iterar sobre pantallas secundarias y modales.
