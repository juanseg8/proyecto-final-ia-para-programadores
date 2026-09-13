# Kit SDD spec-anchored para Antigravity — Agro Intelligence Network

Mismo andamiaje que el kit de Claude Code, adaptado a los formatos de configuración de
Google Antigravity (AGY). Funciona en las tres variantes: AGY, AGY IDE y AGY CLI, con las
diferencias de soporte que se detallan más abajo.

## Instalación

```bash
cp -r kit-antigravity/. /ruta/a/tu/repo/
cd /ruta/a/tu/repo
```

Estructura resultante:

```
repo/
├── .agents/
│   ├── agents/                  # 8 agentes, cada uno en su carpeta con agent.md
│   │   ├── sdd-orquestador/agent.md
│   │   └── ...
│   ├── rules/                   # reglas always_on (proyecto + invariantes)
│   ├── skills/                  # 4 skills de conocimiento
│   ├── workflows/               # 3 workflows slash
│   └── mcp_config.json          # servidores MCP del workspace
├── specs/
│   ├── constitution.md          # 11 invariantes no negociables
│   ├── 000-index.md
│   ├── decisiones.md            # memoria del proyecto entre sesiones
│   ├── domain/glosario.md
│   ├── features/F05-benchmark-anonimo.md
│   └── _template/feature-spec.md
└── scripts/check-secrets.sh
```

Verificá que cargó todo preguntándole directamente al agente: *"¿qué reglas, workflows y
agentes están instalados?"*. Responde con la lista y las rutas. En AGY CLI, `/agents` muestra
los subagentes detectados.

## Uso

Los workflows se disparan con `/` en el chat:

```
/sdd-ciclo
/spec-nueva
/spec-verificar
```

Antigravity no interpola argumentos en los workflows, así que cada uno arranca pidiendo el ID
de la feature si no se lo diste. Está previsto en el texto de cada workflow.

## Los 8 agentes

| Agente | mainAgent | subagent | Rol |
|--------|-----------|----------|-----|
| `sdd-orquestador` | sí | sí | Coordina el ciclo y delega |
| `spec-autor` | no | sí | Escribe y actualiza specs |
| `test-autor` | no | sí | Tests antes de implementar |
| `backend-dev` | no | sí | NestJS + TypeORM |
| `mobile-dev` | no | sí | React Native + Expo |
| `spec-verificador` | no | sí | Detecta deriva spec ↔ código |
| `revisor-seguridad` | no | sí | Audita privacidad y seguridad |
| `evidencia-tp` | no | sí | Evidencia para la entrega |

El orquestador tiene `mainAgent: true` porque conduce la sesión; el resto solo se invocan
como subagentes. Todos usan `model: inherit` para heredar el modelo de la sesión.

## La diferencia que más importa

**Antigravity no tiene permisos por agente.** En Claude Code y en OpenCode, los tres agentes
read-only (`sdd-orquestador`, `spec-verificador`, `revisor-seguridad`) tienen la escritura
denegada por el harness: aunque el modelo intente editar, no puede. Acá esa restricción es
solo de comportamiento, escrita al final del prompt de cada agente.

En la práctica significa que un verificador puede "arreglar" lo que encuentra en vez de
reportarlo, que es exactamente lo que no querés. Dos mitigaciones posibles: revisar el diff
antes de aceptar cambios de esos tres agentes, o usar un hook `PreToolUse` en
`.agents/hooks.json` que bloquee las escrituras cuando el agente activo sea uno de ellos.
El kit no incluye el hook porque su esquema exacto conviene verificarlo contra tu versión,
pero es el lugar correcto para resolverlo si el problema aparece.

## Reglas, skills y workflows

**Reglas** (`.agents/rules/`) son las instrucciones siempre activas. El kit trae dos, ambas
`always_on`: `00-proyecto.md` con la metodología y las convenciones, y `01-invariantes.md` con
la tabla de los 11 invariantes. Las reglas consumen contexto en cada turno, por eso el detalle
completo vive en `specs/constitution.md` y la regla solo lista los IDs.

**Skills** (`.agents/skills/`) son conocimiento cargado bajo demanda: `invariantes`,
`benchmark-rules`, `agro-ia-contract` y `evidencia-tp`. Siguen el estándar de Agent Skills,
así que son idénticas a las del kit de Claude Code.

**Workflows** (`.agents/workflows/`) son prompts guardados que disparás con `/`. El nombre del
archivo define el comando.

Soporte por variante: AGY IDE tiene la mejor cobertura y te deja crear y ver reglas y
workflows desde `...` → Customization. AGY reconoce todo pero no tiene UI para editarlos. AGY
CLI aplica las reglas y los agentes, pero **no permite disparar workflows con `/`** — ahí vas
a tener que pedir el ciclo en lenguaje natural, mencionando el archivo del workflow.

## MCP

`.agents/mcp_config.json` usa un esquema más estricto que el resto de los clientes: la clave
es `mcpServers`, y los servidores remotos por HTTP usan **`serverUrl`**, no `url`. Es el error
más común al copiar una configuración de otro cliente.

Tres servidores incluidos: postgres, playwright y github. Reemplazá
`REEMPLAZAR_CON_DATABASE_URL` por tu cadena de conexión. Ojo con esto: hay reportes de que la
expansión de variables de entorno en la configuración global de MCP no funciona bien, lo que
obliga a hardcodear credenciales. Si es tu caso, asegurate de que `.agents/mcp_config.json`
esté en `.gitignore` y versioná en su lugar un `mcp_config.example.json` con placeholders.
`scripts/check-secrets.sh` está para detectar exactamente ese descuido.

También podés editar la configuración desde AGY IDE en Manage MCP Servers → View raw config,
que apunta a la configuración global en `~/.gemini/config/mcp_config.json`. El archivo de este
kit es el del workspace, que es el que conviene versionar.

## Otras diferencias con la versión de Claude Code

**No hay campo para precargar skills.** Cada agente termina con una línea indicando qué skills
leer antes de empezar.

**No hay memoria persistente por agente.** Se reemplaza por `specs/decisiones.md`, versionado.

**No hay aislamiento de contexto por comando.** Los workflows corren en la conversación
principal, así que el ciclo largo va a consumir contexto. Conviene ejecutar `/sdd-ciclo` una
tarea por vez y no la feature entera de corrido.

## Advertencias

Las mismas de siempre: actualizá la spec en el mismo cambio que el código, `PLAN.md` es
volátil y va en `.gitignore`, y no bajes `K_MIN` para ver el benchmark funcionando durante el
desarrollo — sembrá 15 establecimientos.

Y una específica de esta plataforma: como los agentes read-only no están realmente
restringidos, revisá el diff antes de aceptar cambios provenientes del verificador o del
revisor de seguridad.
