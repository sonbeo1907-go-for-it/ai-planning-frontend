import Link from "next/link";

import { cn } from "@/utils/cn";

export interface PaginationProps {
  page: number;
  totalPages: number;
  createHref: (page: number) => string;
  className?: string;
}

export function Pagination({
  page,
  totalPages,
  createHref,
  className,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const currentPage = Math.min(
    Math.max(page, 0),
    totalPages - 1,
  );

  return (
    <nav
      className={cn(
        "flex items-center justify-center gap-3",
        className,
      )}
      aria-label="Phân trang"
    >
      {currentPage > 0 ? (
        <Link
          className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
          href={createHref(currentPage - 1)}
        >
          Trang trước
        </Link>
      ) : (
        <span className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-400">
          Trang trước
        </span>
      )}

      <span className="text-sm text-slate-600">
        Trang {currentPage + 1}/{totalPages}
      </span>

      {currentPage < totalPages - 1 ? (
        <Link
          className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
          href={createHref(currentPage + 1)}
        >
          Trang sau
        </Link>
      ) : (
        <span className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-400">
          Trang sau
        </span>
      )}
    </nav>
  );
}
