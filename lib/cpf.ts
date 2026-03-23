export function parsearCpf(texto: string): string | undefined {
  return (
    texto.match(/\d{3}\.\d{3}\.\d{3}-\d{2}/)?.[0] ??
    texto.match(/\d{9}\/\d{2}/)?.[0]
  );
}
