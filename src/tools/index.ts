import { buscarWeb } from "./buscar.js";
import { leerPagina } from "./leer.js";
import { guardarResumen } from "./guardar.js";
// Lo que ve el modelo: nombre, descripción y JSON Schema
export const TOOLS = [
  { type: "function", function: { name: "buscar_web", description: "Busca artículos sobre un tema. Devuelve título, url y extracto.", parameters: { type: "object", properties: { consulta: { type: "string" } }, required: ["consulta"] } } },
  { type: "function", function: { name: "leer_pagina", description: "Lee el texto de una URL http(s).", parameters: { type: "object", properties: { url: { type: "string" } }, required: ["url"] } } },
  { type: "function", function: { name: "guardar_resumen", description: "Guarda el informe final en Markdown (pide permiso al usuario).", parameters: { type: "object", properties: { nombre: { type: "string" }, markdown: { type: "string" } }, required: ["nombre", "markdown"] } } },
  { type: "function", function: { name: "terminar", description: "Llama a esto cuando el informe esté guardado.", parameters: { type: "object", properties: {} } } },
];
// Lo que ejecuta TU código
export const EJECUTAR: Record<string, (a: any) => Promise<unknown>> = {
  buscar_web: (a) => buscarWeb(String(a.consulta)),
  leer_pagina: (a) => leerPagina(String(a.url)),
  guardar_resumen: (a) => guardarResumen(String(a.nombre), String(a.markdown)),
  terminar: async () => "ok",
};
