import type { CamposOcr } from "@/types/interno";
import { parsearCpf } from "./cpf";

const DATA_REGEX = /\d{2}\/\d{2}\/\d{4}/;

function norm(s: string): string {
  return s.trim().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function parsearCamposDeLinhas(linhas: string[]): CamposOcr {
  const campos: CamposOcr = {};

  for (let i = 0; i < linhas.length; i++) {
    const atual = norm(linhas[i]);
    const composto = i + 1 < linhas.length ? `${atual} ${norm(linhas[i + 1])}` : atual;
    const prox = (offset: number) =>
      i + offset < linhas.length ? linhas[i + offset].trim() : "";

    if (
      !campos.nome &&
      atual.includes("NOME") &&
      !atual.includes("FILIACAO") &&
      !atual.includes("SOBRENOME DO")
    ) {
      const val = prox(1);
      if (val && !DATA_REGEX.test(val) && val.length > 3) campos.nome = val;
    }

    if (!campos.dataNascimento && (atual.includes("NASCIMENTO") || composto.includes("NASCIMENTO"))) {
      const offset = composto.includes("NASCIMENTO") && !atual.includes("NASCIMENTO") ? 2 : 1;
      const match = prox(offset).match(DATA_REGEX);
      if (match) campos.dataNascimento = match[0];
    }

    if (!campos.cpf && atual.includes("CPF")) {
      const cpf = parsearCpf(prox(1));
      if (cpf) campos.cpf = cpf;
    }

    if (
      !campos.numeroDocumento &&
      atual.includes("REGISTRO") &&
      !atual.includes("CARTEIRA") &&
      !atual.includes("NACIONAL") &&
      !atual.includes("TERRITORIO")
    ) {
      const val = prox(1);
      if (val && val.length > 3) campos.numeroDocumento = val;
    }

    if (!campos.numeroDocumento && composto.includes("REGISTRO GERAL")) {
      campos.numeroDocumento = prox(2);
    }
  }

  if (!campos.cpf) {
    for (const linha of linhas) {
      const cpf = parsearCpf(linha);
      if (cpf) {
        campos.cpf = cpf;
        break;
      }
    }
  }

  return campos;
}
