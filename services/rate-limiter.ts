import { FACE_LIMIT_MIN, FACE_LIMIT_MONTH } from "@/config/constants";

// Singleton de módulo — persiste entre requests no mesmo processo Node.js
const timestamps: number[] = [];
let monthKey = "";
let monthCount = 0;

function sincronizarMes(): void {
  const mes = new Date().toISOString().slice(0, 7);
  if (mes !== monthKey) {
    monthKey = mes;
    monthCount = 0;
  }
}

export function canConsume(n: number): boolean {
  const now = Date.now();
  const recentes = timestamps.filter((t) => now - t < 60_000);
  timestamps.length = 0;
  timestamps.push(...recentes);
  sincronizarMes();
  return timestamps.length + n <= FACE_LIMIT_MIN && monthCount + n <= FACE_LIMIT_MONTH;
}

export function record(n: number): void {
  const now = Date.now();
  for (let i = 0; i < n; i++) timestamps.push(now);
  monthCount += n;
}
