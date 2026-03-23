import type { DocumentAnalysisClient } from "@azure/ai-form-recognizer";
import type { DocumentoResultado } from "@/types/documento";
import type { AnaliseInput, ResultadoAnalise, CamposOcr } from "@/types/interno";
import { CONFIANCA_ALTA, CONFIANCA_MEDIA, ROTACOES_TENTATIVA } from "@/config/constants";
import { criarCliente, analisarDocumento, analisarOcr } from "./document-ai";
import { isPdf, normalizarExif, rotacionar } from "./image-processor";
import { compararFaces } from "./face-comparator";
import { documentoAberto, } from "@/domain/document-validator";
import { mesclarResultados } from "@/domain/document-merger";
import { parsearCamposDeLinhas } from "@/lib/ocr-parser";

// ---------------------------------------------------------------------------
// Erros de domínio tipados — capturados pelo route handler
// ---------------------------------------------------------------------------

export class DocumentoNaoDetectadoError extends Error {
  constructor() {
    super("Nenhum documento de identidade detectado na frente. Tente com uma foto mais nítida.");
    this.name = "DocumentoNaoDetectadoError";
  }
}

export class DocumentoAbertoError extends Error {
  constructor() {
    super(
      "Parece que o documento está aberto na foto (frente e verso juntos). Fotografe apenas a frente ou apenas o verso separadamente."
    );
    this.name = "DocumentoAbertoError";
  }
}

export class ExtracacaoFalhouError extends Error {
  constructor() {
    super(
      "Não foi possível extrair dados do documento. Tente uma foto mais nítida ou envie como imagem (JPG/PNG)."
    );
    this.name = "ExtracacaoFalhouError";
  }
}

// ---------------------------------------------------------------------------
// Helpers privados
// ---------------------------------------------------------------------------

async function analisarComRotacao(
  client: DocumentAnalysisClient,
  rawBuffer: Buffer
): Promise<{ buffer: Buffer; analise: ResultadoAnalise | null }> {
  if (isPdf(rawBuffer)) {
    const analise = await analisarDocumento(client, rawBuffer);
    return { buffer: rawBuffer, analise };
  }

  // Normaliza EXIF uma vez — todos os testes de rotação partem desta base limpa
  const base = await normalizarExif(rawBuffer);
  let melhorBuffer = base;
  let melhorAnalise = await analisarDocumento(client, base);

  if (melhorAnalise && melhorAnalise.doc.confidence >= CONFIANCA_MEDIA) {
    return { buffer: melhorBuffer, analise: melhorAnalise };
  }

  for (const graus of ROTACOES_TENTATIVA) {
    const rotBuffer = await rotacionar(base, graus);
    const tentativa = await analisarDocumento(client, rotBuffer);

    if (
      tentativa &&
      (!melhorAnalise || tentativa.doc.confidence > melhorAnalise.doc.confidence)
    ) {
      melhorBuffer = rotBuffer;
      melhorAnalise = tentativa;
    }

    if (melhorAnalise && melhorAnalise.doc.confidence >= CONFIANCA_ALTA) break;
  }

  return { buffer: melhorBuffer, analise: melhorAnalise };
}

async function tentarOcr(
  client: DocumentAnalysisClient,
  buffer: Buffer
): Promise<CamposOcr> {
  const linhas = await analisarOcr(client, buffer);
  console.log("OCR linhas:", linhas);
  const campos = parsearCamposDeLinhas(linhas);
  console.log("OCR campos:", campos);
  return campos;
}

async function aplicarOcrFallback(
  client: DocumentAnalysisClient,
  resultado: DocumentoResultado,
  buffers: Buffer[]
): Promise<void> {
  for (const buffer of buffers) {
    try {
      const ocr = await tentarOcr(client, buffer);

      // Se orientação original não achou nada, tenta invertido 180° (imagens apenas)
      if (!ocr.nome && !ocr.dataNascimento && !isPdf(buffer)) {
        const invertido = await rotacionar(buffer, 180);
        const ocrInv = await tentarOcr(client, invertido);
        if (!ocr.nome && ocrInv.nome) ocr.nome = ocrInv.nome;
        if (!ocr.dataNascimento && ocrInv.dataNascimento) ocr.dataNascimento = ocrInv.dataNascimento;
        if (!ocr.cpf && ocrInv.cpf) ocr.cpf = ocrInv.cpf;
        if (!ocr.numeroDocumento && ocrInv.numeroDocumento) ocr.numeroDocumento = ocrInv.numeroDocumento;
      }

      if (!resultado.nomeCompleto && ocr.nome) resultado.nomeCompleto = ocr.nome;
      if (!resultado.dataNascimento && ocr.dataNascimento) resultado.dataNascimento = ocr.dataNascimento;
      if (!resultado.numeroCpf && ocr.cpf) resultado.numeroCpf = ocr.cpf;
      if (!resultado.numeroDocumento && ocr.numeroDocumento) resultado.numeroDocumento = ocr.numeroDocumento;

      if (resultado.nomeCompleto || resultado.dataNascimento || resultado.numeroCpf) return;
    } catch (e) {
      console.error("Erro OCR:", e);
    }
  }
}

// ---------------------------------------------------------------------------
// Pipeline principal
// ---------------------------------------------------------------------------

export async function processarDocumento(input: AnaliseInput): Promise<DocumentoResultado> {
  const client = criarCliente(input.docConfig.endpoint, input.docConfig.apiKey);

  const { buffer: frenteBuffer, analise: frenteAnalise } = await analisarComRotacao(
    client,
    input.frenteRaw
  );

  if (!frenteAnalise && !isPdf(input.frenteRaw)) throw new DocumentoNaoDetectadoError();
  if (frenteAnalise && documentoAberto(frenteAnalise.doc)) throw new DocumentoAbertoError();

  const versoDoc = input.versoRaw
    ? (await analisarDocumento(client, input.versoRaw))?.doc ?? null
    : null;

  const resultado: DocumentoResultado = frenteAnalise
    ? mesclarResultados(frenteAnalise.doc, versoDoc)
    : { sucesso: true, tipoDocumento: "PDF Digital" };

  // OCR fallback para campos ausentes
  if (!resultado.nomeCompleto || !resultado.dataNascimento || !resultado.numeroCpf) {
    const buffers = [frenteBuffer, ...(input.versoRaw ? [input.versoRaw] : [])];
    await aplicarOcrFallback(client, resultado, buffers);
  }

  if (!resultado.nomeCompleto && !resultado.dataNascimento) {
    console.error("OCR falhou — nenhum campo extraído. tipoDocumento:", resultado.tipoDocumento);
    throw new ExtracacaoFalhouError();
  }

  if (input.selfieRaw && input.faceConfig) {
    resultado.comparacaoFacial = await compararFaces(
      input.faceConfig,
      input.selfieRaw,
      frenteBuffer
    );
  }

  return resultado;
}
