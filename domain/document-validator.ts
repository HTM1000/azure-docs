import type { AnalyzedDocument } from "@azure/ai-form-recognizer";
import { CONFIANCA_ALTA, CONFIANCA_MEDIA } from "@/config/constants";

function temCampo(doc: AnalyzedDocument, ...chaves: string[]): boolean {
  return chaves.some((k) => !!doc.fields[k]?.content);
}

export function documentoAberto(doc: AnalyzedDocument): boolean {
  const temNome = temCampo(doc, "FirstName", "LastName", "Name");
  const temDocNum = temCampo(doc, "DocumentNumber");
  const temData = temCampo(doc, "DateOfBirth");
  return temData && !temNome && !temDocNum;
}

export function statusDeConfianca(confianca: number): string {
  if (confianca >= CONFIANCA_ALTA) return "Alta confiança — Documento autêntico";
  if (confianca >= CONFIANCA_MEDIA) return "Confiança média — Revise os dados";
  return "Baixa confiança — Documento pode estar ilegível";
}
