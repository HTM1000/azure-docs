import type { DocumentoResultado, CadastroUsuario, ValidacaoCampo } from "@/types/documento";
import { nomeContemCadastro, normalizarCpf, normalizarData, formatarCpf } from "@/lib/utils";

export function validarCadastro(
  resultado: DocumentoResultado,
  cadastro: CadastroUsuario
): ValidacaoCampo[] {
  const nomeDoc = resultado.nomeCompleto;
  const cpfDoc = resultado.numeroCpf;
  const dataDoc = resultado.dataNascimento;

  return [
    {
      label: "👤 Nome",
      docValor: nomeDoc,
      cadValor: cadastro.nome,
      bate: !!nomeDoc && nomeContemCadastro(nomeDoc, cadastro.nome),
    },
    {
      label: "🪪 CPF",
      docValor: cpfDoc,
      cadValor: formatarCpf(cadastro.cpf),
      bate: !!cpfDoc && normalizarCpf(cpfDoc) === normalizarCpf(cadastro.cpf),
    },
    {
      label: "🎂 Data de Nascimento",
      docValor: dataDoc,
      cadValor: cadastro.dataNascimento,
      bate: !!dataDoc && normalizarData(dataDoc) === normalizarData(cadastro.dataNascimento),
    },
  ];
}
