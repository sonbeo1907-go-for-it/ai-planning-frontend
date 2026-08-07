"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClassSchema, updateClassSchema } from "../curriculum.schema";
import { CreateClassRequest, UpdateClassRequest, CourseResponse, ClassResponse } from "../curriculum.types";
import { curriculumService } from "../curriculum.service";
import { ApiClientError } from "@/lib/api-client";
import { z } from "zod";

type CreateClassFormValues = z.infer<typeof createClassSchema>;
type UpdateClassFormValues = z.infer<typeof updateClassSchema>;

interface ClassFormModalProps {
  isOpen: boolean;
  cls: ClassResponse | null;
  onClose: () => void;
  onSubmitCreate?: (payload: CreateClassRequest) => Promise<void>;
  onSubmitUpdate?: (id: string, payload: UpdateClassRequest) => Promise<void>;
}

export function ClassFormModal({
  isOpen,
  cls,
  onClose,
  onSubmitCreate,
  onSubmitUpdate,
}: ClassFormModalProps) {
  const isEditMode = Boolean(cls);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    formState: { errors: errorsCreate },
  } = useForm<CreateClassFormValues>({
    resolver: zodResolver(createClassSchema),
    defaultValues: {
      courseId: "",
      code: "",
      name: "",
      description: "",
      status: "PLANNED",
    },
  });

  const {
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
    reset: resetUpdate,
    formState: { errors: errorsUpdate },
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
    if (isOpen) {
      if (!isEditMode) {
        const fetchCourses = async () => {
          setLoadingCourses(true);
          try {
            const response = await curriculumService.getCourses({
              page: 0,
              size: 100,
              status: "ACTIVE",
            });
            setCourses(response.data.content || []);
          } catch (error) {
            console.error("Failed to fetch courses:", error);
          } finally {
            setLoadingCourses(false);
          }
        };
        fetchCourses();
      }
    }
  }, [isOpen, isEditMode]);

  useEffect(() => {
    if (cls) {
      resetUpdate({
        name: cls.name || "",
        description: cls.description || "",
        openedAt: cls.openedAt ? new Date(cls.openedAt).toISOString().split('T')[0] : "",
        closedAt: cls.closedAt ? new Date(cls.closedAt).toISOString().split('T')[0] : "",
        version: cls.version || 0,
      });
    } else {
      resetCreate({
        courseId: "",
        code: "",
        name: "",
        description: "",
        status: "PLANNED",
      });
    }
  }, [cls, isOpen, resetCreate, resetUpdate]);

  if (!isOpen) return null;

  const handleClose = () => {
    setServerError(null);
    onClose();
  };

  const handleCreate = async (values: CreateClassFormValues) => {
    if (!onSubmitCreate) return;
    setSubmitting(true);
    setServerError(null);
    try {
      await onSubmitCreate(values);
      handleClose();
    } catch (err) {
      if (err instanceof ApiClientError) {
        setServerError(err.message);
      } else {
        setServerError("Tạo lớp học thất bại. Vui lòng kiểm tra lại.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (values: UpdateClassFormValues) => {
    if (!cls || !onSubmitUpdate) return;
    setSubmitting(true);
    setServerError(null);
    
    // Convert empty string to undefined/null for dates before sending
    const payload: UpdateClassRequest = {
      ...values,
      openedAt: values.openedAt ? new Date(values.openedAt).toISOString() : undefined,
      closedAt: values.closedAt ? new Date(values.closedAt).toISOString() : undefined,
    };
    
    try {
      await onSubmitUpdate(cls.id, payload);
      handleClose();
    } catch (err) {
      if (err instanceof ApiClientError) {
        // Special case for optimistic locking conflict
        if (err.status === 409 && err.message.includes("lock")) {
           setServerError("Dữ liệu đã bị thay đổi bởi người khác. Vui lòng làm mới trang (F5) và thử lại.");
        } else {
           setServerError(err.message);
        }
      } else {
        setServerError("Cập nhật lớp học thất bại. Vui lòng kiểm tra lại.");
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
            {isEditMode ? `Cập nhật lớp học: ${cls?.code}` : "Tạo lớp học mới"}
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
                <label htmlFor="courseId" className="block text-xs font-semibold text-slate-700 mb-1">
                  Khóa học <span className="text-rose-500">*</span>
                </label>
                <select
                  id="courseId"
                  {...registerCreate("courseId")}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  disabled={loadingCourses}
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
                {errorsCreate.courseId && (
                  <p className="mt-1 text-xs text-rose-500">{errorsCreate.courseId.message}</p>
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
                  {...registerCreate("code")}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
                {errorsCreate.code && (
                  <p className="mt-1 text-xs text-rose-500">{errorsCreate.code.message}</p>
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
                  {...registerCreate("name")}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
                {errorsCreate.name && (
                  <p className="mt-1 text-xs text-rose-500">{errorsCreate.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-xs font-semibold text-slate-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  id="description"
                  placeholder="Mô tả lớp học..."
                  {...registerCreate("description")}
                  rows={3}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
                {errorsCreate.description && (
                  <p className="mt-1 text-xs text-rose-500">{errorsCreate.description.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="status" className="block text-xs font-semibold text-slate-700 mb-1">
                  Trạng thái <span className="text-rose-500">*</span>
                </label>
                <select
                  id="status"
                  {...registerCreate("status")}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                >
                  <option value="PLANNED">Dự kiến (Planned)</option>
                  <option value="ACTIVE">Đang diễn ra (Active)</option>
                  <option value="CLOSED">Đã kết thúc (Closed)</option>
                </select>
                {errorsCreate.status && (
                  <p className="mt-1 text-xs text-rose-500">{errorsCreate.status.message}</p>
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
                  {submitting ? "Đang lưu..." : "Tạo lớp học"}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmitUpdate(handleUpdate)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Khóa học & Mã lớp
                </label>
                <input
                  type="text"
                  value={cls?.code ?? ""}
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
                  {...registerUpdate("name")}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
                {errorsUpdate.name && (
                  <p className="mt-1 text-xs text-rose-500">{errorsUpdate.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="update_description" className="block text-xs font-semibold text-slate-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  id="update_description"
                  {...registerUpdate("description")}
                  rows={3}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
                {errorsUpdate.description && (
                  <p className="mt-1 text-xs text-rose-500">{errorsUpdate.description.message}</p>
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
                    {...registerUpdate("openedAt")}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                  {errorsUpdate.openedAt && (
                    <p className="mt-1 text-xs text-rose-500">{errorsUpdate.openedAt.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="closedAt" className="block text-xs font-semibold text-slate-700 mb-1">
                    Ngày đóng
                  </label>
                  <input
                    id="closedAt"
                    type="date"
                    {...registerUpdate("closedAt")}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                  {errorsUpdate.closedAt && (
                    <p className="mt-1 text-xs text-rose-500">{errorsUpdate.closedAt.message}</p>
                  )}
                </div>
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
