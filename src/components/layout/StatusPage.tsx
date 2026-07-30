"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  CircleX,
  Info,
  TriangleAlert,
} from "lucide-react";

import { APP_ROUTES } from "@/constants/app-routes";
import { cn } from "@/utils/cn";

export type StatusPageTone = "error" | "warning" | "info";

export interface StatusPageProps {
  code: string;
  title: string;
  description: string;
  action?: ReactNode;
  tone?: StatusPageTone;
  className?: string;
}

const toneClasses: Record<StatusPageTone, string> = {
  error: "text-red-600",
  warning: "text-amber-600",
  info: "text-blue-600",
};

const toneIcons = {
  error: CircleX,
  warning: TriangleAlert,
  info: Info,
} as const;

export function StatusPage({
  code,
  title,
  description,
  action,
  tone = "info",
  className,
}: StatusPageProps) {
  const Icon = toneIcons[tone];

  return (
    <main
      className={cn(
        "grid min-h-screen place-items-center bg-slate-50 px-6 py-16",
        className,
      )}
    >
      <section className="w-full max-w-lg text-center">
        <div className="flex justify-center">
          <Icon
            className={cn("size-8", toneClasses[tone])}
            aria-hidden="true"
          />
        </div>
        <p
          className={cn(
            "mt-3 text-sm font-semibold uppercase tracking-[0.25em]",
            toneClasses[tone],
          )}
        >
          {code}
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
          {title}
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          {description}
        </p>

        <div className="mt-8 flex justify-center">
          {action ?? (
            <Link
              href={APP_ROUTES.HOME}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Về trang chủ
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
