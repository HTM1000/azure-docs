"use client";

import { useState, useCallback } from "react";
import type { DocumentoResultado, CadastroUsuario } from "@/types/documento";

export interface ArquivoLocal {
  file: File;
  preview: string;
}

function fileToArquivo(file: File): ArquivoLocal {
  return { file, preview: URL.createObjectURL(file) };
}

export function useVerificacao() {
  const [cadastro, setCadastro] = useState<CadastroUsuario>({
    nome: "",
    cpf: "",
    dataNascimento: "",
  });
  const [foto, setFoto] = useState<ArquivoLocal>();
  const [frente, setFrente] = useState<ArquivoLocal>();
  const [verso, setVerso] = useState<ArquivoLocal>();
  const [processando, setProcessando] = useState(false);
  const [resultado, setResultado] = useState<DocumentoResultado>();
  const [erroGeral, setErroGeral] = useState<string>();

  const handleFoto = useCallback((f: File) => setFoto(fileToArquivo(f)), []);

  const handleFrente = useCallback((f: File) => {
    setFrente(fileToArquivo(f));
    setResultado(undefined);
  }, []);

  const handleVerso = useCallback((f: File) => {
    setVerso(fileToArquivo(f));
    setResultado(undefined);
  }, []);

  const removerFoto = useCallback(() => setFoto(undefined), []);

  const removerFrente = useCallback(() => {
    setFrente(undefined);
    setResultado(undefined);
  }, []);

  const removerVerso = useCallback(() => setVerso(undefined), []);

  const descartarErro = useCallback(() => setErroGeral(undefined), []);

  const analisar = useCallback(async () => {
    if (!frente) return;

    setProcessando(true);
    setResultado(undefined);
    setErroGeral(undefined);

    try {
      const formData = new FormData();
      formData.append("documentoFrente", frente.file);
      if (verso) formData.append("documentoVerso", verso.file);
      if (foto) formData.append("fotoRosto", foto.file);

      const res = await fetch("/api/analisar", { method: "POST", body: formData });
      const data: DocumentoResultado = await res.json();
      setResultado(data);
    } catch {
      setErroGeral("Erro de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setProcessando(false);
    }
  }, [frente, verso, foto]);

  const novaAnalise = useCallback(() => {
    setFoto(undefined);
    setFrente(undefined);
    setVerso(undefined);
    setResultado(undefined);
    setErroGeral(undefined);
    setCadastro({ nome: "", cpf: "", dataNascimento: "" });
  }, []);

  const podeAnalisar =
    !!frente &&
    !!cadastro.nome &&
    cadastro.cpf.replace(/\D/g, "").length === 11 &&
    !!cadastro.dataNascimento;

  return {
    cadastro,
    setCadastro,
    foto,
    frente,
    verso,
    processando,
    resultado,
    erroGeral,
    podeAnalisar,
    handleFoto,
    handleFrente,
    handleVerso,
    removerFoto,
    removerFrente,
    removerVerso,
    descartarErro,
    analisar,
    novaAnalise,
  };
}
