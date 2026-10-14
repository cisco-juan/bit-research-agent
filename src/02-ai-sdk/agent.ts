import fs from "node:fs";
import { generateText, tool, stepCountIs, hasToolCall } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { z } from "zod";
import { EJECUTAR } from "../tools/index.js";

// La misma lógica, pero el framework escribe el bucle por ti
const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });
const SYSTEM = fs.readFileSync(new URL("../prompts/system.md", import.meta.url), "utf8");

export async function agenteSDK(tema: string) {
  return generateText({
    model: openrouter(process.env.MODEL ?? "google/gemini-2.5-flash-lite"),
    system: SYSTEM,
    prompt: `Investiga: ${tema}`,
    temperature: 0.2,
    maxRetries: 2,
    tools: {
      buscar_web: tool({ description: "Busca artículos sobre un tema", inputSchema: z.object({ consulta: z.string() }), execute: EJECUTAR.buscar_web }),
      leer_pagina: tool({ description: "Lee el texto de una URL http(s)", inputSchema: z.object({ url: z.string().url() }), execute: EJECUTAR.leer_pagina }),
      guardar_resumen: tool({ description: "Guarda el informe en Markdown", inputSchema: z.object({ nombre: z.string(), markdown: z.string() }), execute: EJECUTAR.guardar_resumen }),
      terminar: tool({ description: "Fin", inputSchema: z.object({}), execute: EJECUTAR.terminar }),
    },
    stopWhen: [stepCountIs(Number(process.env.MAX_STEPS ?? 8)), hasToolCall("terminar")],
    onStepFinish: (s) => console.log(`── paso · ${s.toolCalls.map((t) => t.toolName).join(", ") || "texto"} · ${s.usage.totalTokens} tokens`),
  });
}
