"use client";

import { use, useState } from "react";
import Link from "next/link";
import { AuthenticatedShell } from "@/features/auth";
import {
  useModules,
  ModuleListTable,
  ModuleFormModal,
  EditModuleFormModal,
  CourseModule,
} from "@/features/curriculum";

interface CourseModulesPageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default function CourseModulesPage({ params }: CourseModulesPageProps) {
  const resolvedParams = use(params);
  return (
    <AuthenticatedShell
      allowedRoles={["ADMIN"]}
      title="Cấu trúc Lộ trình Khóa học"
      description="Quản lý cấu trúc danh sách Module bài học thuộc khóa học (US-MOD-01, US-MOD-02, US-MOD-03 & US-MOD-04)."
    >
      <CourseModulesContent courseId={resolvedParams.courseId} />
    </AuthenticatedShell>
  );
}

function CourseModulesContent({ courseId }: { courseId: string }) {
  const {
    modules,
    isLoading,
    isSubmitting,
    createModule,
    updateModule,
    reorderModules,
    activateModule,
    deactivateModule,
  } = useModules(courseId);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null);

  return (
    <div className="space-y-6">
      {/* Top Bar with Navigation & Action Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/courses"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
            title="Quay lại danh sách khóa học"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              Khóa học ID: <span className="font-mono text-sm bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg">{courseId}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Danh sách các module được sắp xếp theo thứ tự lộ trình học tập.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-200 transition flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Thêm Module mới
        </button>
      </div>

      {/* Module List Table */}
      <ModuleListTable
        modules={modules}
        isLoading={isLoading}
        isSubmitting={isSubmitting}
        onEdit={(mod) => setEditingModule(mod)}
        onReorder={reorderModules}
        onActivate={activateModule}
        onDeactivate={deactivateModule}
      />

      {/* Add Module Modal */}
      <ModuleFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={createModule}
        isSubmitting={isSubmitting}
      />

      {/* Edit Module Modal */}
      <EditModuleFormModal
        key={editingModule?.id ?? "no-module"}
        isOpen={!!editingModule}
        module={editingModule}
        onClose={() => setEditingModule(null)}
        onSubmit={updateModule}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
