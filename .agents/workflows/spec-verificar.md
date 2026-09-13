---
description: Verifica la implementación contra la spec
---

# Verificación contra la spec

Feature: **{ID de feature}**

Verificá y reportá. No corrijas nada.

1. Leé `specs/constitution.md` y `specs/features/{ID de feature}-*.md`.
2. Leé la implementación correspondiente.
3. Requisito por requisito: CUMPLE / PARCIAL / NO CUMPLE / NO VERIFICABLE, con archivo y línea.
4. Para cada invariante declarado, buscá y ejecutá el test que lo prueba. Sin test que lo
   cubra, el invariante se reporta como NO CUMPLE aunque el código parezca correcto.
5. Buscá deriva inversa: comportamiento implementado que la spec no describe. Es lo que
   nadie mira y lo que desactualiza la spec en silencio.

Cerrá el reporte con una recomendación clara: la feature está lista, necesita corregir el
código, o necesita actualizar la spec.

---

**Nota de ejecución.** Antigravity no interpola argumentos en los workflows: si al invocar `/spec-verificar` no se indicó el ID de la feature, pedilo antes de empezar. Delegá el trabajo en el subagente `spec-verificador`.
