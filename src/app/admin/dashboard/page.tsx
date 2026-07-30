import type { Metadata } from "next";

import {
  AuthenticatedShell,
  RoleDashboard,
} from "@/features/auth";

export const metadata: Metadata = { title: "Tổng quan quản trị" };

export default function AdminDashboardPage() {
  return (
    <AuthenticatedShell
      allowedRoles={["ADMIN"]}
      title="Tổng quan quản trị"
      description="Không gian quản lý hệ thống AI Planning."
    >
      <RoleDashboard />
    </AuthenticatedShell>
  );
}
