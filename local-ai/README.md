# Local AI - Ollama + Aider

El Night Build autonomo ya no usa OpenCode. OpenCode queda disponible solo para uso manual.
El runner nocturno usa Aider con Ollama porque Aider aplica cambios de archivos mediante formatos de edicion y no depende de tool calling del modelo.

## Instalar Aider una vez

~~~powershell
python -m pip install aider-install
aider-install
~~~

Verificar:

~~~powershell
aider --version
ollama list
~~~

## Night Build

~~~powershell
powershell -ExecutionPolicy Bypass -File scripts/night-build.ps1 -StartFrom 03
~~~

El runner usa ollama_chat/agro-coder, formato whole-file, fallback architect/editor-whole, compila despues de cada task, repara hasta dos veces, hace commits locales y nunca hace push.

No crear otro repositorio: backend/, mobile/, specs/ y night-tasks/ de este repo siguen siendo la fuente de verdad.
