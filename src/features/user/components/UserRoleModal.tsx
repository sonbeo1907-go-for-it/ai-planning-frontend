"use client";

import { useState } from "react";
import { UserRole } from "@/features/auth/auth.types";
import { User } from "../user.types";
import { ApiClientError } from "@/lib/api-client";

interface UserRoleModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: (id: string, newRole: UserRole) => Promise<void>;
}

export function UserRoleModal({
  isOpen,
  user,
  onClose,
  onConfirm,
}: UserRoleModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>("STUDENT");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !user) return null;

  const currentRole = user.role;

  const handleRoleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === currentRole) {
      onClose();
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await onConfirm(user.id, selectedRole);
      onClose();
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError("Đã xảy ra lỗi khi thay đổi vai trò.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <h3 className="text-lg font-bold text-slate-800">Thay đổi vai trò người dùng</h3>
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

        <form onSubmit={handleRoleChange} className="space-y-4">
          <div>
            <p className="text-sm text-slate-600 mb-1">
              Người dùng: <span className="font-semibold text-slate-800">{user.fullName}</span> (@{user.username})
            </p>
            <p className="text-xs text-slate-500">
              Vai trò hiện tại: <span className="font-medium text-indigo-600">{currentRole === "STUDENT" ? "Học viên" : currentRole === "INSTRUCTOR" ? "Giảng viên" : "Admin"}</span>
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">
              Chọn vai trò mới
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition hover:bg-slate-50 border-slate-200">
                <input
                  type="radio"
                  name="userRole"
                  value="STUDENT"
                  checked={selectedRole === "STUDENT"}
                  onChange={() => setSelectedRole("STUDENT")}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <div className="text-sm font-semibold text-slate-800">Học viên</div>
                  <div className="text-xs text-slate-500">Tham gia các khóa học và lộ trình đào tạo.</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition hover:bg-slate-50 border-slate-200">
                <input
                  type="radio"
                  name="userRole"
                  value="INSTRUCTOR"
                  checked={selectedRole === "INSTRUCTOR"}
                  onChange={() => setSelectedRole("INSTRUCTOR")}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <div className="text-sm font-semibold text-slate-800">Giảng viên</div>
                  <div className="text-xs text-slate-500">Quản lý và hướng dẫn nội dung bài học.</div>
                </div>
              </label>
            </div>
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
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition disabled:opacity-50 flex items-center gap-2"
            >
              {submitting && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
