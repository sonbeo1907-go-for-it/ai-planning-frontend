"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClassSchema } from "../curriculum.schema";
import type { CreateClassRequest } from "../curriculum.types";
import { useActiveCourses } from "../hooks/useActiveCourses";
import { z } from "zod";

type CreateClassFormValues = z.infer<typeof createClassSchema>;

interface CreateClassFormProps {
  onSubmit: (payload: CreateClassRequest) => void;
  onCancel: () => void;
  submitting: boolean;
}

export function CreateClassForm({ onSubmit, onCancel, submitting }: CreateClassFormProps) {
  const { courses, loading: loadingCourses } = useActiveCourses();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateClassFormValues>({
    resolver: zodResolver(createClassSchema),
    defaultValues: {
      courseId: "",
      code: "",
      name: "",
      description: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="courseId" className="block text-xs font-semibold text-slate-700 mb-1">
          Khóa học <span className="text-rose-500">*</span>
        </label>
        <select
          id="courseId"
          {...register("courseId")}
          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          disabled={loadingCourses || submitting}
        >
          <option value="">
            {loadingCourses ? "Đang tải danh sách khóa học..." : "-- Chọn khóa học --"}
          </option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.code} - {course.name}
            </option>
          ))}
        </select>
        {errors.courseId && (
          <p className="mt-1 text-xs text-rose-500">{errors.courseId.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="code" className="block text-xs font-semibold text-slate-700 mb-1">
          Mã lớp học <span className="text-rose-500">*</span>
        </label>
        <input
          id="code"
          type="text"
          placeholder="Ví dụ: JAV101-01"
          {...register("code")}
          disabled={submitting}
          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
        />
        {errors.code && (
          <p className="mt-1 text-xs text-rose-500">{errors.code.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="name" className="block text-xs font-semibold text-slate-700 mb-1">
          Tên lớp học <span className="text-rose-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          placeholder="Ví dụ: Java Basic K1"
          {...register("name")}
          disabled={submitting}
          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-rose-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-xs font-semibold text-slate-700 mb-1">
          Mô tả
        </label>
        <textarea
          id="description"
          placeholder="Mô tả lớp học..."
          {...register("description")}
          disabled={submitting}
          rows={3}
          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
        />
        {errors.description && (
          <p className="mt-1 text-xs text-rose-500">{errors.description.message}</p>
        )}
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
          {submitting ? "Đang lưu..." : "Tạo lớp học"}
        </button>
      </div>
    </form>
  );
}
