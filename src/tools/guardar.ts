import path from "node:path";
import fs from "node:fs/promises";
import readline from "node:readline/promises";
import { OUTPUT_DIR, rutaSegura } from "../safety/paths.js";
// guardar_resumen: humano en el bucle. Pregunta (s/n) antes de escribir.
export async function guardarResumen(nombre: string, markdown: string, confirmar = preguntar) {
  const ruta = rutaSegura(nombre);
  if (!(await confirmar(`\n🤖 BIT quiere guardar ${ruta.replace(process.cwd() + "/", "")} (${markdown.length} caracteres). ¿Permitir? (s/n) `)))
    return "El usuario NO autorizó guardar el archivo.";
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.writeFile(ruta, markdown, "utf8");
  return `Guardado en ${path.relative(process.cwd(), ruta)}`;
}
async function preguntar(q: string) {
  if (process.env.AUTO_YES === "1") { process.stdout.write(q + "s (AUTO_YES)\n"); return true; }
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const a = await rl.question(q); rl.close();
  return a.trim().toLowerCase().startsWith("s");
}
