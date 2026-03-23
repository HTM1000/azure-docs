import type { AnalyzedDocument } from "@azure/ai-form-recognizer";
import type { AzureDocumentConfig, AzureFaceConfig } from "@/config/azure";

export interface CamposOcr {
  nome?: string;
  dataNascimento?: string;
  cpf?: string;
  numeroDocumento?: string;
}

export interface ResultadoAnalise {
  doc: AnalyzedDocument;
  angle: number;
}

export interface AnaliseInput {
  frenteRaw: Buffer;
  versoRaw?: Buffer;
  selfieRaw?: Buffer;
  docConfig: AzureDocumentConfig;
  faceConfig?: AzureFaceConfig;
}
