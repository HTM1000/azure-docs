import { NextRequest, NextResponse } from "next/server";
import type { DocumentoResultado } from "@/types/documento";
import { getDocumentConfig, getFaceConfig } from "@/config/azure";
import {
  processarDocumento,
  DocumentoNaoDetectadoError,
  DocumentoAbertoError,
  ExtracacaoFalhouError,
} from "@/services/orchestrator";

function erro422(mensagem: string) {
  return NextResponse.json<DocumentoResultado>(
    { sucesso: false, mensagemErro: mensagem },
    { status: 422 }
  );
}

export async function POST(request: NextRequest) {
  const docConfig = getDocumentConfig();
  if (!docConfig) {
    return NextResponse.json<DocumentoResultado>(
      {
        sucesso: false,
        mensagemErro:
          "Configure AZURE_DOCUMENT_ENDPOINT e AZURE_DOCUMENT_API_KEY no arquivo .env.local",
      },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const frenteFile = formData.get("documentoFrente") as File | null;

    if (!frenteFile) {
      return NextResponse.json<DocumentoResultado>(
        { sucesso: false, mensagemErro: "Nenhum documento (frente) foi enviado." },
        { status: 400 }
      );
    }

    const versoFile = formData.get("documentoVerso") as File | null;
    const fotoFile = formData.get("fotoRosto") as File | null;

    const resultado = await processarDocumento({
      frenteRaw: Buffer.from(await frenteFile.arrayBuffer()),
      versoRaw: versoFile ? Buffer.from(await versoFile.arrayBuffer()) : undefined,
      selfieRaw: fotoFile ? Buffer.from(await fotoFile.arrayBuffer()) : undefined,
      docConfig,
      faceConfig: getFaceConfig() ?? undefined,
    });

    return NextResponse.json(resultado);
  } catch (e) {
    if (e instanceof DocumentoNaoDetectadoError) return erro422(e.message);
    if (e instanceof DocumentoAbertoError) return erro422(e.message);
    if (e instanceof ExtracacaoFalhouError) return erro422(e.message);

    const msg = e instanceof Error ? e.message : "Erro desconhecido";
    return NextResponse.json<DocumentoResultado>(
      { sucesso: false, mensagemErro: `Erro ao processar: ${msg}` },
      { status: 500 }
    );
  }
}
