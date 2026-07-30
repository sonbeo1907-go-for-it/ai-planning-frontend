"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

export interface HeaderUser {
  name: string;
  role?: string;
}

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  user?: HeaderUser;
  onMenuToggle?: () => void;
  isSidebarOpen?: boolean;
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

export function Header({
  title,
  subtitle,
  actions,
  user,
  onMenuToggle,
  isSidebarOpen,
  className,
  ...props
}: HeaderProps) {
  return (
    <header
      className={cn(
        "flex min-h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 sm:px-6",
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 items-center gap-3">
        {onMenuToggle && (
          <Button
            variant="ghost"
            className="size-10 shrink-0 p-0 lg:hidden"
            onClick={onMenuToggle}
            aria-label="Mở hoặc đóng menu điều hướng"
            aria-expanded={isSidebarOpen}
          >
            <Menu className="size-5" />
          </Button>
        )}

        {(title || subtitle) && (
          <div className="min-w-0">
            {title && (
              <h1 className="truncate text-lg font-semibold text-slate-950">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="truncate text-sm text-slate-500">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {actions}
        {user && (
          <div className="flex items-center gap-2">
            <span
              className="grid size-9 place-items-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700"
              aria-hidden="true"
            >
              {initials(user.name)}
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-medium text-slate-800">
                {user.name}
              </span>
              {user.role && (
                <span className="block text-xs text-slate-500">
                  {user.role}
                </span>
              )}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
