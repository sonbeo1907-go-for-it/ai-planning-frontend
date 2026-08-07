"use client";

import { useEffect, useState } from "react";
import { UpdateModuleFormValues, updateModuleSchema } from "../curriculum.schema";
import { CourseModule, UpdateModuleInput } from "../curriculum.types";

interface EditModuleFormModalProps {
  isOpen: boolean;
  module: CourseModule | null;
  onClose: () => void;
  onSubmit: (moduleId: string, values: UpdateModuleInput) => Promise<boolean>;
  isSubmitting?: boolean;
}

export function EditModuleFormModal({
  isOpen,
  module,
  onClose,
  onSubmit,
  isSubmitting = false,
}: EditModuleFormModalProps) {
  const [formValues, setFormValues] = useState<UpdateModuleFormValues>({
    name: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (module) {
      setFormValues({
        name: module.name || "",
        description: module.description || "",
      });
      setErrors({});
      setSubmitError(null);
    }
  }, [module]);

  if (!isOpen || !module) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const validation = updateModuleSchema.safeParse(formValues);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    const success = await onSubmit(module.id, {
      name: validation.data.name.trim(),
      description: validation.data.description?.trim() || undefined,
    });

    if (success) {
      onClose();
    } else {
      setSubmitError("Cập nhật module thất bại. Vui lòng kiểm tra kết nối mạng.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/10 rounded-lg">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg">Chỉnh sửa Module bài học (US-MOD-02)</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {submitError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm">
              {submitError}
            </div>
          )}

          {/* Module Code (Readonly) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Mã Module (Không thể thay đổi)
            </label>
            <input
              type="text"
              disabled
              value={module.code}
              className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-mono text-slate-600 cursor-not-allowed"
            />
          </div>

          {/* Module Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Tên Module <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="VD: Lập trình Java Core căn bản"
              value={formValues.name}
              onChange={handleChange}
              className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 transition ${
                errors.name
                  ? "border-rose-400 focus:ring-rose-400"
                  : "border-slate-200 focus:ring-amber-500 focus:bg-white"
              }`}
            />
            {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
          </div>

          {/* Module Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Mô tả Phạm vi Module
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="Nhập mô tả cập nhật cho module này..."
              value={formValues.description || ""}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-rose-500">{errors.description}</p>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium shadow-md shadow-amber-200 transition disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
