# Verificação de Documentos

Aplicação web para verificação de documentos de identidade brasileiros (RG e CNH) utilizando Azure AI. Extrai dados do documento via OCR, valida contra um cadastro informado pelo usuário e, opcionalmente, realiza comparação facial entre selfie e foto do documento.

---

## Funcionalidades

- Upload de RG ou CNH (frente e verso) em imagem ou PDF
- Upload de foto pessoal (selfie) para comparação facial
- Extração automática de dados via **Azure Document Intelligence** (`prebuilt-idDocument`)
- Fallback via OCR (`prebuilt-read`) para e-CNH digital e documentos com baixa confiança
- Correção automática de orientação da imagem (EXIF + rotação por tentativa)
- Validação dos dados extraídos contra nome, CPF e data de nascimento informados
- Comparação facial via **Azure Face API** (requer aprovação Microsoft para verificação biométrica)
- Rate limiting da Face API (20 chamadas/min, 30k/mês — free tier)
- Detecção de documento aberto (frente e verso na mesma foto)

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript |
| Estilo | Tailwind CSS v4 |
| Componentes | Radix UI + Lucide React |
| Upload | react-dropzone |
| Imagem | sharp |
| Azure SDK | @azure/ai-form-recognizer |

---

## Pré-requisitos

- Node.js 18+
- Conta Azure com os seguintes recursos criados:
  - **Document Intelligence** (tier F0 gratuito disponível)
  - **Face API** (opcional — necessário para comparação facial)

---

## Configuração

### 1. Clone e instale

```bash
git clone <repo>
cd documento-verifica
npm install
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Azure Document Intelligence
AZURE_DOCUMENT_ENDPOINT=https://<seu-recurso>.cognitiveservices.azure.com/
AZURE_DOCUMENT_API_KEY=<sua-chave>

# Azure Face API (opcional)
AZURE_FACE_ENDPOINT=https://<seu-recurso>.cognitiveservices.azure.com/
AZURE_FACE_API_KEY=<sua-chave>
```

**Como obter as credenciais do Document Intelligence:**
1. Acesse [portal.azure.com](https://portal.azure.com)
2. Crie um recurso **Document Intelligence** (tier F0)
3. Navegue até **Keys and Endpoint**
4. Copie o **Endpoint** e a **Key 1**

### 3. Execute em desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

---

## Estrutura do Projeto

```
config/
  constants.ts        # Constantes globais (limites, thresholds, tipos de arquivo)
  azure.ts            # Leitura e validação das env vars Azure

types/
  documento.ts        # Tipos públicos de domínio
  interno.ts          # Tipos server-only (AnaliseInput, CamposOcr, etc.)

lib/
  utils.ts            # Utilitários gerais (formatação, normalização)
  cpf.ts              # Parser de CPF (formatos XXX.XXX.XXX-XX e XXXXXXXXX/XX)
  ocr-parser.ts       # Parser de linhas OCR para extração de campos

services/
  image-processor.ts  # Processamento de imagem com sharp (EXIF, rotação, PDF)
  document-ai.ts      # Wrapper do Azure Document Intelligence SDK
  face-api.ts         # Chamadas HTTP à Azure Face API
  face-comparator.ts  # Orquestração de comparação facial + rate limiter
  rate-limiter.ts     # Controle de taxa de chamadas (singleton de módulo)
  orchestrator.ts     # Pipeline principal de análise de documento

domain/
  document-merger.ts    # Merge de campos de frente + verso
  document-validator.ts # Regras de negócio (documento aberto, status de confiança)
  cadastro-validator.ts # Validação dos dados do cadastro contra o documento

hooks/
  use-verificacao.ts  # Estado e handlers client-side

components/
  verificacao-page.tsx  # Página principal ("use client")
  upload-section.tsx    # Seção de upload (3 cards)
  analise-button.tsx    # Botão de análise com hint
  resultado-section.tsx # Seção de resultado (sucesso ou erro)
  cadastro-card.tsx     # Formulário de dados do cadastro
  resultado-dados.tsx   # Exibição dos dados extraídos do documento
  validacao-cadastro.tsx # Comparação documento vs. cadastro
  comparacao-facial.tsx  # Resultado da comparação facial
  ui/                   # Componentes base (Button, Card, Badge, Separator)

app/
  api/analisar/route.ts # POST handler (controlador fino, ~45 linhas)
  page.tsx              # Entrada da aplicação
  layout.tsx            # Layout raiz
  globals.css           # Estilos globais e animações
```

---

## Fluxo de Análise

```
POST /api/analisar
│
├── 1. Normaliza orientação EXIF da imagem
├── 2. Analisa com prebuilt-idDocument
│   └── Se confiança < 70%: testa rotações (180°, 90°, 270°)
├── 3. Detecta documento aberto (frente+verso na mesma foto)
├── 4. Analisa verso (se enviado)
├── 5. Mescla campos de frente + verso
├── 6. OCR fallback (prebuilt-read) para campos ausentes
│   └── Se falhar na orientação original: tenta invertido 180°
├── 7. Comparação facial selfie vs. documento (se foto enviada)
└── 8. Retorna DocumentoResultado
```

---

## Observações

- **Comparação facial**: A verificação biométrica (`/face/v1.0/verify`) requer aprovação da Microsoft via [aka.ms/facerecognition](https://aka.ms/facerecognition). Sem aprovação, a detecção de rostos funciona mas a comparação retorna mensagem informativa.
- **CPF no RG**: O Azure retorna o número do RG no campo `PersonalNumber`. O CPF é extraído via OCR, buscando o padrão `XXX.XXX.XXX-XX` ou `XXXXXXXXX/XX` nas linhas do documento.
- **e-CNH PDF**: Se o `prebuilt-idDocument` não reconhecer o PDF, o sistema faz fallback automático para `prebuilt-read` com parser orientado a labels da e-CNH.

---

## Scripts

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # Linter
```
