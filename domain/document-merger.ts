import type { AnalyzedDocument } from "@azure/ai-form-recognizer";
import type { DocumentoResultado } from "@/types/documento";
import { statusDeConfianca } from "./document-validator";

export function extrairCampo(
  doc: AnalyzedDocument,
  ...chaves: string[]
): string | undefined {
  for (const chave of chaves) {
    const field = doc.fields[chave];
    if (field?.content) return field.content;
  }
  return undefined;
}

export function extrairCpfDoCampos(
  frente: AnalyzedDocument,
  verso?: AnalyzedDocument | null
): string | undefined {
  const CPF_FORMATADO = /\d{3}\.\d{3}\.\d{3}-\d{2}/;
  const todos = [frente, ...(verso ? [verso] : [])];

  // 1. CPF formatado em qualquer campo
  for (const doc of todos) {
    for (const field of Object.values(doc.fields)) {
      if (field?.content && CPF_FORMATADO.test(field.content)) return field.content;
    }
  }

  // 2. 11 dígitos em campos conhecidos (RG tem 7-9, CNH tem 11 mas é nº registro)
  for (const doc of todos) {
    for (const chave of ["PersonalNumber", "TaxId"]) {
      const val = doc.fields[chave]?.content;
      if (val && val.replace(/\D/g, "").length === 11) return val;
    }
  }

  return undefined;
}

export function mesclarResultados(
  frente: AnalyzedDocument,
  verso?: AnalyzedDocument | null
): DocumentoResultado {
  const pick = (chave: string) =>
    extrairCampo(frente, chave) ??
    (verso ? extrairCampo(verso, chave) : undefined);

  const firstName =
    extrairCampo(frente, "FirstName") ??
    (verso ? extrairCampo(verso, "FirstName") : undefined) ??
    "";
  const lastName =
    extrairCampo(frente, "LastName") ??
    (verso ? extrairCampo(verso, "LastName") : undefined) ??
    "";

  const nomeCompleto =
    [firstName, lastName].filter(Boolean).join(" ") ||
    extrairCampo(frente, "Name") ||
    (verso ? extrairCampo(verso, "Name") : undefined);

  const melhorConfianca = verso
    ? Math.max(frente.confidence, verso.confidence)
    : frente.confidence;

  return {
    sucesso: true,
    nomeCompleto,
    dataNascimento: pick("DateOfBirth"),
    numeroCpf: extrairCpfDoCampos(frente, verso),
    numeroDocumento: pick("DocumentNumber"),
    sexo: pick("Sex"),
    dataEmissao: pick("DateOfIssue"),
    dataVencimento: pick("DateOfExpiration"),
    nacionalidade: pick("Nationality"),
    paisEmissor: pick("CountryRegion"),
    tipoDocumento: frente.docType,
    confianca: melhorConfianca,
    statusVerificacao: statusDeConfianca(melhorConfianca),
  };
}
