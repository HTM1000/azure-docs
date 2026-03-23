import {
  DocumentAnalysisClient,
  AzureKeyCredential,
} from "@azure/ai-form-recognizer";
import type { ResultadoAnalise } from "@/types/interno";

export function criarCliente(endpoint: string, apiKey: string): DocumentAnalysisClient {
  return new DocumentAnalysisClient(endpoint, new AzureKeyCredential(apiKey));
}

export async function analisarDocumento(
  client: DocumentAnalysisClient,
  buffer: Buffer
): Promise<ResultadoAnalise | null> {
  const poller = await client.beginAnalyzeDocument("prebuilt-idDocument", buffer);
  const result = await poller.pollUntilDone();
  const doc = result.documents?.[0] ?? null;
  if (!doc) return null;
  return { doc, angle: result.pages?.[0]?.angle ?? 0 };
}

export async function analisarOcr(
  client: DocumentAnalysisClient,
  buffer: Buffer
): Promise<string[]> {
  const poller = await client.beginAnalyzeDocument("prebuilt-read", buffer);
  const result = await poller.pollUntilDone();
  return (result.pages ?? []).flatMap((p) => (p.lines ?? []).map((l) => l.content));
}
