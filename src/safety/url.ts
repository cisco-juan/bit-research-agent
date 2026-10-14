// Solo http(s) y nada de redes privadas: evita que el agente lea tu router o tu localhost (SSRF)
export function urlSegura(raw: string): URL {
  const u = new URL(raw);
  if (!["http:", "https:"].includes(u.protocol)) throw new Error("Solo se permiten URLs http(s)");
  const h = u.hostname;
  if (h === "localhost" || h.endsWith(".local") || /^(127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|0\.)/.test(h) || h === "[::1]")
    throw new Error("Dirección privada bloqueada");
  return u;
}
