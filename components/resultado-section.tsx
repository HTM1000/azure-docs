"use client";

import { XCircle, ClipboardList, RefreshCw } from "lucide-react";
import type { DocumentoResultado, CadastroUsuario } from "@/types/documento";
import { validarCadastro } from "@/domain/cadastro-validator";
import { ResultadoDados } from "./resultado-dados";
import { ValidacaoCadastro } from "./validacao-cadastro";
import { ComparacaoFacialCard } from "./comparacao-facial";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface ResultadoSectionProps {
  resultado: DocumentoResultado;
  cadastro: CadastroUsuario;
  onNovaAnalise: () => void;
}

function ErroConfig() {
  return (
    <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-4 text-sm">
      <div className="flex items-center gap-1.5 mb-2">
        <ClipboardList className="h-4 w-4 text-yellow-400 shrink-0" />
        <p className="font-semibold text-yellow-400">Como configurar:</p>
      </div>
      <ol className="space-y-1 text-slate-400 list-decimal list-inside">
        <li>Acesse <strong className="text-slate-300">portal.azure.com</strong></li>
        <li>Crie um recurso <strong className="text-slate-300">Document Intelligence</strong> (tier F0)</li>
        <li>Vá em <strong className="text-slate-300">Keys and Endpoint</strong></li>
        <li>Copie o <strong className="text-slate-300">Endpoint</strong> e a <strong className="text-slate-300">Key 1</strong></li>
        <li>Cole em <code className="text-indigo-400">.env.local</code></li>
      </ol>
    </div>
  );
}

export function ResultadoSection({ resultado, cadastro, onNovaAnalise }: ResultadoSectionProps) {
  const campos = resultado.sucesso ? validarCadastro(resultado, cadastro) : [];

  return (
    <Card className={resultado.sucesso ? "border-indigo-500/20" : "border-red-500/20"}>
      <CardContent className="pt-5">
        {!resultado.sucesso ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <XCircle className="h-6 w-6 text-red-400 shrink-0" />
              <h2 className="text-lg font-bold text-slate-100">Erro na Análise</h2>
            </div>
            <p className="text-sm text-red-300 bg-red-500/10 rounded-xl px-4 py-3 border border-red-500/20">
              {resultado.mensagemErro}
            </p>
            {resultado.mensagemErro?.includes(".env.local") && <ErroConfig />}
          </div>
        ) : (
          <div className="space-y-6">
            <ResultadoDados resultado={resultado} />
            <ValidacaoCadastro campos={campos} />
            {resultado.comparacaoFacial && (
              <ComparacaoFacialCard comparacao={resultado.comparacaoFacial} />
            )}
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <Button variant="outline" onClick={onNovaAnalise}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Nova Análise
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
