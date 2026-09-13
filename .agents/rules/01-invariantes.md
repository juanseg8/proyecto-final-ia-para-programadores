---
trigger: always_on
description: Invariantes no negociables. Se aplican a todo cambio de código del proyecto.
---

# Invariantes no negociables

La fuente completa está en `specs/constitution.md`, con el test que prueba cada uno. Leé ese
archivo antes de implementar cualquier cosa que toque benchmark, IA, autorización o alertas.

| ID | Invariante |
|----|-----------|
| INV-01 | Ningún número visible al usuario proviene del LLM |
| INV-02 | Un benchmark no se publica con peer group menor a 10 |
| INV-03 | El benchmark nunca expone datos individuales de terceros |
| INV-04 | La participación en el benchmark es opt-in y reversible |
| INV-05 | Todo endpoint con identificador valida ownership |
| INV-06 | El LLM no accede a la base de datos |
| INV-07 | Si el LLM falla, el producto sigue funcionando |
| INV-08 | Toda interacción con el LLM se persiste |
| INV-09 | Los umbrales son configuración, no código |
| INV-10 | Ninguna credencial sale hacia el cliente |
| INV-11 | La IA no diagnostica |

Un invariante sin test que lo pruebe no está cumplido: está declarado. El test se escribe
antes que la implementación.

Cuando una implementación limpia parece requerir violar un invariante, la spec está mal, no
el invariante. Frená y consultá antes de implementar la excepción.
