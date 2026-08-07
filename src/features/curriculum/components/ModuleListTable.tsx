"use client";

import { CourseModule, ModuleOrderItemInput } from "../curriculum.types";

interface ModuleListTableProps {
  modules: CourseModule[];
  isLoading?: boolean;
  isSubmitting?: boolean;
  onEdit?: (module: CourseModule) => void;
  onReorder?: (items: ModuleOrderItemInput[]) => Promise<boolean> | void;
  onActivate?: (moduleId: string) => Promise<boolean> | void;
  onDeactivate?: (moduleId: string) => Promise<boolean> | void;
}

export function ModuleListTable({
  modules,
  isLoading = false,
  isSubmitting = false,
  onEdit,
  onReorder,
  onActivate,
  onDeactivate,
}: ModuleListTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-12 border border-slate-100 shadow-sm text-center">
        <div className="inline-block p-4 bg-indigo-50 text-indigo-600 rounded-full mb-3 animate-bounce">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <p className="text-slate-500 text-sm font-medium">Đang tải cấu trúc bài học...</p>
      </div>
    );
  }

  if (modules.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 border border-slate-100 shadow-sm text-center">
        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h4 className="text-slate-800 font-semibold mb-1">Chưa có Module nào trong Khóa học này</h4>
        <p className="text-slate-500 text-sm max-w-md mx-auto">
          Nhấp vào nút <span className="font-semibold text-indigo-600">+ Thêm Module mới</span> ở trên để xây dựng cấu trúc bài học cho lộ trình này.
        </p>
      </div>
    );
  }

  const handleMove = (index: number, direction: "UP" | "DOWN") => {
    if (!onReorder || isSubmitting) return;

    const targetIndex = direction === "UP" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= modules.length) return;

    const newModulesList = [...modules];
    const temp = newModulesList[index];
    newModulesList[index] = newModulesList[targetIndex];
    newModulesList[targetIndex] = temp;

    const reorderedItems: ModuleOrderItemInput[] = newModulesList.map((mod, idx) => ({
      moduleId: mod.id,
      sequenceNumber: idx + 1,
    }));

    onReorder(reorderedItems);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4 w-28 text-center">Thứ tự</th>
              <th className="py-3.5 px-4">Mã Module</th>
              <th className="py-3.5 px-4">Tên Module</th>
              <th className="py-3.5 px-4">Mô tả</th>
              <th className="py-3.5 px-4">Trạng thái</th>
              <th className="py-3.5 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {modules.map((mod, index) => (
              <tr
                key={mod.id}
                className={`transition ${
                  mod.status === "INACTIVE" ? "bg-slate-50/50 opacity-75" : "hover:bg-slate-50/70"
                }`}
              >
                <td className="py-4 px-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    {onReorder && (
                      <div className="flex flex-col gap-0.5">
                        <button
                          type="button"
                          disabled={index === 0 || isSubmitting}
                          onClick={() => handleMove(index, "UP")}
                          title="Di chuyển lên trên"
                          className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 rounded transition"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          disabled={index === modules.length - 1 || isSubmitting}
                          onClick={() => handleMove(index, "DOWN")}
                          title="Di chuyển xuống dưới"
                          className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 rounded transition"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    )}
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-bold text-xs ${
                        mod.status === "INACTIVE"
                          ? "bg-slate-200 text-slate-600"
                          : "bg-indigo-50 text-indigo-700"
                      }`}
                    >
                      #{mod.sequenceNumber}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 font-semibold text-slate-800">
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-mono text-xs">
                    {mod.code}
                  </span>
                </td>
                <td className="py-4 px-4 font-medium text-slate-900">{mod.name}</td>
                <td className="py-4 px-4 text-slate-500 max-w-xs truncate">
                  {mod.description || "—"}
                </td>
                <td className="py-4 px-4">
                  {mod.status === "ACTIVE" ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Hoạt động
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                      Tạm ngưng
                    </span>
                  )}
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(mod)}
                        className="px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/60 rounded-xl text-xs font-semibold transition inline-flex items-center gap-1"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Sửa
                      </button>
                    )}

                    {mod.status === "ACTIVE" && onDeactivate && (
                      <button
                        disabled={isSubmitting}
                        onClick={() => onDeactivate(mod.id)}
                        className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/60 rounded-xl text-xs font-semibold transition inline-flex items-center gap-1 disabled:opacity-50"
                        title="Ngừng sử dụng module này"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                        Ngừng sử dụng
                      </button>
                    )}

                    {mod.status === "INACTIVE" && onActivate && (
                      <button
                        disabled={isSubmitting}
                        onClick={() => onActivate(mod.id)}
                        className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60 rounded-xl text-xs font-semibold transition inline-flex items-center gap-1 disabled:opacity-50"
                        title="Kích hoạt lại module này"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Kích hoạt lại
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
