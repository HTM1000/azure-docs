import { type LucideIcon, CheckCircle2, User, Calendar, IdCard, FileText, Clock, Globe, Flag, Users } from "lucide-react";
import { DocumentoResultado } from "@/types/documento";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";

interface ResultadoDadosProps {
  resultado: DocumentoResultado;
}

function Campo({ icon: Icon, label, valor }: { icon: LucideIcon; label: string; valor?: string }) {
  if (!valor) return null;
  return (
    <div className="rounded-xl bg-slate-800/60 border border-slate-700/50 px-4 py-3">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="h-3 w-3 text-slate-500 shrink-0" />
        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">
          {label}
        </p>
      </div>
      <p className="text-sm font-semibold text-slate-100 break-words">{valor}</p>
    </div>
  );
}

export function ResultadoDados({ resultado }: ResultadoDadosProps) {
  const pct = Math.round((resultado.confianca ?? 0) * 100);
  const corBarra =
    pct >= 90 ? "bg-green-500" : pct >= 70 ? "bg-yellow-500" : "bg-red-500";
  const corTexto =
    pct >= 90 ? "text-green-400" : pct >= 70 ? "text-yellow-400" : "text-red-400";

  return (
    <div className="fade-up space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-6 w-6 text-green-400 shrink-0" />
          <h2 className="text-lg font-bold text-slate-100">Documento Analisado</h2>
        </div>
        {resultado.tipoDocumento && (
          <Badge variant="outline">{resultado.tipoDocumento}</Badge>
        )}
      </div>

      {resultado.statusVerificacao && (
        <p className="text-sm text-slate-300 bg-slate-800/60 rounded-xl px-4 py-3 border border-slate-700/50">
          {resultado.statusVerificacao}
        </p>
      )}

      {resultado.confianca !== undefined && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 font-medium">Confiança da análise</span>
            <span className={cn("font-bold", corTexto)}>{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={cn("h-full rounded-full bar-animate", corBarra)}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      <Separator />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Campo icon={User}       label="Nome Completo"     valor={resultado.nomeCompleto} />
        <Campo icon={Calendar}   label="Data de Nascimento" valor={resultado.dataNascimento} />
        <Campo icon={IdCard}     label="CPF / N° Pessoal"  valor={resultado.numeroCpf} />
        <Campo icon={FileText}   label="N° do Documento"   valor={resultado.numeroDocumento} />
        <Campo icon={Users}      label="Sexo"              valor={resultado.sexo} />
        <Campo icon={Calendar}   label="Data de Emissão"   valor={resultado.dataEmissao} />
        <Campo icon={Clock}      label="Validade"          valor={resultado.dataVencimento} />
        <Campo icon={Globe}      label="Nacionalidade"     valor={resultado.nacionalidade} />
        <Campo icon={Flag}       label="País Emissor"      valor={resultado.paisEmissor} />
      </div>
    </div>
  );
}
