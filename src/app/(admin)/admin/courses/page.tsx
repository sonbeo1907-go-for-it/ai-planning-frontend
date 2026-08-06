"use client";

import { useState } from "react";
import { CourseFormModal } from "@/features/curriculum/components/CourseFormModal";
import { CourseListTable } from "@/features/curriculum/components/CourseListTable";
import { useCourses } from "@/features/curriculum/hooks/useCourses";
import { AuthenticatedShell } from "@/features/auth";
import { toast } from "sonner";

export default function CoursesPage() {
  return (
    <AuthenticatedShell
      allowedRoles={["ADMIN"]}
      title="Quản lý Khóa học"
      description="Quản lý danh mục các khóa học trong hệ thống."
    >
      <CoursesContent />
    </AuthenticatedShell>
  );
}

function CoursesContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const {
    courses,
    loading,
    error,
    pagination,
    fetchCourses,
    handleCreateCourse,
  } = useCourses();

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center gap-2">
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tạo Khóa học
        </button>
      </div>

      <CourseListTable
        courses={courses}
        pagination={pagination}
        loading={loading}
        onPageChange={fetchCourses}
        onEdit={(course) => {
          toast.info(`Tính năng chỉnh sửa khóa học ${course.code} sẽ được phát triển ở các User Story tiếp theo.`);
        }}
      />

      <CourseFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitCreate={handleCreateCourse}
      />
    </div>
  );
}
