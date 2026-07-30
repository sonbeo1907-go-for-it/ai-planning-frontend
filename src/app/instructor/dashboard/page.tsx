import type { Metadata } from "next";

import {
  AuthenticatedShell,
  RoleDashboard,
} from "@/features/auth";

export const metadata: Metadata = { title: "Tổng quan giảng viên" };

export default function InstructorDashboardPage() {
  return (
    <AuthenticatedShell
      allowedRoles={["INSTRUCTOR"]}
      title="Tổng quan giảng viên"
      description="Không gian theo dõi và hỗ trợ học viên."
    >
      <RoleDashboard />
    </AuthenticatedShell>
  );
}
