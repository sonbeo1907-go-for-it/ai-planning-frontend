import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/utils/cn";

export interface MainContentProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  actions?: ReactNode;
}

export function MainContent({
  title,
  description,
  actions,
  children,
  className,
  ...props
}: MainContentProps) {
  return (
    <main
      className={cn("flex-1 px-4 py-6 sm:px-6 lg:px-8", className)}
      {...props}
    >
      {(title || description || actions) && (
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            {title && (
              <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      )}
      {children}
    </main>
  );
}
