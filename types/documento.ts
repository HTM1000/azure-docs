export interface ComparacaoFacial {
  similaridade: number;
  aprovado: boolean;
  erro?: string;
}

export interface DocumentoResultado {
  sucesso: boolean;
  mensagemErro?: string;
  aviso?: string;
  comparacaoFacial?: ComparacaoFacial;
  nomeCompleto?: string;
  dataNascimento?: string;
  numeroCpf?: string;
  numeroDocumento?: string;
  sexo?: string;
  dataEmissao?: string;
  dataVencimento?: string;
  nacionalidade?: string;
  tipoDocumento?: string;
  paisEmissor?: string;
  confianca?: number;
  statusVerificacao?: string;
}

export interface CadastroUsuario {
  nome: string;
  cpf: string;
  dataNascimento: string;
}

export interface ValidacaoCampo {
  label: string;
  docValor?: string;
  cadValor: string;
  bate: boolean;
}
