import { Pencil, Power, PowerOff } from "lucide-react";

import { Button, LoadingState, StatusBadge } from "@/components/ui";
import type { PageResponse } from "@/types/api";
import { cn } from "@/utils/cn";

import type { CourseResponse } from "../curriculum.types";

export interface CourseListTableProps {
  courses: CourseResponse[];
  pagination: PageResponse<CourseResponse>;
  loading: boolean;
  onPageChange: (page: number) => void;
  onEdit: (course: CourseResponse) => void;
  onStatusChange: (course: CourseResponse) => void;
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
  }).format(date);
}

export function CourseListTable({
  courses,
  pagination,
  loading,
  onPageChange,
  onEdit,
  onStatusChange,
}: CourseListTableProps) {
  if (loading && courses.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <LoadingState
          className="min-h-80"
          label="Đang tải danh sách khóa học"
        />
      </div>
    );
  }

  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm",
        loading && "opacity-70",
      )}
      aria-busy={loading}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[780px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
            <tr>
              <th className="px-5 py-3 font-semibold">Mã khóa học</th>
              <th className="px-5 py-3 font-semibold">Tên và mô tả</th>
              <th className="px-5 py-3 font-semibold">Trạng thái</th>
              <th className="px-5 py-3 font-semibold">Cập nhật</th>
              <th className="px-5 py-3 text-right font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {courses.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-14 text-center">
                  <p className="font-medium text-slate-700">
                    Không tìm thấy khóa học phù hợp.
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Thử thay đổi từ khóa hoặc bộ lọc trạng thái.
                  </p>
                </td>
              </tr>
            ) : courses.map((course) => (
              <tr key={course.id} className="align-top hover:bg-slate-50/70">
                <td className="px-5 py-4 font-mono text-xs font-semibold text-slate-700">
                  {course.code}
                </td>
                <td className="max-w-md px-5 py-4">
                  <p className="font-semibold text-slate-950">{course.name}</p>
                  <p
                    className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500"
                    title={course.description ?? undefined}
                  >
                    {course.description || "Chưa có mô tả"}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge
                    tone={course.status === "ACTIVE" ? "success" : "neutral"}
                  >
                    {course.status === "ACTIVE"
                      ? "Đang hoạt động"
                      : "Ngừng hoạt động"}
                  </StatusBadge>
                </td>
                <td className="px-5 py-4 text-slate-600">
                  <p>{formatDate(course.updatedAt)}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Phiên bản {course.version}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="secondary"
                      className="min-h-9 px-3"
                      onClick={() => onEdit(course)}
                    >
                      <Pencil className="size-4" aria-hidden="true" />
                      Sửa
                    </Button>
                    <Button
                      variant={course.status === "ACTIVE" ? "danger" : "ghost"}
                      className="min-h-9 px-3"
                      onClick={() => onStatusChange(course)}
                    >
                      {course.status === "ACTIVE" ? (
                        <PowerOff className="size-4" aria-hidden="true" />
                      ) : (
                        <Power className="size-4" aria-hidden="true" />
                      )}
                      {course.status === "ACTIVE" ? "Ngừng" : "Mở lại"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <footer className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            {pagination.totalElements} khóa học · Trang {pagination.page + 1}/
            {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="min-h-9"
              disabled={pagination.first || loading}
              onClick={() => onPageChange(pagination.page - 1)}
            >
              Trang trước
            </Button>
            <Button
              variant="secondary"
              className="min-h-9"
              disabled={pagination.last || loading}
              onClick={() => onPageChange(pagination.page + 1)}
            >
              Trang sau
            </Button>
          </div>
        </footer>
      )}
    </section>
  );
}
