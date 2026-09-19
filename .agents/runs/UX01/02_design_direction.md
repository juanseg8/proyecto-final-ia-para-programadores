# Iniciativa UX01 - Actualización de Dirección Visual

**Fecha:** 2026-09-15
**Fase:** UX01 Design Foundation

## 1. Dirección Visual Aprobada: "Agro Intelligence — AgTech Premium"
- Se estableció el tono visual: `agro + tecnología + simplicidad + datos + profesionalismo`.
- Se descartó explícitamente el uso de Material Design genérico, estética Fintech, ruralismo clásico y abusos de gradients/shadows.

## 2. Decisión Arquitectónica (Styles)
- Se bloqueó formalmente la inclusión de librerías visuales estructurales (como NativeWind, Paper, NativeBase, Tamagui).
- La arquitectura UI se construirá 100% in-house a base de `React Native + StyleSheet + Design Tokens propios` para garantizar identidad de marca aislada.

## 3. Tokens Aprobados
- **Color:** Paleta preliminar registrada (con `forest`, `primaryLight`, `leaf` como Brand, y grises controlados para backgrounds y borders).
- **Tipografía:** Escala conceptual trazada (Display hasta Caption y Metric bold), sin importar tipografías externas temporales.
- **Espaciado y Radius:** Escalas definidas `[4, 8, 12, ...]` y Radios controlados `[10, 12, 16, 20]`.
- **Inventario Funcional:** 13 componentes estructurales identificados (AppScreen, AppCard, EmptyState, MetricCard, etc).

## 4. Estrategia de Implementación UI
Se usará una ventana de 3 pantallas base para definir el "Look & Feel":
1. Login
2. Home
3. Mis establecimientos
Una vez el humano valide sus mockups, el lenguaje se propagará al resto de la App. 
Se recalcó la prohibición de tocar lógica de negocio y alterar los invariantes funcionales.

**Estado Actual:** Pausado. Esperando validación externa humana de mockups antes de arrancar SDD transversal.
