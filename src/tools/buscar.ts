// buscar_web: usa la API pública de Wikipedia (gratis, sin API key)
export async function buscarWeb(consulta: string, idioma = "es") {
  const url = `https://${idioma}.wikipedia.org/w/api.php?action=query&list=search&format=json&srlimit=5&srsearch=${encodeURIComponent(consulta)}`;
  const r = await fetch(url, { headers: { "User-Agent": "bit-research-agent/1.0 (tutorial)" }, signal: AbortSignal.timeout(10_000) });
  if (!r.ok) throw new Error(`Búsqueda falló: HTTP ${r.status}`);
  const d: any = await r.json();
  return d.query.search.map((x: any) => ({
    titulo: x.title,
    url: `https://${idioma}.wikipedia.org/wiki/${encodeURIComponent(x.title.replace(/ /g, "_"))}`,
    extracto: x.snippet.replace(/<[^>]+>/g, ""),
  }));
}
