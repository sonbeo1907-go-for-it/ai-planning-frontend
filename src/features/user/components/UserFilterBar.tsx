"use client";

import { UserRole, AccountStatus } from "@/features/auth/auth.types";
import { UserSearchParam } from "../user.types";

interface UserFilterBarProps {
  params: UserSearchParam;
  onSearchChange: (keyword: string) => void;
  onRoleChange: (role: UserSearchParam["role"]) => void;
  onStatusChange: (status: UserSearchParam["status"]) => void;
  onCreateClick: () => void;
}

export function UserFilterBar({
  params,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onCreateClick,
}: UserFilterBarProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
      {/* Tìm kiếm & Lọc */}
      <div className="flex flex-1 flex-col sm:flex-row gap-3 w-full md:w-auto">
        {/* Keyword Search */}
        <div className="relative flex-1 min-w-[240px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Tìm theo Mã đăng nhập hoặc Họ tên..."
            value={params.keyword || ""}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          />
        </div>

        {/* Role Filter */}
        <select
          value={params.role || ""}
          onChange={(e) => onRoleChange(e.target.value as UserRole | "")}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
        >
          <option value="">Tất cả vai trò</option>
          <option value="STUDENT">Học viên</option>
          <option value="INSTRUCTOR">Giảng viên</option>
          <option value="ADMIN">Quản trị viên (Admin)</option>
        </select>

        {/* Status Filter */}
        <select
          value={params.status || ""}
          onChange={(e) => onStatusChange(e.target.value as AccountStatus | "")}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="ACTIVE">Hoạt động (Active)</option>
          <option value="INACTIVE">Vô hiệu hóa (Inactive)</option>
          <option value="LOCKED">Bị khóa (Locked)</option>
        </select>
      </div>

      {/* Button Tạo tài khoản */}
      <button
        onClick={onCreateClick}
        className="w-full md:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Tạo người dùng mới
      </button>
    </div>
  );
}
