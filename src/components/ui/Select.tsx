"use client";

import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/utils/cn";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  placeholder?: string;
  options: SelectOption[];
}

export function Select({
  id,
  label,
  error,
  placeholder,
  options,
  className,
  "aria-describedby": ariaDescribedBy,
  ...props
}: SelectProps) {
  const errorId = id && error ? `${id}-error` : undefined;

  return (
    <label className="grid gap-1.5">
      {label && (
        <span className="text-sm font-medium text-slate-700">{label}</span>
      )}
      <span className="relative block">
        <select
          id={id}
          className={cn(
            "min-h-10 w-full appearance-none rounded-md border border-slate-300 bg-white px-3 py-2 pr-10 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100",
            error && "border-red-500 focus:border-red-500 focus:ring-red-100",
            className,
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={
            [ariaDescribedBy, errorId].filter(Boolean).join(" ") || undefined
          }
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-500"
          aria-hidden="true"
        />
      </span>
      {error && (
        <span id={errorId} className="text-sm text-red-600">
          {error}
        </span>
      )}
    </label>
  );
}
