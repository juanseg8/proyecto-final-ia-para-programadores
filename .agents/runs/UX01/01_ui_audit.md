# Auditoría de UI Existente (F01 y F02)

**Fecha:** 2026-09-15
**Fase:** UX01 Design Foundation

## 1. Inventario de Pantallas Actuales
- **Auth:** LoginScreen, RegisterScreen.
- **Main:** HomeScreen.
- **Establecimientos:** EstablishmentListScreen, EstablishmentDetailScreen, EstablishmentFormScreen, MapLocationPicker.

## 2. Hallazgos y Deuda Visual
- **Falta de sistema de diseño:** No hay una carpeta `theme/` ni constantes de colores o tipografías. Todo está hardcodeado o ausente.
- **Estilos Inline y StyleSheet locales:** Las pantallas usan `StyleSheet.create` localmente con estilos repetidos (ej. `container: { padding: 16 }` en FormScreen y DetailScreen). `RegisterScreen` usa estilos inline directamente (`style={{color: 'red', marginTop: 10}}`).
- **Inputs inconsistentes:** Los `TextInput` no tienen un componente base. Algunos tienen borde y padding manuales, otros están completamente crudos.
- **Botones crudos:** Se utiliza el componente genérico `<Button />` de React Native sin estilización corporativa ni control de diseño.
- **Falta de Spacing:** Los márgenes están definidos a ojo (`marginBottom: 12`, `marginBottom: 16`). No hay una escala de 8pt.
- **Manejo de Errores Pobre:** Los errores se muestran en texto rojo simple (`color: 'red'`) debajo de los botones o campos, sin iconografía ni contenedor claro.
- **Estados Empty y Loading:** No están visualmente diseñados.
- **Falta de Safe Areas:** Los componentes no respetan `SafeAreaView` sistemáticamente, lo cual es riesgoso en dispositivos modernos.

## 3. Estructura Objetivo Propuesta (Conceptual)
```
mobile/src/
├── theme/
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   ├── radius.ts
│   └── shadows.ts
│
└── components/
    ├── AppScreen.tsx       (Wrapper con SafeArea y backgroundColor base)
    ├── AppHeader.tsx       (Navegación / Título custom)
    ├── AppButton.tsx       (Primario, outline, destructive)
    ├── AppInput.tsx        (Input con label, placeholder, helper error)
    ├── AppCard.tsx         (Superficie blanca con sombra/borde)
    ├── FormField.tsx       (Wrapper para formularios)
    ├── EmptyState.tsx      (Texto + Icono centrados)
    ├── LoadingState.tsx    (Spinner con texto de espera)
    ├── ErrorState.tsx      (Bloque de alerta de error)
    └── ConfirmDialog.tsx   (Modal estandarizado)
```

## 4. Riesgos del Refactor
1. **Regresión funcional:** Al reemplazar `TextInput` crudos por `AppInput`, se podría romper el enlazado de estado o las simulaciones de tests con `fireEvent.changeText`.
2. **Caída de tests (RED):** RNTL (React Native Testing Library) busca componentes base. Si envolvemos cosas en Custom Components y cambiamos placeholders o textos, los tests E2E móviles van a fallar. Será crucial involucrar a `test-autor` primero para adaptar las queries (ej. testId) antes de cambiar los visuales.
3. **Pérdida de accesibilidad nativa:** El botón nativo `<Button>` incluye roles accesibles por defecto; si implementamos `<TouchableOpacity>` debemos restaurar esos roles (`accessibilityRole="button"`).

## 5. Próximos Pasos (Aprobación Humana)
La máquina se detiene aquí. Se requiere que humanos definan visualmente (mockups) cómo lucirán las pantallas clave:
- Login
- Home
- Mis establecimientos (Lista / Detail)
Una vez validado el diseño, se elegirá la librería de estilos o approach técnico y comenzará el ciclo SDD (test-autor -> mobile-dev).
