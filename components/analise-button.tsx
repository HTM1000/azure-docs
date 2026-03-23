"use client";

import { Button } from "./ui/button";

interface AnaliseButtonProps {
  loading: boolean;
  disabled: boolean;
  temFrente: boolean;
  onClick: () => void;
}

function textoHint(temFrente: boolean): string {
  if (!temFrente) return "Envie pelo menos a frente do documento para continuar";
  return "Preencha todos os dados do cadastro para continuar";
}

export function AnaliseButton({ loading, disabled, temFrente, onClick }: AnaliseButtonProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <Button
        size="lg"
        loading={loading}
        disabled={disabled}
        onClick={onClick}
        className="w-full max-w-sm"
      >
        {loading ? "Analisando com Azure AI..." : "Analisar Documento"}
      </Button>

      {disabled && (
        <p className="text-xs text-slate-500">{textoHint(temFrente)}</p>
      )}
    </div>
  );
}
