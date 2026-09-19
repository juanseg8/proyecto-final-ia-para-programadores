# Task 03 - GeoRef + SearchableSelect

## Leer
- specs/features/F02-Establecimiento.md
- specs/ui/UX01-Design-System.md
- mobile/src/services/georefService.ts
- mobile/src/screens/EstablishmentFormScreen.tsx
- mobile/src/components/index.ts
- mobile/src/components/FormField.tsx
- mobile/src/components/AppInput.tsx
- mobile/src/theme/theme.ts

## Crear
- mobile/src/components/SearchableSelect.tsx

## Implementar
- selector reusable y searchable con Modal/React Native primitives;
- estados selected, loading, error, retry y disabled;
- localidad deshabilitada hasta elegir provincia;
- cambiar provincia limpia localidad;
- integrar ambos selectores en EstablishmentFormScreen;
- payload canónico sigue enviando province:string y locality:string;
- sin fallback silencioso a input libre;
- eliminar los modales/selectores inline anteriores que queden reemplazados;
- actualizar mobile/src/components/index.ts.

No tests. No fake data. No cambiar backend.
