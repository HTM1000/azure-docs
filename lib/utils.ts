import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizarNome(nome: string): string {
  return nome
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

export function normalizarCpf(cpf: string): string {
  return cpf.replace(/\D/g, "");
}

export function normalizarData(data: string): string {
  return data.replace(/\D/g, "");
}

export function nomeContemCadastro(nomeDoc: string, nomeCadastro: string): boolean {
  const palavrasDoc = normalizarNome(nomeDoc).split(" ");
  const palavrasCad = normalizarNome(nomeCadastro).split(" ");
  return palavrasCad.every((p) => palavrasDoc.includes(p));
}

export function formatarCpf(cpf: string): string {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return cpf;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}
