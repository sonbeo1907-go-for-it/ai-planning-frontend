"use client";

import { useState } from "react";
import { User } from "../user.types";
import { ApiClientError } from "@/lib/api-client";

interface UserDeactivateModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export function UserDeactivateModal({
  isOpen,
  user,
  onClose,
  onConfirm,
}: UserDeactivateModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !user) return null;

  const handleDeactivate = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await onConfirm(user.id);
      onClose();
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError("Không thể vô hiệu hóa tài khoản. Vui lòng thử lại.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h3 className="text-lg font-bold text-slate-800 mb-2">
            Vô hiệu hóa tài khoản người dùng
          </h3>

          <p className="text-sm text-slate-600 mb-4">
            Bạn có chắc chắn muốn vô hiệu hóa tài khoản <span className="font-semibold text-slate-900">@{user.username}</span> ({user.fullName})?
          </p>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-left text-xs text-amber-800 mb-6">
            <strong>Lưu ý US-ADM-01:</strong> Tài khoản có dữ liệu liên quan sẽ được chuyển sang trạng thái <strong>INACTIVE (Vô hiệu hóa)</strong> thay vì xóa cứng khỏi hệ thống để đảm bảo tính toàn vẹn dữ liệu & audit log.
          </div>

          {error && (
            <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-md mb-4">{error}</p>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={submitting}
              className="w-full px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-200 transition"
            >
              Hủy
            </button>
            <button
              onClick={handleDeactivate}
              disabled={submitting}
              className="w-full px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50 transition"
            >
              {submitting ? "Đang xử lý..." : "Xác nhận vô hiệu hóa"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
