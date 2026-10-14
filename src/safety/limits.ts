// Presupuesto por ejecución: pasos y dólares
export class Presupuesto {
  pasos = 0; usd = 0; tokensIn = 0; tokensOut = 0;
  constructor(public maxPasos = Number(process.env.MAX_STEPS ?? 8), public maxUsd = Number(process.env.MAX_USD ?? 0.5)) {}
  registrar(uso: { prompt_tokens?: number; completion_tokens?: number; cost?: number } = {}) {
    this.pasos++; this.tokensIn += uso.prompt_tokens ?? 0; this.tokensOut += uso.completion_tokens ?? 0; this.usd += uso.cost ?? 0;
  }
  agotado(): string | null {
    if (this.pasos >= this.maxPasos) return `límite de ${this.maxPasos} pasos`;
    if (this.usd >= this.maxUsd) return `límite de $${this.maxUsd}`;
    return null;
  }
}
