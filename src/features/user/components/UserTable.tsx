"use client";

import { User } from "../user.types";
import { UserRole, AccountStatus } from "@/features/auth/auth.types";
import { PageResponse } from "@/types/pagination";

interface UserTableProps {
  users: User[];
  pagination: PageResponse<User>;
  loading: boolean;
  onPageChange: (page: number) => void;
  onChangeRole: (user: User) => void;
  onActivate: (user: User) => void;
  onDeactivate: (user: User) => void;
}

const roleBadgeConfig: Record<UserRole, { label: string; className: string }> = {
  STUDENT: {
    label: "Học viên",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  INSTRUCTOR: {
    label: "Giảng viên",
    className: "bg-purple-50 text-purple-700 border-purple-200",
  },
  ADMIN: {
    label: "Admin",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
};

const statusBadgeConfig: Record<AccountStatus, { label: string; className: string }> = {
  ACTIVE: {
    label: "Hoạt động",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  INACTIVE: {
    label: "Vô hiệu hóa",
    className: "bg-slate-100 text-slate-600 border-slate-200",
  },
  LOCKED: {
    label: "Đã khóa",
    className: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

export function UserTable({
  users,
  pagination,
  loading,
  onPageChange,
  onChangeRole,
  onActivate,
  onDeactivate,
}: UserTableProps) {
  if (loading && users.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent mb-3"></div>
        <p className="text-sm text-slate-500 font-medium">Đang tải danh sách người dùng...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
        <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p className="text-base font-semibold text-slate-700">Không tìm thấy người dùng nào</p>
        <p className="text-sm text-slate-500 mt-1">Thử thay đổi bộ lọc hoặc tìm kiếm theo từ khóa khác.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-4">Mã đăng nhập / Tên</th>
              <th className="py-3.5 px-4">Email</th>
              <th className="py-3.5 px-4">Vai trò</th>
              <th className="py-3.5 px-4">Trạng thái</th>
              <th className="py-3.5 px-4">Ngày tạo</th>
              <th className="py-3.5 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {users.map((user) => {
              const roleBadge = roleBadgeConfig[user.role] || {
                label: user.role,
                className: "bg-gray-100 text-gray-700",
              };
              const statusBadge = statusBadgeConfig[user.status] || {
                label: user.status,
                className: "bg-gray-100 text-gray-700",
              };
              const isAdmin = user.role === "ADMIN";

              return (
                <tr key={user.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-semibold flex items-center justify-center text-sm shadow-xs">
                        {user.fullName ? user.fullName.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{user.fullName}</div>
                        <div className="text-xs text-slate-500 font-mono">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{user.email}</td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${roleBadge.className}`}>
                      {roleBadge.label}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusBadge.className}`}>
                      {statusBadge.label}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 text-xs">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "N/A"}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Không cho đổi vai trò Admin */}
                      {!isAdmin && (
                        <button
                          onClick={() => onChangeRole(user)}
                          className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md text-xs font-medium transition flex items-center gap-1"
                          title="Thay đổi vai trò"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                          Đổi vai trò
                        </button>
                      )}

                      {/* Nút vô hiệu hóa / Kích hoạt mở khóa */}
                      {!isAdmin && (
                        user.status === "ACTIVE" ? (
                          <button
                            onClick={() => onDeactivate(user)}
                            className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-md text-xs font-medium transition flex items-center gap-1.5"
                            title="Vô hiệu hóa tài khoản"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                            Vô hiệu hóa
                          </button>
                        ) : (
                          <button
                            onClick={() => onActivate(user)}
                            className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-md text-xs font-medium transition flex items-center gap-1.5"
                            title="Mở khóa / Kích hoạt lại tài khoản"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Mở khóa
                          </button>
                        )
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 flex items-center justify-between">
        <div className="text-xs text-slate-500">
          Hiển thị trang <span className="font-semibold text-slate-700">{pagination.page + 1}</span> /{" "}
          <span className="font-semibold text-slate-700">{pagination.totalPages || 1}</span> (Tổng số{" "}
          <span className="font-semibold text-slate-700">{pagination.totalElements}</span> người dùng)
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.first || loading}
            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition"
          >
            Trang trước
          </button>
          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.last || loading}
            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition"
          >
            Trang sau
          </button>
        </div>
      </div>
    </div>
  );
}
