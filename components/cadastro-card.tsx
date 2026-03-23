"use client";

import { User, IdCard, Calendar, Check, ClipboardList } from "lucide-react";
import { CadastroUsuario } from "@/types/documento";
import { formatarCpf } from "@/lib/utils";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "./ui/card";

interface CadastroCardProps {
  cadastro: CadastroUsuario;
  onChange: (cadastro: CadastroUsuario) => void;
}

export function CadastroCard({ cadastro, onChange }: CadastroCardProps) {
  const campo = (
    icon: React.ReactNode,
    label: string,
    field: keyof CadastroUsuario,
    placeholder: string,
    type = "text"
  ) => (
    <div className="flex items-center gap-3 rounded-xl bg-slate-800/60 px-4 py-3 border border-slate-700/50 focus-within:border-indigo-500/50 transition-colors">
      <span className="text-slate-500 shrink-0">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-medium mb-0.5">
          {label}
        </p>
        <input
          type={type}
          value={cadastro[field]}
          placeholder={placeholder}
          onChange={(e) => onChange({ ...cadastro, [field]: e.target.value })}
          className="w-full bg-transparent text-sm font-semibold text-slate-100 placeholder:text-slate-600 outline-none"
        />
      </div>
    </div>
  );

  const cpfFormatado = formatarCpf(cadastro.cpf);
  const cpfValido = cadastro.cpf.replace(/\D/g, "").length === 11;

  return (
    <Card className="border-indigo-500/20 bg-gradient-to-b from-indigo-950/40 to-slate-900/80">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Dados do Cadastro</CardTitle>
            <CardDescription>Preencha para comparar com o documento</CardDescription>
          </div>
          <span className="ml-auto rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-xs font-medium text-indigo-300 border border-indigo-500/30">
            Referência
          </span>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2.5">
          {campo(<User className="h-4 w-4" />, "Nome Completo", "nome", "Ex: João da Silva")}

          <div className="flex items-center gap-3 rounded-xl bg-slate-800/60 px-4 py-3 border border-slate-700/50 focus-within:border-indigo-500/50 transition-colors">
            <span className="text-slate-500 shrink-0">
              <IdCard className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-medium mb-0.5">
                CPF
              </p>
              <input
                type="text"
                value={cpfFormatado !== cadastro.cpf ? cpfFormatado : cadastro.cpf}
                placeholder="000.000.000-00"
                maxLength={14}
                onChange={(e) => onChange({ ...cadastro, cpf: e.target.value })}
                className="w-full bg-transparent text-sm font-semibold text-slate-100 placeholder:text-slate-600 outline-none font-mono"
              />
            </div>
            {cadastro.cpf && (
              <span className={`flex items-center text-xs font-bold ${cpfValido ? "text-green-400" : "text-slate-600"}`}>
                {cpfValido
                  ? <Check className="h-4 w-4" />
                  : `${cadastro.cpf.replace(/\D/g, "").length}/11`
                }
              </span>
            )}
          </div>

          {campo(<Calendar className="h-4 w-4" />, "Data de Nascimento", "dataNascimento", "DD/MM/AAAA")}
        </div>

        <p className="mt-3 text-center text-xs text-slate-600">
          Estes dados serão comparados com o documento após a análise
        </p>
      </CardContent>
    </Card>
  );
}
