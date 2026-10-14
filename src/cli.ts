import fs from "node:fs";
if (fs.existsSync(".env")) process.loadEnvFile(".env"); // carga tu key sin imprimirla
import { agente } from "./01-desde-cero/agent.js";
import { agenteSDK } from "./02-ai-sdk/agent.js";

const args = process.argv.slice(2);
const sdk = args[0] === "--sdk";
const tema = (sdk ? args.slice(1) : args).join(" ");
if (!tema) { console.error('Uso: npm start "tu tema"   (o npm run sdk "tu tema")'); process.exit(1); }
if (!process.env.OPENROUTER_API_KEY) { console.error("Falta OPENROUTER_API_KEY (copia .env.example a .env)"); process.exit(1); }

console.log(`🤖 BIT Investigador · modelo ${process.env.MODEL ?? "google/gemini-2.5-flash-lite"}\n📌 Tema: ${tema}`);
const t0 = Date.now();
if (sdk) {
  const r = await agenteSDK(tema);
  console.log(`\n✅ ${r.steps.length} pasos · ${r.totalUsage.totalTokens} tokens · ${((Date.now() - t0) / 1000).toFixed(1)} s`);
} else {
  const p = await agente(tema);
  console.log(`\n📊 ${p.pasos} pasos · ${p.tokensIn} in / ${p.tokensOut} out · $${p.usd.toFixed(4)} · ${((Date.now() - t0) / 1000).toFixed(1)} s`);
}
