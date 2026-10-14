import fs from "node:fs";
import { TOOLS, EJECUTAR } from "../tools/index.js";
import { Presupuesto } from "../safety/limits.js";

const SYSTEM = fs.readFileSync(new URL("../prompts/system.md", import.meta.url), "utf8");
type Msg = { role: string; content: string | null; tool_calls?: any[]; tool_call_id?: string };

async function llamarModelo(messages: Msg[]) {
  const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: process.env.MODEL ?? "google/gemini-2.5-flash-lite", messages, tools: TOOLS, temperature: 0.2, max_tokens: 1500, usage: { include: true } }),
  });
  if (!r.ok) throw new Error(`OpenRouter ${r.status}: ${await r.text()}`);
  return r.json() as Promise<any>;
}

export async function agente(tema: string, log = console.log) {
  const messages: Msg[] = [{ role: "system", content: SYSTEM }, { role: "user", content: `Investiga: ${tema}` }];
  const p = new Presupuesto();
  // 🔁 EL BUCLE: modelo → ¿herramientas? → ejecutar → resultado → repetir
  while (true) {
    const corte = p.agotado();
    if (corte) { log(`⛔ Paro: ${corte}`); break; }
    const res = await llamarModelo(messages);
    p.registrar(res.usage);
    const msg = res.choices[0].message;
    messages.push({ role: "assistant", content: msg.content ?? "", tool_calls: msg.tool_calls });
    log(`\n── paso ${p.pasos} · ${p.tokensIn + p.tokensOut} tokens · $${p.usd.toFixed(5)}`);
    if (!msg.tool_calls?.length) { log(`💬 ${msg.content}`); break; }       // respuesta final
    let fin = false;
    for (const tc of msg.tool_calls) {
      const args = JSON.parse(tc.function.arguments || "{}");
      log(`🔧 ${tc.function.name}(${JSON.stringify(args).slice(0, 90)})`);
      let out: unknown;
      try { out = await EJECUTAR[tc.function.name](args); }
      catch (e: any) { out = `ERROR: ${e.message}`; }                     // el error vuelve al modelo
      log(`   ↳ ${JSON.stringify(out).slice(0, 110)}`);
      messages.push({ role: "tool", tool_call_id: tc.id, content: typeof out === "string" ? out : JSON.stringify(out) });
      if (tc.function.name === "terminar") fin = true;
    }
    if (fin) { log("✅ BIT terminó"); break; }
  }
  return p;
}
