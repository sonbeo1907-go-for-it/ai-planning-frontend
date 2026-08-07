import { CourseResponse } from "../curriculum.types";
import { PageResponse } from "@/types/api";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface CourseListTableProps {
  courses: CourseResponse[];
  pagination: PageResponse<CourseResponse>;
  loading: boolean;
  onPageChange: (page: number) => void;
  onEdit?: (course: CourseResponse) => void;
}

export function CourseListTable({
  courses,
  pagination,
  loading,
  onPageChange,
  onEdit,
}: CourseListTableProps) {
  
  if (loading && courses.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm">Đang tải danh sách khóa học...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Mã khóa học</th>
              <th className="px-6 py-4">Tên khóa học</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4">Ngày tạo</th>
              <th className="px-6 py-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {courses.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <svg className="w-12 h-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <p>Chưa có khóa học nào trong hệ thống.</p>
                  </div>
                </td>
              </tr>
            ) : (
              courses.map((course) => (
                <tr key={course.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-700">
                    {course.code}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{course.name}</div>
                    {course.description && (
                      <div className="text-xs text-slate-500 mt-0.5 truncate max-w-xs" title={course.description}>
                        {course.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {course.status === "ACTIVE" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Đang hoạt động
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        Ngừng hoạt động
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {course.createdAt ? format(new Date(course.createdAt), "dd/MM/yyyy", { locale: vi }) : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onEdit?.(course)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      title="Chỉnh sửa khóa học"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
          <p className="text-sm text-slate-500">
            Hiển thị <span className="font-medium text-slate-900">{pagination.page * pagination.size + 1}</span> đến <span className="font-medium text-slate-900">{Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)}</span> trong số <span className="font-medium text-slate-900">{pagination.totalElements}</span> khóa học
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.first}
              className="p-1 rounded-lg text-slate-500 hover:bg-slate-200 disabled:opacity-50 disabled:hover:bg-transparent transition"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="text-sm font-medium text-slate-700">
              Trang {pagination.page + 1} / {pagination.totalPages}
            </div>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.last}
              className="p-1 rounded-lg text-slate-500 hover:bg-slate-200 disabled:opacity-50 disabled:hover:bg-transparent transition"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
