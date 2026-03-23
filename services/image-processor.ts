import sharp from "sharp";

export function isPdf(buffer: Buffer): boolean {
  return buffer.slice(0, 4).toString() === "%PDF";
}

export async function normalizarExif(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer).rotate().toBuffer();
}

export async function rotacionar(buffer: Buffer, graus: number): Promise<Buffer> {
  return sharp(buffer).rotate(graus).toBuffer();
}
