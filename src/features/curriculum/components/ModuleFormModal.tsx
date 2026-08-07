"use client";

import { useState } from "react";
import { CreateModuleFormValues, createModuleSchema } from "../curriculum.schema";
import { CreateModuleInput } from "../curriculum.types";

interface ModuleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    values: CreateModuleInput
  ) => Promise<boolean | { success: boolean; error?: string }>;
  isSubmitting?: boolean;
}

export function ModuleFormModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}: ModuleFormModalProps) {
  const [formValues, setFormValues] = useState<CreateModuleFormValues>({
    code: "",
    name: "",
    description: "",
    sequenceNumber: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: name === "sequenceNumber" ? (value ? Number(value) : undefined) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const validation = createModuleSchema.safeParse(formValues);
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

    const result = await onSubmit({
      code: validation.data.code.trim().toUpperCase(),
      name: validation.data.name.trim(),
      description: validation.data.description?.trim() || undefined,
      sequenceNumber: validation.data.sequenceNumber,
    });

    const isSuccess = typeof result === "boolean" ? result : result.success;
    const rawError = typeof result === "object" ? result.error : undefined;

    if (isSuccess) {
      setFormValues({ code: "", name: "", description: "", sequenceNumber: undefined });
      setErrors({});
      onClose();
    } else {
      if (rawError && (rawError.includes("Sequence number") || rawError.includes("already taken"))) {
        setSubmitError(
          `Thứ tự vị trí (sequence_number = ${validation.data.sequenceNumber}) đã tồn tại trong khóa học này. Vui lòng chọn vị trí khác hoặc để trống để tự động gán vị trí cuối.`
        );
      } else if (rawError && (rawError.includes("already exists") || rawError.includes("MODULE_CODE_ALREADY_EXISTS"))) {
        setSubmitError(`Mã Module "${validation.data.code}" đã tồn tại trong khóa học này. Vui lòng nhập mã khác.`);
      } else {
        setSubmitError(rawError || "Không thể tạo module. Vui lòng kiểm tra dữ liệu và thử lại.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/10 rounded-lg">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg">Thêm Module mới vào Khóa học</h3>
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

          {/* Module Code & Sequence Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Mã Module <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="code"
                placeholder="VD: JAVA_CORE"
                value={formValues.code}
                onChange={handleChange}
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 transition ${
                  errors.code
                    ? "border-rose-400 focus:ring-rose-400"
                    : "border-slate-200 focus:ring-indigo-500 focus:bg-white"
                }`}
              />
              {errors.code && <p className="mt-1 text-xs text-rose-500">{errors.code}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Thứ tự Lộ trình
              </label>
              <input
                type="number"
                name="sequenceNumber"
                placeholder="Tự động nếu để trống"
                min={1}
                value={formValues.sequenceNumber || ""}
                onChange={handleChange}
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 transition ${
                  errors.sequenceNumber
                    ? "border-rose-400 focus:ring-rose-400"
                    : "border-slate-200 focus:ring-indigo-500 focus:bg-white"
                }`}
              />
              {errors.sequenceNumber && (
                <p className="mt-1 text-xs text-rose-500">{errors.sequenceNumber}</p>
              )}
            </div>
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
                  : "border-slate-200 focus:ring-indigo-500 focus:bg-white"
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
              placeholder="Nhập tổng quan nội dung hoặc phạm vi học tập của module này..."
              value={formValues.description || ""}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
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
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium shadow-md shadow-indigo-200 transition disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              {isSubmitting ? "Đang lưu..." : "Thêm Module"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
