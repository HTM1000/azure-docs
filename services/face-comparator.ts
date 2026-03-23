import type { ComparacaoFacial } from "@/types/documento";
import type { AzureFaceConfig } from "@/config/azure";
import { detectarRosto } from "./face-api";
import { canConsume, record } from "./rate-limiter";

export async function compararFaces(
  config: AzureFaceConfig,
  selfieBuffer: Buffer,
  documentoBuffer: Buffer
): Promise<ComparacaoFacial> {
  if (!canConsume(2)) {
    return {
      similaridade: 0,
      aprovado: false,
      erro: "Limite de chamadas da Face API atingido. Tente novamente em instantes.",
    };
  }

  try {
    await detectarRosto(config, selfieBuffer);
    record(1);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    return {
      similaridade: 0,
      aprovado: false,
      erro:
        msg === "__NENHUM_ROSTO__"
          ? "Nenhum rosto detectado na selfie. Use uma foto clara com o rosto visível."
          : `Erro ao analisar selfie: ${msg}`,
    };
  }

  try {
    await detectarRosto(config, documentoBuffer);
    record(1);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    return {
      similaridade: 0,
      aprovado: false,
      erro:
        msg === "__NENHUM_ROSTO__"
          ? "Nenhum rosto detectado no documento."
          : `Erro ao analisar documento: ${msg}`,
    };
  }

  // returnFaceId=false → sem faceId → verificação biométrica indisponível sem aprovação Microsoft
  return {
    similaridade: 0,
    aprovado: false,
    erro: "Rostos detectados, mas a comparação biométrica requer aprovação da Microsoft. Acesse https://aka.ms/facerecognition para solicitar acesso.",
  };
}
