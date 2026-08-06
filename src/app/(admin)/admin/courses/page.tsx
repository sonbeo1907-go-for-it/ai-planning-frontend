"use client";

import { useState } from "react";
import { CourseFormModal } from "@/features/curriculum/components/CourseFormModal";
import { curriculumService } from "@/features/curriculum/curriculum.service";
import { CreateCourseRequest } from "@/features/curriculum/curriculum.types";
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

  const handleCreateCourse = async (payload: CreateCourseRequest) => {
    await curriculumService.createCourse(payload);
    toast.success("Khóa học đã được tạo thành công!");
    // In a real app, we would refresh the list of courses here
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
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

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px] flex items-center justify-center">
        <p className="text-slate-500">Chưa có tính năng hiển thị danh sách khóa học (Đang chờ API GET /admin/courses).</p>
      </div>

      <CourseFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitCreate={handleCreateCourse}
      />
    </div>
  );
}
