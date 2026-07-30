import type { HTMLAttributes } from "react";

import { cn } from "@/utils/cn";

export interface DurationSummaryProps extends HTMLAttributes<HTMLDivElement> {
  availableMinutes: number;
  plannedMinutes: number;
  actualMinutes?: number;
  label?: string;
}

export function DurationSummary({
  availableMinutes,
  plannedMinutes,
  actualMinutes,
  label = "Thời lượng kế hoạch",
  className,
  ...props
}: DurationSummaryProps) {
  const safeAvailable = Math.max(0, availableMinutes);
  const safePlanned = Math.max(0, plannedMinutes);
  const safeActual = actualMinutes === undefined ? undefined : Math.max(0, actualMinutes);
  const isOverloaded = safePlanned > safeAvailable;
  const percentage = safeAvailable === 0
    ? 0
    : Math.min(100, Math.round((safePlanned / safeAvailable) * 100));
  const remainingMinutes = safeAvailable - safePlanned;

  return (
    <section
      className={cn(
        "rounded-lg border border-slate-200 bg-white p-4 shadow-sm",
        className,
      )}
      {...props}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-900">{label}</h3>
        <p
          className={cn(
            "text-sm font-semibold",
            isOverloaded ? "text-red-700" : "text-slate-700",
          )}
        >
          {safePlanned}/{safeAvailable} phút
        </p>
      </div>
      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={Math.max(safeAvailable, 1)}
        aria-valuenow={safePlanned}
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width]",
            isOverloaded ? "bg-red-500" : "bg-blue-600",
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <p className={isOverloaded ? "text-red-700" : "text-slate-600"}>
          {isOverloaded
            ? `Vượt ${Math.abs(remainingMinutes)} phút so với thời gian có thể học`
            : `Còn ${remainingMinutes} phút có thể phân bổ`}
        </p>
        {safeActual !== undefined && (
          <p className="text-slate-600">Thực tế: {safeActual} phút</p>
        )}
      </div>
    </section>
  );
}
