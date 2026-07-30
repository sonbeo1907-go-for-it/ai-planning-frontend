import type { HTMLAttributes } from "react";
import { LoaderCircle } from "lucide-react";

import { cn } from "@/utils/cn";

export interface LoadingStateProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
}

const iconSizeClasses = {
  sm: "size-4",
  md: "size-6",
  lg: "size-8",
} as const;

export function LoadingState({
  label = "Đang tải dữ liệu",
  description,
  size = "md",
  className,
  ...props
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 py-8 text-center",
        className,
      )}
      role="status"
      aria-live="polite"
      {...props}
    >
      <LoaderCircle
        className={cn("animate-spin text-blue-600", iconSizeClasses[size])}
        aria-hidden="true"
      />
      <p className="text-sm font-medium text-slate-700">{label}</p>
      {description && (
        <p className="max-w-md text-sm leading-6 text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
}
