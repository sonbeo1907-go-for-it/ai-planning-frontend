"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { WarningPanel } from "@/components/planning";
import { Button } from "@/components/ui";
import { AuthenticatedShell } from "@/features/auth";
import { CourseFilterBar } from "@/features/curriculum/components/CourseFilterBar";
import { CourseFormModal } from "@/features/curriculum/components/CourseFormModal";
import { CourseListTable } from "@/features/curriculum/components/CourseListTable";
import { CourseStatusModal } from "@/features/curriculum/components/CourseStatusModal";
import { useCourses } from "@/features/curriculum/hooks/useCourses";
import type { CourseResponse } from "@/features/curriculum/curriculum.types";

export default function CoursesPage() {
  return (
    <AuthenticatedShell
      allowedRoles={["ADMIN"]}
      title="Quản lý khóa học"
      description="Tạo, cập nhật và kiểm soát trạng thái các chương trình đào tạo."
    >
      <CoursesContent />
    </AuthenticatedShell>
  );
}

function CoursesContent() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseResponse | null>(null);
  const [statusCourse, setStatusCourse] = useState<CourseResponse | null>(null);
  const coursesState = useCourses();

  function openCreateForm() {
    setEditingCourse(null);
    setIsFormOpen(true);
  }

  function openEditForm(course: CourseResponse) {
    setEditingCourse(course);
    setIsFormOpen(true);
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-5">
      <div className="flex justify-end">
        <Button onClick={openCreateForm}>
          <Plus className="size-4" aria-hidden="true" />
          Tạo khóa học
        </Button>
      </div>

      <CourseFilterBar
        params={coursesState.params}
        disabled={coursesState.loading}
        onSearch={coursesState.handleSearch}
        onStatusChange={coursesState.handleStatusFilter}
      />

      {coursesState.error && (
        <WarningPanel tone="error" title="Không thể tải khóa học">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>{coursesState.error}</span>
            <Button
              variant="secondary"
              className="shrink-0"
              onClick={() => void coursesState.refetch()}
            >
              Thử lại
            </Button>
          </div>
        </WarningPanel>
      )}

      <CourseListTable
        courses={coursesState.courses}
        pagination={coursesState.pagination}
        loading={coursesState.loading}
        onPageChange={coursesState.handlePageChange}
        onEdit={openEditForm}
        onStatusChange={setStatusCourse}
      />

      <CourseFormModal
        isOpen={isFormOpen}
        course={editingCourse}
        onClose={() => setIsFormOpen(false)}
        onSubmitCreate={coursesState.createCourse}
        onSubmitUpdate={coursesState.updateCourse}
      />

      <CourseStatusModal
        course={statusCourse}
        onClose={() => setStatusCourse(null)}
        onConfirm={coursesState.changeCourseStatus}
      />
    </div>
  );
}
