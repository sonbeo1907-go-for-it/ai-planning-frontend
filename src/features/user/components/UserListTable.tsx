"use client";

import { MoreVertical, Eye, Edit, Ban, Key } from "lucide-react";
import { useState } from "react";

import { DropdownMenu, StatusBadge, type StatusBadgeTone } from "@/components/ui";
import { useAuthStore } from "@/features/auth";
import { ResetPasswordModal } from "./ResetPasswordModal";

const mockUsers = [
  { id: 1, name: "Nguyễn Văn A", email: "a.nguyen@example.com", status: "ACTIVE", role: "STUDENT" },
  { id: 2, name: "Trần Thị B", email: "b.tran@example.com", status: "INACTIVE", role: "INSTRUCTOR" },
  { id: 3, name: "Lê Văn C", email: "c.le@example.com", status: "LOCKED", role: "ADMIN" },
];

function getRoleLabel(role: string) {
  switch (role) {
    case "STUDENT": return "Học viên";
    case "INSTRUCTOR": return "Giảng viên";
    case "ADMIN": return "Quản trị viên";
    default: return role;
  }
}

function getStatusBadgeTone(status: string): StatusBadgeTone {
  switch (status) {
    case "ACTIVE": return "success";
    case "INACTIVE": return "neutral";
    case "LOCKED": return "danger";
    default: return "neutral";
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case "ACTIVE": return "Hoạt động";
    case "INACTIVE": return "Chưa kích hoạt";
    case "LOCKED": return "Đã khóa";
    default: return status;
  }
}

export function UserListTable() {
  const profile = useAuthStore((state) => state.profile);
  const [resetUser, setResetUser] = useState<typeof mockUsers[0] | null>(null);

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold">Tên người dùng</th>
              <th scope="col" className="px-6 py-4 font-semibold">Email</th>
              <th scope="col" className="px-6 py-4 font-semibold">Trạng thái</th>
              <th scope="col" className="px-6 py-4 font-semibold">Vai trò</th>
              <th scope="col" className="px-6 py-4 text-right font-semibold">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {mockUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <StatusBadge tone={getStatusBadgeTone(user.status)}>
                    {getStatusLabel(user.status)}
                  </StatusBadge>
                </td>
                <td className="px-6 py-4">{getRoleLabel(user.role)}</td>
                <td className="px-6 py-4 text-right">
                  <DropdownMenu
                    align="right"
                    trigger={
                      <button className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                        <MoreVertical className="size-5" />
                      </button>
                    }
                    items={[
                      { label: "Xem chi tiết", icon: <Eye className="size-4" />, onClick: () => console.log("Xem chi tiết", user.id) },
                      { label: "Chỉnh sửa", icon: <Edit className="size-4" />, onClick: () => console.log("Chỉnh sửa", user.id) },
                      ...(profile?.role === "ADMIN" 
                        ? [{ label: "Đặt lại mật khẩu", icon: <Key className="size-4" />, onClick: () => setResetUser(user) }] 
                        : []),
                      { label: "Vô hiệu hóa", icon: <Ban className="size-4" />, onClick: () => console.log("Vô hiệu hóa", user.id), variant: "danger" },
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <ResetPasswordModal 
      isOpen={resetUser !== null} 
      onClose={() => setResetUser(null)} 
      user={resetUser} 
    />
    </>
  );
}
