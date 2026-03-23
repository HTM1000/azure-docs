"use client";

import { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { Check, FileText, Trash2, Upload, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "./ui/card";

interface UploadCardProps {
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  accept: Record<string, string[]>;
  preview?: string;
  fileName?: string;
  fileSize?: number;
  round?: boolean;
  onFile: (file: File) => void;
  onRemove: () => void;
}

export function UploadCard({
  label,
  sublabel,
  icon,
  accept,
  preview,
  fileName,
  fileSize,
  round,
  onFile,
  onRemove,
}: UploadCardProps) {
  const [error, setError] = useState<string>();

  const onDrop = useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      setError(undefined);
      if (rejected.length > 0) {
        setError(rejected[0].errors[0].message);
        return;
      }
      if (accepted[0]) onFile(accepted[0]);
    },
    [onFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

  const hasFile = !!preview;

  return (
    <Card className={cn("transition-all duration-200", hasFile && "border-indigo-500/40 shadow-indigo-500/10")}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-400">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle>{label}</CardTitle>
            <CardDescription>{sublabel}</CardDescription>
          </div>
          {hasFile && (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
              <Check className="h-3.5 w-3.5" />
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {hasFile ? (
          <div className="space-y-3">
            <div className="flex justify-center">
              {fileName?.toLowerCase().endsWith(".pdf") ? (
                <div className={cn(
                  "flex flex-col items-center justify-center gap-2 border-2 border-slate-700 bg-slate-800/60",
                  round ? "h-28 w-28 rounded-full" : "h-36 w-full max-w-xs rounded-xl"
                )}>
                  <FileText className="h-10 w-10 text-slate-400" />
                  <span className="text-xs text-slate-400 font-medium">PDF</span>
                </div>
              ) : (
                <img
                  src={preview}
                  alt={label}
                  className={cn(
                    "object-cover border-2 border-slate-700",
                    round ? "h-28 w-28 rounded-full" : "h-36 w-full max-w-xs rounded-xl"
                  )}
                />
              )}
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-800/60 px-3 py-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 truncate max-w-[70%]">
                <FileText className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{fileName}</span>
              </span>
              <span>{fileSize} KB</span>
            </div>
            <button
              onClick={onRemove}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-700 py-1.5 text-xs text-slate-400 hover:border-red-500/50 hover:text-red-400 transition-colors cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remover
            </button>
          </div>
        ) : (
          <div
            {...getRootProps()}
            className={cn(
              "flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-all duration-200",
              isDragActive
                ? "border-indigo-400 bg-indigo-500/10 drag-active"
                : "border-slate-700 hover:border-slate-500 hover:bg-slate-800/40"
            )}
          >
            <input {...getInputProps()} />
            <div className="text-slate-500">
              {isDragActive
                ? <FolderOpen className="h-8 w-8 text-indigo-400" />
                : <Upload className="h-8 w-8" />
              }
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">
                {isDragActive ? "Solte aqui" : "Arraste ou clique para selecionar"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {Object.keys(accept)
                  .map((m) => m.split("/")[1].toUpperCase().replace("JPEG", "JPG"))
                  .filter((v, i, a) => a.indexOf(v) === i)
                  .join(", ")}{" "}
                • Máx. 10MB
              </p>
            </div>
          </div>
        )}

        {error && (
          <p className="mt-2 text-center text-xs text-red-400">{error}</p>
        )}
      </CardContent>
    </Card>
  );
}
