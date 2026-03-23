"use client";

import { User, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { ComparacaoFacial } from "@/types/documento";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";

interface ComparacaoFacialProps {
  comparacao: ComparacaoFacial;
}

export function ComparacaoFacialCard({ comparacao }: ComparacaoFacialProps) {
  const { similaridade, aprovado, erro } = comparacao;

  const corBarra = aprovado
    ? similaridade >= 80 ? "bg-green-500" : "bg-yellow-500"
    : "bg-red-500";

  return (
    <div className="fade-up space-y-4">
      <Separator />

      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-slate-400 shrink-0" />
        <h3 className="font-bold text-slate-100">Comparação Facial</h3>
      </div>

      {erro ? (
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-300 space-y-1">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <p>{erro.replace("https://aka.ms/facerecognition", "").trim()}</p>
          </div>
          {erro.includes("aka.ms/facerecognition") && (
            <p className="text-xs text-yellow-400/70 pl-6">
              Solicite acesso em{" "}
              <span className="font-mono underline">aka.ms/facerecognition</span>
            </p>
          )}
        </div>
      ) : (
        <div
          className={cn(
            "rounded-xl border px-4 py-4 space-y-3",
            aprovado ? "border-green-500/30 bg-green-500/10" : "border-red-500/30 bg-red-500/10"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Similaridade biométrica
            </span>
            <span
              className={cn(
                "flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold border",
                aprovado
                  ? "bg-green-500/20 text-green-300 border-green-500/30"
                  : "bg-red-500/20 text-red-300 border-red-500/30"
              )}
            >
              {aprovado
                ? <><CheckCircle2 className="h-3 w-3" /> Aprovado</>
                : <><XCircle className="h-3 w-3" /> Reprovado</>
              }
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Selfie vs. Documento</span>
              <span className={cn("font-bold", aprovado ? "text-green-300" : "text-red-300")}>
                {similaridade}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={cn("h-full rounded-full bar-animate", corBarra)}
                style={{ width: `${similaridade}%` }}
              />
            </div>
          </div>

          <p className={cn("text-xs", aprovado ? "text-green-300/70" : "text-red-300/70")}>
            {aprovado
              ? "O rosto na selfie corresponde ao rosto no documento."
              : "O rosto na selfie não corresponde ao rosto no documento."}
          </p>
        </div>
      )}
    </div>
  );
}
