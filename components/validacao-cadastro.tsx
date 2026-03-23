"use client";

import { ScanSearch, CheckCircle2, XCircle } from "lucide-react";
import type { ValidacaoCampo } from "@/types/documento";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";

interface ValidacaoCadastroProps {
  campos: ValidacaoCampo[];
}

function LinhaValidacao({ campo }: { campo: ValidacaoCampo }) {
  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-3 transition-all",
        campo.bate ? "border-green-500/30 bg-green-500/10" : "border-red-500/30 bg-red-500/10"
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          {campo.label}
        </span>
        <span
          className={cn(
            "flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold border",
            campo.bate
              ? "bg-green-500/20 text-green-300 border-green-500/30"
              : "bg-red-500/20 text-red-300 border-red-500/30"
          )}
        >
          {campo.bate
            ? <><CheckCircle2 className="h-3 w-3" /> Confere</>
            : <><XCircle className="h-3 w-3" /> Não confere</>
          }
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-slate-500 mb-0.5">Do documento</p>
          <p className={cn("font-mono font-medium", campo.bate ? "text-green-300" : "text-red-300")}>
            {campo.docValor ?? "—"}
          </p>
        </div>
        <div>
          <p className="text-slate-500 mb-0.5">Cadastrado</p>
          <p className="font-mono font-medium text-slate-300">{campo.cadValor}</p>
        </div>
      </div>
    </div>
  );
}

export function ValidacaoCadastro({ campos }: ValidacaoCadastroProps) {
  const aprovado = campos.every((c) => c.bate);

  return (
    <div className="fade-up space-y-4">
      <Separator />

      <div className="flex items-center gap-2">
        <ScanSearch className="h-4 w-4 text-slate-400 shrink-0" />
        <h3 className="font-bold text-slate-100">Validação contra Cadastro</h3>
      </div>

      <div className="space-y-3">
        {campos.map((campo) => (
          <LinhaValidacao key={campo.label} campo={campo} />
        ))}
      </div>

      <div
        className={cn(
          "rounded-2xl border-2 p-5 text-center",
          aprovado
            ? "border-green-500/40 bg-gradient-to-b from-green-500/15 to-green-500/5"
            : "border-red-500/40 bg-gradient-to-b from-red-500/15 to-red-500/5"
        )}
      >
        <div className="flex justify-center mb-2">
          {aprovado
            ? <CheckCircle2 className="h-10 w-10 text-green-400" />
            : <XCircle className="h-10 w-10 text-red-400" />
          }
        </div>
        <p className={cn("text-2xl font-black tracking-wide", aprovado ? "text-green-400" : "text-red-400")}>
          {aprovado ? "APROVADO" : "REPROVADO"}
        </p>
        <p className="mt-1 text-sm text-slate-400">
          {aprovado
            ? "Todos os dados do documento correspondem ao cadastro."
            : "Um ou mais dados não correspondem ao cadastro registrado."}
        </p>
      </div>
    </div>
  );
}
