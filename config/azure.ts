export interface AzureDocumentConfig {
  endpoint: string;
  apiKey: string;
}

export interface AzureFaceConfig {
  endpoint: string;
  apiKey: string;
}

export function getDocumentConfig(): AzureDocumentConfig | null {
  const endpoint = process.env.AZURE_DOCUMENT_ENDPOINT;
  const apiKey = process.env.AZURE_DOCUMENT_API_KEY;
  if (!endpoint || !apiKey) return null;
  return { endpoint, apiKey };
}

export function getFaceConfig(): AzureFaceConfig | null {
  const endpoint = process.env.AZURE_FACE_ENDPOINT;
  const apiKey = process.env.AZURE_FACE_API_KEY;
  if (!endpoint || !apiKey) return null;
  return { endpoint, apiKey };
}
