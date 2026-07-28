"use client";

import {
  useEffect,
  type ReactNode,
} from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

export interface ModalProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
  className?: string;
}

export function Modal({
  isOpen,
  title,
  children,
  onClose,
  footer,
  className,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) {
          onClose();
        }
      }}
    >
      <section
        className={cn(
          "max-h-[90vh] w-full max-w-lg overflow-auto rounded-xl bg-white shadow-xl",
          className,
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <header className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-4">
          <h2
            id="modal-title"
            className="text-lg font-semibold text-slate-950"
          >
            {title}
          </h2>

          <Button
            variant="ghost"
            className="size-9 p-0"
            onClick={onClose}
            aria-label="Đóng hộp thoại"
          >
            <X className="size-5" />
          </Button>
        </header>

        <div className="px-6 py-5">
          {children}
        </div>

        {footer && (
          <footer className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
            {footer}
          </footer>
        )}
      </section>
    </div>
  );
}
