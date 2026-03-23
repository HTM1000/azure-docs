"use client";

import { Camera, IdCard, ClipboardList } from "lucide-react";
import { UploadCard } from "./upload-card";
import { IMAGE_ACCEPT, DOCUMENT_ACCEPT } from "@/config/constants";
import type { ArquivoLocal } from "@/hooks/use-verificacao";

interface UploadSectionProps {
  foto?: ArquivoLocal;
  frente?: ArquivoLocal;
  verso?: ArquivoLocal;
  onFoto: (f: File) => void;
  onFrente: (f: File) => void;
  onVerso: (f: File) => void;
  onRemoverFoto: () => void;
  onRemoverFrente: () => void;
  onRemoverVerso: () => void;
}

export function UploadSection({
  foto,
  frente,
  verso,
  onFoto,
  onFrente,
  onVerso,
  onRemoverFoto,
  onRemoverFrente,
  onRemoverVerso,
}: UploadSectionProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <UploadCard
        label="Foto Pessoal"
        sublabel="Selfie ou foto de rosto"
        icon={<Camera className="h-5 w-5" />}
        accept={IMAGE_ACCEPT}
        preview={foto?.preview}
        fileName={foto?.file.name}
        fileSize={foto ? Math.round(foto.file.size / 1024) : undefined}
        round
        onFile={onFoto}
        onRemove={onRemoverFoto}
      />
      <UploadCard
        label="Documento — Frente"
        sublabel="Obrigatório • RG, CNH ou PDF"
        icon={<IdCard className="h-5 w-5" />}
        accept={DOCUMENT_ACCEPT}
        preview={frente?.preview}
        fileName={frente?.file.name}
        fileSize={frente ? Math.round(frente.file.size / 1024) : undefined}
        onFile={onFrente}
        onRemove={onRemoverFrente}
      />
      <UploadCard
        label="Documento — Verso"
        sublabel="Opcional • RG completo"
        icon={<ClipboardList className="h-5 w-5" />}
        accept={DOCUMENT_ACCEPT}
        preview={verso?.preview}
        fileName={verso?.file.name}
        fileSize={verso ? Math.round(verso.file.size / 1024) : undefined}
        onFile={onVerso}
        onRemove={onRemoverVerso}
      />
    </div>
  );
}
