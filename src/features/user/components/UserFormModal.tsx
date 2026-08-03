"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateUserFormValues,
  createUserSchema,
  UpdateUserFormValues,
  updateUserSchema,
} from "../user.schema";
import { User, CreateUserRequest, UpdateUserRequest } from "../user.types";
import { ApiClientError } from "@/lib/api-client";

interface UserFormModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onSubmitCreate: (payload: CreateUserRequest) => Promise<void>;
  onSubmitUpdate: (id: string, payload: UpdateUserRequest) => Promise<void>;
}

export function UserFormModal({
  isOpen,
  user,
  onClose,
  onSubmitCreate,
  onSubmitUpdate,
}: UserFormModalProps) {
  const isEditMode = Boolean(user);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    formState: { errors: errorsCreate },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      password: "",
      role: "STUDENT",
    },
  });

  const {
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
    reset: resetUpdate,
    formState: { errors: errorsUpdate },
  } = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      fullName: "",
      email: "",
      role: "STUDENT",
      status: "ACTIVE",
      password: "",
    },
  });

  useEffect(() => {
    if (user) {
      resetUpdate({
        fullName: user.fullName || "",
        email: user.email || "",
        role: user.role || "STUDENT",
        status: user.status || "ACTIVE",
        password: "",
      });
    } else {
      resetCreate({
        username: "",
        fullName: "",
        email: "",
        password: "",
        role: "STUDENT",
      });
    }
  }, [user, isOpen, resetCreate, resetUpdate]);

  if (!isOpen) return null;

  const handleClose = () => {
    setServerError(null);
    onClose();
  };

  const handleCreate = async (values: CreateUserFormValues) => {
    setSubmitting(true);
    setServerError(null);
    try {
      await onSubmitCreate(values);
      handleClose();
    } catch (err) {
      if (err instanceof ApiClientError) {
        setServerError(err.message);
      } else {
        setServerError("Tạo tài khoản thất bại. Vui lòng kiểm tra lại.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (values: UpdateUserFormValues) => {
    if (!user) return;
    setSubmitting(true);
    setServerError(null);
    try {
      await onSubmitUpdate(user.id, values);
      handleClose();
    } catch (err) {
      if (err instanceof ApiClientError) {
        setServerError(err.message);
      } else {
        setServerError("Cập nhật thông tin thất bại. Vui lòng thử lại.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">
            {isEditMode ? `Cập nhật người dùng: @${user?.username}` : "Tạo người dùng mới"}
          </h3>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {serverError && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{serverError}</span>
            </div>
          )}

          {!isEditMode ? (
            <form onSubmit={handleSubmitCreate(handleCreate)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mã / Tên đăng nhập <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: student01"
                  {...registerCreate("username")}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
                {errorsCreate.username && (
                  <p className="mt-1 text-xs text-rose-500">{errorsCreate.username.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Họ và tên <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  {...registerCreate("fullName")}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
                {errorsCreate.fullName && (
                  <p className="mt-1 text-xs text-rose-500">{errorsCreate.fullName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  {...registerCreate("email")}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
                {errorsCreate.email && (
                  <p className="mt-1 text-xs text-rose-500">{errorsCreate.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mật khẩu (Tùy chọn, mặc định nếu để trống)
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...registerCreate("password")}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
                {errorsCreate.password && (
                  <p className="mt-1 text-xs text-rose-500">{errorsCreate.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Vai trò hệ thống <span className="text-rose-500">*</span>
                </label>
                <select
                  {...registerCreate("role")}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                >
                  <option value="STUDENT">Học viên (Student)</option>
                  <option value="INSTRUCTOR">Giảng viên (Instructor)</option>
                  <option value="ADMIN">Quản trị viên (Admin)</option>
                </select>
                {errorsCreate.role && (
                  <p className="mt-1 text-xs text-rose-500">{errorsCreate.role.message}</p>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-200 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50 transition"
                >
                  {submitting ? "Đang tạo..." : "Tạo người dùng"}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmitUpdate(handleUpdate)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Họ và tên <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  {...registerUpdate("fullName")}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
                {errorsUpdate.fullName && (
                  <p className="mt-1 text-xs text-rose-500">{errorsUpdate.fullName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  {...registerUpdate("email")}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
                {errorsUpdate.email && (
                  <p className="mt-1 text-xs text-rose-500">{errorsUpdate.email.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Vai trò
                  </label>
                  <select
                    {...registerUpdate("role")}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  >
                    <option value="STUDENT">Học viên</option>
                    <option value="INSTRUCTOR">Giảng viên</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    {...registerUpdate("status")}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  >
                    <option value="ACTIVE">Hoạt động (Active)</option>
                    <option value="INACTIVE">Vô hiệu hóa (Inactive)</option>
                    <option value="LOCKED">Khóa (Locked)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Đổi mật khẩu mới (Nếu muốn thay đổi)
                </label>
                <input
                  type="password"
                  placeholder="Để trống nếu giữ nguyên"
                  {...registerUpdate("password")}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
                {errorsUpdate.password && (
                  <p className="mt-1 text-xs text-rose-500">{errorsUpdate.password.message}</p>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-200 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50 transition"
                >
                  {submitting ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
