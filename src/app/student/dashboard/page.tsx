import type { Metadata } from "next";

import {
  AuthenticatedShell,
  RoleDashboard,
} from "@/features/auth";

export const metadata: Metadata = { title: "Tổng quan học viên" };

export default function StudentDashboardPage() {
  return (
    <AuthenticatedShell
      allowedRoles={["STUDENT"]}
      title="Tổng quan học viên"
      description="Không gian lập kế hoạch học tập của bạn."
    >
      <RoleDashboard />
    </AuthenticatedShell>
  );
}
