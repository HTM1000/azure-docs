import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variant === "default" && "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30",
        variant === "success" && "bg-green-500/20 text-green-300 border border-green-500/30",
        variant === "warning" && "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
        variant === "error" && "bg-red-500/20 text-red-300 border border-red-500/30",
        variant === "outline" && "border border-slate-600 text-slate-400",
        className
      )}
      {...props}
    />
  );
}
