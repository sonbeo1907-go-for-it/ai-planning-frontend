import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/utils/cn";

export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  sidebar?: ReactNode;
  header?: ReactNode;
  children: ReactNode;
}

/**
 * Provides the shared application frame. Supply a Sidebar and Header when a
 * route needs the authenticated application experience.
 */
export function AppShell({
  sidebar,
  header,
  children,
  className,
  ...props
}: AppShellProps) {
  return (
    <div
      className={cn("flex min-h-screen bg-slate-50", className)}
      {...props}
    >
      {sidebar}
      <div className="flex min-w-0 flex-1 flex-col">
        {header}
        {children}
      </div>
    </div>
  );
}
