"use client";

import type { InputHTMLAttributes } from "react";
import { Search, X } from "lucide-react";

import { cn } from "@/utils/cn";

export interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  onClear?: () => void;
}

export function SearchInput({
  id,
  label,
  error,
  onClear,
  className,
  "aria-describedby": ariaDescribedBy,
  ...props
}: SearchInputProps) {
  const errorId = id && error ? `${id}-error` : undefined;

  return (
    <label className="grid gap-1.5">
      {label && (
        <span className="text-sm font-medium text-slate-700">{label}</span>
      )}
      <span className="relative block">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <input
          id={id}
          type="search"
          className={cn(
            "min-h-10 w-full rounded-md border border-slate-300 bg-white py-2 pl-9 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100",
            onClear ? "pr-10" : "pr-3",
            error && "border-red-500 focus:border-red-500 focus:ring-red-100",
            className,
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={
            [ariaDescribedBy, errorId].filter(Boolean).join(" ") || undefined
          }
          {...props}
        />
        {onClear && (
          <button
            type="button"
            className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-600"
            onClick={onClear}
            aria-label="Xóa nội dung tìm kiếm"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        )}
      </span>
      {error && (
        <span id={errorId} className="text-sm text-red-600">
          {error}
        </span>
      )}
    </label>
  );
}
