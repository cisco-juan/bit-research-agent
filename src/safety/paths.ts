import path from "node:path";
// Encierra la escritura en ./output: nada de ../../etc/passwd
export const OUTPUT_DIR = path.resolve("output");
export function rutaSegura(nombre: string): string {
  const limpio = nombre.toLowerCase().replace(/[^a-z0-9áéíóúñü_-]+/gi, "-").slice(0, 60) + ".md";
  const full = path.resolve(OUTPUT_DIR, limpio);
  if (!full.startsWith(OUTPUT_DIR + path.sep)) throw new Error("Ruta fuera de ./output");
  return full;
}
