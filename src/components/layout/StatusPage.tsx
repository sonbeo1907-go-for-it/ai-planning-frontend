import Link from "next/link";
import type { ReactNode } from "react";

import { APP_ROUTES } from "@/constants/app-routes";

export interface StatusPageProps {
  code: string;
  title: string;
  description: string;
  action?: ReactNode;
}

export function StatusPage({
  code,
  title,
  description,
  action,
}: StatusPageProps) {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-6 py-16">
      <section className="w-full max-w-lg text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
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
