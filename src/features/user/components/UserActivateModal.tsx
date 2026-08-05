"use client";

import { useState } from "react";
import { User } from "../user.types";
import { ApiClientError } from "@/lib/api-client";

interface UserActivateModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export function UserActivateModal({
  isOpen,
  user,
  onClose,
  onConfirm,
}: UserActivateModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !user) return null;

  const handleActivate = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await onConfirm(user.id);
      onClose();
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError("Đã xảy ra lỗi khi kích hoạt lại tài khoản.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Mở khóa tài khoản</h3>
              <p className="text-xs text-slate-500">Kích hoạt lại trạng thái hoạt động</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-3 mb-6">
          <p className="text-sm text-slate-600">
            Bạn có chắc chắn muốn kích hoạt lại / mở khóa cho tài khoản:
          </p>
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
            <div className="font-bold text-slate-800 text-sm">{user.fullName}</div>
            <div className="text-xs text-slate-500 font-mono">@{user.username} • {user.email}</div>
          </div>
          <p className="text-xs text-slate-500">
            Tài khoản sau khi kích hoạt sẽ có thể đăng nhập và sử dụng hệ thống bình thường.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleActivate}
            disabled={submitting}
            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition disabled:opacity-50 flex items-center gap-2"
          >
            {submitting && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            Mở khóa ngay
          </button>
        </div>
      </div>
    </div>
  );
}
