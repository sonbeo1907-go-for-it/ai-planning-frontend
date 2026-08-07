"use client";

import Link from "next/link";
import { AuthenticatedShell } from "@/features/auth";

export default function AdminCoursesPage() {
  return (
    <AuthenticatedShell
      allowedRoles={["ADMIN"]}
      title="Quản lý Khóa học"
      description="Quản lý danh sách các khóa học và cấu trúc module lộ trình."
    >
      <AdminCoursesContent />
    </AuthenticatedShell>
  );
}

function AdminCoursesContent() {
  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Khóa học & Cấu trúc Lộ trình</h2>
          <p className="text-sm text-slate-500 mt-1">
            Chọn một khóa học để quản lý các Module lộ trình bài học (US-MOD-01).
          </p>
        </div>
      </div>

      {/* Course Cards / Table placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition space-y-4">
          <div className="flex justify-between items-center">
            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-mono font-bold text-xs rounded-lg">
              FULLSTACK_JAVA
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Hoạt động
            </span>
          </div>

          <div>
            <h3 className="font-bold text-slate-800 text-base">Fullstack Java Web Development</h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              Lộ trình đào tạo Lập trình viên Fullstack Java từ Java Core đến Spring Boot và React.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
            <span className="text-xs text-slate-400">US-MOD-01</span>
            <Link
              href="/admin/courses/fullstack-java-uuid/modules"
              className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-semibold text-xs rounded-xl transition flex items-center gap-1"
            >
              Quản lý Modules
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
