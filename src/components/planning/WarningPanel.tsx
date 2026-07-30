import type { HTMLAttributes, ReactNode } from "react";
import {
  CircleX,
  Info,
  TriangleAlert,
} from "lucide-react";

import { cn } from "@/utils/cn";

export type WarningPanelTone = "warning" | "error" | "info";

export interface WarningPanelProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  warnings?: string[];
  children?: ReactNode;
  tone?: WarningPanelTone;
  action?: ReactNode;
}

const panelClasses: Record<WarningPanelTone, string> = {
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  error: "border-red-200 bg-red-50 text-red-900",
  info: "border-blue-200 bg-blue-50 text-blue-900",
};

const iconClasses: Record<WarningPanelTone, string> = {
  warning: "text-amber-700",
  error: "text-red-700",
  info: "text-blue-700",
};

const toneIcons = {
  warning: TriangleAlert,
  error: CircleX,
  info: Info,
} as const;

export function WarningPanel({
  title,
  warnings,
  children,
  tone = "warning",
  action,
  className,
  ...props
}: WarningPanelProps) {
  const Icon = toneIcons[tone];

  return (
    <section
      className={cn(
        "rounded-lg border p-4",
        panelClasses[tone],
        className,
      )}
      role={tone === "error" ? "alert" : "status"}
      {...props}
    >
      <div className="flex gap-3">
        <Icon className={cn("mt-0.5 size-5 shrink-0", iconClasses[tone])} aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold">{title}</h3>
          {children && <div className="mt-1 text-sm leading-6">{children}</div>}
          {warnings && warnings.length > 0 && (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6">
              {warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </section>
  );
}
