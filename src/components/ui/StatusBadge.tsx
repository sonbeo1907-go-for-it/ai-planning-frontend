import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/utils/cn";

export type StatusBadgeTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger";

export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: StatusBadgeTone;
  showIndicator?: boolean;
  children: ReactNode;
}

const toneClasses: Record<StatusBadgeTone, string> = {
  neutral: "bg-slate-100 text-slate-700",
  info: "bg-blue-100 text-blue-800",
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-800",
  danger: "bg-red-100 text-red-800",
};

const indicatorClasses: Record<StatusBadgeTone, string> = {
  neutral: "bg-slate-500",
  info: "bg-blue-600",
  success: "bg-emerald-600",
  warning: "bg-amber-600",
  danger: "bg-red-600",
};

export function StatusBadge({
  tone = "neutral",
  showIndicator = true,
  className,
  children,
  ...props
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-6 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {showIndicator && (
        <span
          className={cn("size-1.5 rounded-full", indicatorClasses[tone])}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
