"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/utils/cn";

export interface SidebarNavigationItem {
  href: string;
  label: string;
  icon?: ReactNode;
  badge?: string | number;
}

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  appName?: string;
  navigationItems: SidebarNavigationItem[];
  footer?: ReactNode;
  onNavigate?: () => void;
}

function isCurrentPath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar({
  appName = "AI Planning",
  navigationItems,
  footer,
  onNavigate,
  className,
  ...props
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex",
        className,
      )}
      {...props}
    >
      <div className="flex min-h-16 items-center border-b border-slate-200 px-5">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-slate-950"
        >
          {appName}
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-3" aria-label="Điều hướng chính">
        {navigationItems.map((item) => {
          const current = isCurrentPath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={current ? "page" : undefined}
              className={cn(
                "flex min-h-10 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                current
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-950",
              )}
            >
              {item.icon && (
                <span className="size-5 shrink-0" aria-hidden="true">
                  {item.icon}
                </span>
              )}
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {item.badge !== undefined && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {footer && (
        <div className="border-t border-slate-200 p-3">{footer}</div>
      )}
    </aside>
  );
}
