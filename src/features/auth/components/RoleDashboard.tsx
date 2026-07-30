"use client";

import { StatusBadge } from "@/components/ui";

import { roleLabels } from "../auth.routes";
import { useAuthStore } from "../auth.store";

export function RoleDashboard() {
  const profile = useAuthStore((state) => state.profile);

  if (!profile) {
    return null;
  }

  return (
    <section className="max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <StatusBadge tone="info">{roleLabels[profile.role]}</StatusBadge>
      <h2 className="mt-4 text-xl font-semibold tracking-tight text-slate-950">
        Chào {profile.fullName}
      </h2>
      <p className="mt-2 leading-7 text-slate-600">
        Phiên đăng nhập của bạn đang hoạt động. Các chức năng theo vai trò sẽ
        được bổ sung tại không gian này.
      </p>
    </section>
  );
}
