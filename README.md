# 🤖 BIT Investigador · `bit-research-agent`

Un agente de IA **desde cero** en TypeScript: le das un tema, busca, lee fuentes y te entrega un informe en Markdown **con las fuentes citadas**.

Es el código del video **«Cómo crear tu propio agente de IA»** del canal [@CiscoJuanDev](https://youtube.com/@CiscoJuanDev).

```
🤖 BIT Investigador · modelo google/gemini-2.5-flash-lite
📌 Tema: historia del primer bug informático de 1947
── paso 1 · 🔧 buscar_web(...)
── paso 2 · 🔧 leer_pagina(...) ×2
── paso 3 · 🔧 guardar_resumen(...)  ¿Permitir? (s/n) s
── paso 4 · 🔧 terminar()  ✅
📊 4 pasos · 9284 in / 726 out · $0.0012 · 4.6 s
```

## ¿Qué es un agente?
Un **LLM dentro de un bucle** que puede usar **herramientas**, ve el resultado y decide el siguiente paso hasta terminar.

```
modelo → ¿pide herramientas? → tu código las ejecuta → resultado al modelo → repetir
```

## Requisitos
- Node.js 20.12 o superior
- Una API key de [OpenRouter](https://openrouter.ai) (te recomiendo una key con **límite de crédito**)

## Cómo probarlo
```bash
git clone https://github.com/cisco-juan/bit-research-agent
cd bit-research-agent
npm install
cp .env.example .env        # pon tu OPENROUTER_API_KEY
npm test                    # tests sin key ni IA
npm start "historia del primer bug informático de 1947"
```

| Comando | Qué hace |
|---|---|
| `npm start "tema"` | Agente con el bucle escrito a mano (`src/01-desde-cero`) |
| `npm run sdk "tema"` | El mismo agente con Vercel AI SDK (`src/02-ai-sdk`) |
| `npm run trampa` | Demo de inyección de prompts con una página trampa |
| `npm test` | Tests de herramientas y límites (Vitest) |

## Estructura
```
src/
├─ 01-desde-cero/agent.ts   # el bucle a mano (fetch + tool calling)
├─ 02-ai-sdk/agent.ts       # lo mismo con AI SDK (generateText + stopWhen)
├─ tools/                   # buscar_web, leer_pagina, guardar_resumen, terminar
├─ safety/                  # límites de pasos/$, URLs seguras, rutas encerradas
├─ prompts/system.md        # el prompt de sistema
└─ cli.ts
tests/ · evals/ · fixtures/pagina-trampa.html
```

## Herramientas
| Tool | Qué hace | Seguridad |
|---|---|---|
| `buscar_web` | Busca en Wikipedia (API pública, **gratis y sin key**) | Solo lectura |
| `leer_pagina` | Descarga una URL y extrae el texto (máx. 6000 caracteres) | Solo http(s), bloquea localhost/IPs privadas, timeout, contenido marcado como **no confiable** |
| `guardar_resumen` | Escribe el informe en `./output/` | **Te pide permiso (s/n)** y no puede salir de `./output` |
| `terminar` | Señal de fin | — |

¿Quieres buscar en toda la web? Cambia `src/tools/buscar.ts` por Brave Search o Tavily (tienen plan gratis con API key).

## Costes
Con `google/gemini-2.5-flash-lite` una investigación costó **≈ $0.001** (4 pasos, ~10K tokens) en nuestras pruebas. Puedes usar cualquier modelo con tool calling de OpenRouter cambiando `MODEL` en `.env` (por ejemplo `x-ai/grok-4.3`). Los modelos grandes cuestan más.

Límites por defecto: `MAX_STEPS=8` y `MAX_USD=0.50` por ejecución.

## Seguridad (OWASP Top 10 for LLM)
- **Inyección de prompts (LLM01):** lo que lee de la web va dentro de `<contenido_no_confiable>` y el prompt le dice que son datos, no órdenes.
- **Agencia excesiva (LLM06):** sin shell, solo lee y escribe en una carpeta, con confirmación humana.
- **Consumo sin límite (LLM10):** tope de pasos y de dólares + límite de crédito en la key.
- **API keys:** en `.env` (está en `.gitignore`). Nunca la pongas en el código ni en el prompt.

## Reto 🧩
Haz fork y añádele una herramienta nueva (¿el clima? ¿tu calendario? ¿GitHub?). Enséñamela en los comentarios del video.

## Licencia
[MIT](LICENSE) © Cisco Juan
