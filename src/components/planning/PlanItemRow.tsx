import type { ReactNode } from "react";
import {
  BrainCircuit,
  Clock,
  ExternalLink,
} from "lucide-react";

import { type PlanItemStatus } from "@/constants/plan-status";
import {
  StatusBadge,
  type StatusBadgeTone,
} from "@/components/ui";
import { cn } from "@/utils/cn";

export interface PlanItemRowProps {
  title: string;
  activityType?: string;
  durationMinutes: number;
  priority?: "LOW" | "MEDIUM" | "HIGH";
  status?: PlanItemStatus;
  completionRate?: number;
  isAiSuggested?: boolean;
  warning?: string;
  resourceHref?: string;
  actions?: ReactNode;
  className?: string;
}

const itemStatusPresentation: Record<
  PlanItemStatus,
  { label: string; tone: StatusBadgeTone }
> = {
  NOT_STARTED: { label: "Chưa bắt đầu", tone: "neutral" },
  IN_PROGRESS: { label: "Đang làm", tone: "info" },
  COMPLETED: { label: "Hoàn thành", tone: "success" },
  BLOCKED: { label: "Đang bị chặn", tone: "danger" },
};

const priorityLabels = {
  LOW: "Ưu tiên thấp",
  MEDIUM: "Ưu tiên vừa",
  HIGH: "Ưu tiên cao",
} as const;

export function PlanItemRow({
  title,
  activityType,
  durationMinutes,
  priority,
  status,
  completionRate,
  isAiSuggested = false,
  warning,
  resourceHref,
  actions,
  className,
}: PlanItemRowProps) {
  const normalizedCompletion = completionRate === undefined
    ? undefined
    : Math.min(100, Math.max(0, Math.round(completionRate)));

  return (
    <article
      className={cn(
        "rounded-lg border border-slate-200 bg-white p-4 shadow-sm",
        className,
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {activityType && (
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {activityType}
              </span>
            )}
            {isAiSuggested && (
              <StatusBadge tone="info">
                <BrainCircuit className="size-3.5" aria-hidden="true" />
                AI đề xuất
              </StatusBadge>
            )}
          </div>
          <h3 className="mt-1 text-base font-semibold text-slate-950">{title}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4" aria-hidden="true" />
              {durationMinutes} phút
            </span>
            {priority && <span>{priorityLabels[priority]}</span>}
            {normalizedCompletion !== undefined && (
              <span>{normalizedCompletion}% hoàn thành</span>
            )}
            {resourceHref && (
              <a
                className="inline-flex items-center gap-1 font-medium text-blue-700 hover:underline"
                href={resourceHref}
                target="_blank"
                rel="noreferrer"
              >
                Mở tài nguyên
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {status && (
            <StatusBadge tone={itemStatusPresentation[status].tone}>
              {itemStatusPresentation[status].label}
            </StatusBadge>
          )}
          {actions}
        </div>
      </div>
      {warning && (
        <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {warning}
        </p>
      )}
    </article>
  );
}
