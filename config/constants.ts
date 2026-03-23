export const CONFIANCA_ALTA = 0.9;
export const CONFIANCA_MEDIA = 0.7;
export const LIMIAR_APROVACAO_FACE = 0.6;
export const FACE_LIMIT_MIN = 20;
export const FACE_LIMIT_MONTH = 30_000;
export const ROTACOES_TENTATIVA = [180, 90, 270] as const;

export const IMAGE_ACCEPT = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

export const DOCUMENT_ACCEPT = {
  ...IMAGE_ACCEPT,
  "application/pdf": [".pdf"],
};
