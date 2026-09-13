---
name: invariantes
description: Invariantes no negociables de Agro Intelligence Network. Consultar antes de tocar benchmark, módulo de IA, autorización, alertas o privacidad.
---

# Invariantes del sistema

La fuente completa está en `specs/constitution.md`. Leé ese archivo antes de implementar.
Este resumen es para reconocer rápido si la tarea en curso toca alguno.

| ID | Invariante | Toca |
|----|-----------|------|
| INV-01 | Ningún número visible al usuario proviene del LLM | Módulo IA, indicadores |
| INV-02 | Benchmark no se publica con peer group < 10 | Benchmark |
| INV-03 | Benchmark nunca expone datos individuales de terceros | Benchmark, DTOs |
| INV-04 | Participación en benchmark es opt-in y reversible | Benchmark, Farm |
| INV-05 | Todo endpoint con ID valida ownership | Todos los controllers |
| INV-06 | El LLM no accede a la base de datos | Módulo IA |
| INV-07 | Si el LLM falla, el producto sigue funcionando | Módulo IA, app móvil |
| INV-08 | Toda interacción con el LLM se persiste | Módulo IA |
| INV-09 | Los umbrales son configuración, no código | Alertas, benchmark |
| INV-10 | Ninguna credencial sale hacia el cliente | App móvil, clima, IA |
| INV-11 | La IA no diagnostica | Módulo IA, prompts |

## Cómo aplicarlos

Un invariante sin test que lo pruebe **no está cumplido**. El test se escribe antes que la
implementación.

Cuando una implementación limpia parece requerir violar un invariante, esa es la señal de
que la spec está mal, no el invariante. Frená y consultá.

Los dos errores más caros de este proyecto, por orden:

1. **Relajar k=10 durante el desarrollo** para que el benchmark "muestre algo" con pocos
   datos de prueba. Se olvida de revertir y llega a producción. Si necesitás ver el
   benchmark funcionando, sembrá 15 establecimientos, no bajes k.
2. **Dejar que el LLM calcule "algo chico"** — un porcentaje, una diferencia, un promedio —
   porque el backend todavía no lo expone. El día que se equivoca, el productor toma una
   decisión productiva con un número inventado.
