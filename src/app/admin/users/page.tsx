import type { Metadata } from "next";

import { UserListTable } from "@/features/user/components";

export const metadata: Metadata = {
  title: "Danh sách người dùng",
};

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-950">Danh sách người dùng</h2>
        <p className="mt-1 text-sm text-slate-600">
          Quản lý tất cả tài khoản học viên, giảng viên và quản trị viên trong hệ thống.
        </p>
      </div>

      <UserListTable />
    </div>
  );
}
