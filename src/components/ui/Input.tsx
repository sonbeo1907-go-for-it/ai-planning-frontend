import type {
  InputHTMLAttributes,
} from "react";

import { cn } from "@/utils/cn";

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({
  id,
  label,
  error,
  className,
  "aria-describedby": ariaDescribedBy,
  ...props
}: InputProps) {
  const errorId = id && error
    ? `${id}-error`
    : undefined;

  return (
    <label className="grid gap-1.5">
      {label && (
        <span className="text-sm font-medium text-slate-700">
          {label}
        </span>
      )}

      <input
        id={id}
        className={cn(
          "min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100",
          error && "border-red-500 focus:border-red-500 focus:ring-red-100",
          className,
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={
          [ariaDescribedBy, errorId]
            .filter(Boolean)
            .join(" ")
          || undefined
        }
        {...props}
      />

      {error && (
        <span
          id={errorId}
          className="text-sm text-red-600"
        >
          {error}
        </span>
      )}
    </label>
  );
}
