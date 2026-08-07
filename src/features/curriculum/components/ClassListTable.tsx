"use client";

import { ClassResponse } from "../curriculum.types";
import { PageResponse } from "@/types/api";

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
  }).format(date);
}

interface ClassListTableProps {
  classes: ClassResponse[];
  pagination: PageResponse<ClassResponse>;
  loading: boolean;
  onPageChange: (page: number) => void;
  onEdit: (cls: ClassResponse) => void;
  onChangeStatus?: (cls: ClassResponse, action: "OPEN" | "CLOSE") => void;
}

const statusBadgeConfig: Record<string, { label: string; className: string }> = {
  PLANNED: {
    label: "Sắp mở",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  ACTIVE: {
    label: "Đang mở",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  CLOSED: {
    label: "Đã đóng",
    className: "bg-slate-100 text-slate-600 border-slate-200",
  },
};

export function ClassListTable({
  classes,
  pagination,
  loading,
  onPageChange,
  onEdit,
  onChangeStatus,
}: ClassListTableProps) {
  if (loading && classes.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent mb-3"></div>
        <p className="text-sm text-slate-500 font-medium">Đang tải danh sách lớp học...</p>
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
        <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <p className="text-base font-semibold text-slate-700">Không tìm thấy lớp học nào</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-4">Mã / Tên Lớp</th>
              <th className="py-3.5 px-4">Khóa học ID</th>
              <th className="py-3.5 px-4">Trạng thái</th>
              <th className="py-3.5 px-4">Ngày mở - đóng</th>
              <th className="py-3.5 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {classes.map((cls) => {
              const statusBadge = statusBadgeConfig[cls.status] || {
                label: cls.status,
                className: "bg-gray-100 text-gray-700",
              };

              return (
                <tr key={cls.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4">
                    <div>
                      <div className="font-semibold text-slate-800">{cls.name}</div>
                      <div className="text-xs text-slate-500 font-mono">{cls.code}</div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono text-xs">{cls.courseId.substring(0, 8)}...</td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusBadge.className}`}>
                      {statusBadge.label}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 text-xs">
                    <div>Mở: {cls.openedAt ? formatDate(cls.openedAt) : "N/A"}</div>
                    <div>Đóng: {cls.closedAt ? formatDate(cls.closedAt) : "N/A"}</div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Context-aware Status Action Button */}
                      {cls.status === "PLANNED" && onChangeStatus && (
                        <button
                          onClick={() => onChangeStatus(cls, "OPEN")}
                          className="p-1.5 text-emerald-600 hover:text-white hover:bg-emerald-500 rounded-md transition border border-emerald-200 hover:border-transparent flex items-center justify-center"
                          title="Mở lớp học"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      )}
                      
                      {cls.status === "ACTIVE" && onChangeStatus && (
                        <button
                          onClick={() => onChangeStatus(cls, "CLOSE")}
                          className="p-1.5 text-rose-600 hover:text-white hover:bg-rose-500 rounded-md transition border border-rose-200 hover:border-transparent flex items-center justify-center"
                          title="Đóng lớp học"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6v4H9z" />
                          </svg>
                        </button>
                      )}

                      <button
                        onClick={() => onEdit(cls)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition border border-transparent"
                        title="Chỉnh sửa thông tin"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 flex items-center justify-between">
        <div className="text-xs text-slate-500">
          Hiển thị trang <span className="font-semibold text-slate-700">{pagination.page + 1}</span> /{" "}
          <span className="font-semibold text-slate-700">{pagination.totalPages || 1}</span> (Tổng số{" "}
          <span className="font-semibold text-slate-700">{pagination.totalElements}</span> lớp học)
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.first || loading}
            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition"
          >
            Trang trước
          </button>
          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.last || loading}
            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition"
          >
            Trang sau
          </button>
        </div>
      </div>
    </div>
  );
}
