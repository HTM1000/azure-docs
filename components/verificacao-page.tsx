"use client";

import { IdCard, AlertTriangle, X } from "lucide-react";
import { useVerificacao } from "@/hooks/use-verificacao";
import { UploadSection } from "./upload-section";
import { CadastroCard } from "./cadastro-card";
import { AnaliseButton } from "./analise-button";
import { ResultadoSection } from "./resultado-section";

function ErroAlert({ mensagem, onDismiss }: { mensagem: string; onDismiss: () => void }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
      <span className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        {mensagem}
      </span>
      <button
        onClick={onDismiss}
        className="ml-3 text-red-400 hover:text-red-200 cursor-pointer"
        aria-label="Fechar"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function VerificacaoPage() {
  const {
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
  } = useVerificacao();

  return (
    <main className="min-h-screen">
      <header className="relative overflow-hidden border-b border-slate-800">
        <div
          className="absolute inset-0 opacity-30"
          style={{ background: "radial-gradient(ellipse at 50% 0%, #4f46e5 0%, transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-5xl px-6 py-10 text-center">
          <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
            <IdCard className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-50 sm:text-3xl">
            Verificação de Documentos
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
            Envie seu RG ou CNH para verificação via{" "}
            <span className="text-indigo-400 font-medium">Azure Document Intelligence</span>
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
        {erroGeral && <ErroAlert mensagem={erroGeral} onDismiss={descartarErro} />}

        <UploadSection
          foto={foto}
          frente={frente}
          verso={verso}
          onFoto={handleFoto}
          onFrente={handleFrente}
          onVerso={handleVerso}
          onRemoverFoto={removerFoto}
          onRemoverFrente={removerFrente}
          onRemoverVerso={removerVerso}
        />

        <CadastroCard cadastro={cadastro} onChange={setCadastro} />

        <AnaliseButton
          loading={processando}
          disabled={!podeAnalisar}
          temFrente={!!frente}
          onClick={analisar}
        />

        {resultado && (
          <ResultadoSection
            resultado={resultado}
            cadastro={cadastro}
            onNovaAnalise={novaAnalise}
          />
        )}
      </div>

      <footer className="mt-12 border-t border-slate-800/60 py-6 text-center text-xs text-slate-600">
        Powered by Azure Document Intelligence • Dados processados com segurança
      </footer>
    </main>
  );
}
