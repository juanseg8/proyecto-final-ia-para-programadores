# Local AI — Ollama + OpenCode

## Prerequisitos
- Ollama instalado y corriendo
- Node/npm
- OpenCode instalado

## Modelo del proyecto
Desde la raíz:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/setup-local-ai.ps1
```

El setup descarga Devstral Small 2 24B y crea `ollama/agro-coder` con contexto 16K.

Verificar:

```powershell
ollama ps
opencode models
```

## Night Build
Usar la rama dedicada `night-build-mvp` y un working tree limpio.

```powershell
powershell -ExecutionPolicy Bypass -File scripts/night-build.ps1
```

Para reanudar desde una tarea concreta:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/night-build.ps1 -StartFrom 03
```

El runner verifica primero que OpenCode pueda escribir, ejecuta cada task con el agente `build`, compila y crea commits locales. Nunca hace push.
