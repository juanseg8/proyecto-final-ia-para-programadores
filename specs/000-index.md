# Índice de especificaciones

| ID | Feature | Estado | Invariantes que toca |
|----|---------|--------|----------------------|
| F01 | Autenticación y control de acceso | **implementada** | INV-05 |
| F02 | Establecimiento y ubicación | pendiente | INV-04, INV-05 |
| F03 | Rodeos, animales, pesajes y eventos | pendiente | INV-05 |
| F04 | Motor de indicadores | pendiente | INV-01, INV-09 |
| F05 | Benchmark anónimo | **especificada** | INV-02, INV-03, INV-04, INV-05, INV-09 |
| F06 | Motor de alertas | pendiente | INV-09 |
| F07 | Contexto climático | pendiente | INV-10 |
| F08 | Asistente Agro IA | pendiente | INV-01, INV-06, INV-07, INV-08, INV-11 |
| F09 | Dashboard móvil | pendiente | INV-01, INV-07 |

Estados: `pendiente` → `especificada` → `en implementación` → `implementada` → `verificada`.

Una feature pasa a `verificada` solo cuando `spec-verificador` reporta CUMPLE en todos sus
requisitos y todos sus invariantes tienen test que pasa.

## Orden sugerido

F01 → F02 → F03 → F04 → F05 → F06 → F07 → F08 → F09

F05 depende de F04 (necesita indicadores calculados) y F02 (necesita región y escala).
F08 depende de F04, F05, F06 y F07: el asistente no puede explicar lo que todavía no existe.
