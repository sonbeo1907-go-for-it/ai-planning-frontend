"use client";

import { useState } from "react";
import { ClassFormModal } from "@/features/curriculum/components/ClassFormModal";
import { curriculumService } from "@/features/curriculum/curriculum.service";
import { CreateClassRequest } from "@/features/curriculum/curriculum.types";
import { toast } from "sonner";

export default function ClassesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateClass = async (payload: CreateClassRequest) => {
    await curriculumService.createClass(payload);
    toast.success("Lớp học đã được tạo thành công!");
    // In a real app, we would refresh the list of classes here
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý Lớp học</h1>
          <p className="text-slate-500 text-sm mt-1">Danh sách tất cả các lớp học trong hệ thống.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tạo Lớp học
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px] flex items-center justify-center">
        <p className="text-slate-500">Chưa có tính năng hiển thị danh sách lớp học (Đang chờ API GET /admin/classes).</p>
      </div>

      <ClassFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitCreate={handleCreateClass}
      />
    </div>
  );
}
