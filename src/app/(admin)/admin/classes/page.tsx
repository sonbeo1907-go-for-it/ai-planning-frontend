"use client";

import { useState } from "react";
import { ClassFormModal } from "@/features/curriculum/components/ClassFormModal";
import { ClassListTable } from "@/features/curriculum/components/ClassListTable";
import { ClassResponse } from "@/features/curriculum/curriculum.types";
import { useClasses } from "@/features/curriculum/hooks/useClasses";
import { AuthenticatedShell } from "@/features/auth";

export default function ClassesPage() {
  return (
    <AuthenticatedShell
      allowedRoles={["ADMIN"]}
      title="Quản lý Lớp học"
      description="Quản lý thông tin và lịch khai giảng của các lớp học."
    >
      <ClassesContent />
    </AuthenticatedShell>
  );
}

function ClassesContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassResponse | null>(null);
  const {
    classes,
    loading,
    error,
    pagination,
    fetchClasses,
    handleCreateClass,
    handleUpdateClass,
  } = useClasses();

  const handleOpenCreateModal = () => {
    setSelectedClass(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cls: ClassResponse) => {
    setSelectedClass(cls);
    setIsModalOpen(true);
  };


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
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tạo Lớp học
        </button>
      </div>

      <ClassListTable
        classes={classes}
        pagination={pagination}
        loading={loading}
        onPageChange={fetchClasses}
        onEdit={handleOpenEditModal}
      />

      <ClassFormModal
        isOpen={isModalOpen}
        cls={selectedClass}
        onClose={() => setIsModalOpen(false)}
        onSubmitCreate={handleCreateClass}
        onSubmitUpdate={handleUpdateClass}
      />
    </div>
  );
}
