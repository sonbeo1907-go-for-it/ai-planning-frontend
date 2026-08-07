"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateClassSchema } from "../curriculum.schema";
import type { UpdateClassRequest, ClassResponse } from "../curriculum.types";
import { z } from "zod";

type UpdateClassFormValues = z.infer<typeof updateClassSchema>;

interface UpdateClassFormProps {
  cls: ClassResponse;
  onSubmit: (payload: UpdateClassRequest) => void;
  onCancel: () => void;
  submitting: boolean;
}

export function UpdateClassForm({ cls, onSubmit, onCancel, submitting }: UpdateClassFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateClassFormValues>({
    resolver: zodResolver(updateClassSchema),
    defaultValues: {
      name: "",
      description: "",
      openedAt: "",
      closedAt: "",
      version: 0,
    },
  });

  useEffect(() => {
    reset({
      name: cls.name || "",
      description: cls.description || "",
      openedAt: cls.openedAt ? new Date(cls.openedAt).toISOString().split('T')[0] : "",
      closedAt: cls.closedAt ? new Date(cls.closedAt).toISOString().split('T')[0] : "",
      version: cls.version || 0,
    });
  }, [cls, reset]);

  const handleUpdate = (values: UpdateClassFormValues) => {
    const payload: UpdateClassRequest = {
      ...values,
      openedAt: values.openedAt ? new Date(values.openedAt).toISOString() : undefined,
      closedAt: values.closedAt ? new Date(values.closedAt).toISOString() : undefined,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Khóa học & Mã lớp
        </label>
        <input
          type="text"
          value={cls.code ?? ""}
          disabled
          className="w-full px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed"
        />
      </div>

      <div>
        <label htmlFor="update_name" className="block text-xs font-semibold text-slate-700 mb-1">
          Tên lớp học <span className="text-rose-500">*</span>
        </label>
        <input
          id="update_name"
          type="text"
          {...register("name")}
          disabled={submitting}
          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-rose-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="update_description" className="block text-xs font-semibold text-slate-700 mb-1">
          Mô tả
        </label>
        <textarea
          id="update_description"
          {...register("description")}
          disabled={submitting}
          rows={3}
          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
        />
        {errors.description && (
          <p className="mt-1 text-xs text-rose-500">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="openedAt" className="block text-xs font-semibold text-slate-700 mb-1">
            Ngày mở
          </label>
          <input
            id="openedAt"
            type="date"
            {...register("openedAt")}
            disabled={submitting}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
          {errors.openedAt && (
            <p className="mt-1 text-xs text-rose-500">{errors.openedAt.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="closedAt" className="block text-xs font-semibold text-slate-700 mb-1">
            Ngày đóng
          </label>
          <input
            id="closedAt"
            type="date"
            {...register("closedAt")}
            disabled={submitting}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
          {errors.closedAt && (
            <p className="mt-1 text-xs text-rose-500">{errors.closedAt.message}</p>
          )}
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
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
  );
}
