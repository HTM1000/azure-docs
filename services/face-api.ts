import type { AzureFaceConfig } from "@/config/azure";

const detectUrl = (endpoint: string) =>
  `${endpoint.replace(/\/$/, "")}/face/v1.0/detect?returnFaceId=false&detectionModel=detection_03`;

export async function detectarRosto(config: AzureFaceConfig, buffer: Buffer): Promise<void> {
  const res = await fetch(detectUrl(config.endpoint), {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": config.apiKey,
      "Content-Type": "application/octet-stream",
    },
    body: buffer as unknown as BodyInit,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Face API erro ${res.status}: ${body}`);
  }

  const faces = (await res.json()) as Array<unknown>;
  if (faces.length === 0) throw new Error("__NENHUM_ROSTO__");
}
