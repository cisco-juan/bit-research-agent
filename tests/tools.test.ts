import { describe, it, expect } from "vitest";
import fs from "node:fs";
import { urlSegura } from "../src/safety/url.js";
import { rutaSegura, OUTPUT_DIR } from "../src/safety/paths.js";
import { htmlATexto, envolver } from "../src/tools/leer.js";
import { Presupuesto } from "../src/safety/limits.js";
import { guardarResumen } from "../src/tools/guardar.js";

describe("seguridad", () => {
  it("bloquea localhost y redes privadas", () => {
    expect(() => urlSegura("http://localhost:3000")).toThrow();
    expect(() => urlSegura("http://192.168.1.1")).toThrow();
    expect(() => urlSegura("file:///etc/passwd")).toThrow();
    expect(urlSegura("https://es.wikipedia.org/wiki/Bug").hostname).toBe("es.wikipedia.org");
  });
  it("encierra la ruta en ./output", () => {
    expect(rutaSegura("../../.bashrc").startsWith(OUTPUT_DIR)).toBe(true);
  });
  it("la página trampa llega marcada como no confiable", () => {
    const t = envolver("x", htmlATexto(fs.readFileSync("fixtures/pagina-trampa.html", "utf8")));
    expect(t).toContain("<contenido_no_confiable");
    expect(t).toContain("IGNORA TODAS");
  });
  it("no guarda si el humano dice que no", async () => {
    expect(await guardarResumen("x", "# hola", async () => false)).toContain("NO autorizó");
  });
});
describe("presupuesto", () => {
  it("corta por pasos y por dólares", () => {
    const p = new Presupuesto(2, 0.01);
    p.registrar({ cost: 0.001 }); expect(p.agotado()).toBeNull();
    p.registrar({ cost: 0.001 }); expect(p.agotado()).toContain("pasos");
    const q = new Presupuesto(9, 0.01); q.registrar({ cost: 0.02 }); expect(q.agotado()).toContain("$");
  });
});
