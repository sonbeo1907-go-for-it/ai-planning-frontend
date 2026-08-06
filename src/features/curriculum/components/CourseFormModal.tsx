"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCourseSchema } from "../curriculum.schema";
import { CreateCourseRequest } from "../curriculum.types";
import { ApiClientError } from "@/lib/api-client";
import { z } from "zod";

type CreateCourseFormValues = z.infer<typeof createCourseSchema>;

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitCreate: (payload: CreateCourseRequest) => Promise<void>;
}

export function CourseFormModal({
  isOpen,
  onClose,
  onSubmitCreate,
}: CourseFormModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCourseFormValues>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      status: "ACTIVE",
    },
  });

  if (!isOpen) return null;

  const handleClose = () => {
    setServerError(null);
    reset();
    onClose();
  };

  const handleCreate = async (values: CreateCourseFormValues) => {
    setSubmitting(true);
    setServerError(null);
    try {
      await onSubmitCreate(values);
      handleClose();
    } catch (err) {
      if (err instanceof ApiClientError) {
        setServerError(err.message);
      } else {
        setServerError("Tạo khóa học thất bại. Vui lòng kiểm tra lại.");
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
            Tạo khóa học mới
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

          <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mã khóa học <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ví dụ: JAV101"
                {...register("code")}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
              {errors.code && (
                <p className="mt-1 text-xs text-rose-500">{errors.code.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tên khóa học <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Java Basic"
                {...register("name")}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-rose-500">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mô tả
              </label>
              <textarea
                placeholder="Mô tả khóa học..."
                {...register("description")}
                rows={3}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
              {errors.description && (
                <p className="mt-1 text-xs text-rose-500">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Trạng thái <span className="text-rose-500">*</span>
              </label>
              <select
                {...register("status")}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              >
                <option value="ACTIVE">Hoạt động (Active)</option>
                <option value="INACTIVE">Ngừng hoạt động (Inactive)</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-xs text-rose-500">{errors.status.message}</p>
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
                {submitting ? "Đang lưu..." : "Tạo khóa học"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
