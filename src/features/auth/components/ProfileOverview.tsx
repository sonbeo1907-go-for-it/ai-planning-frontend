"use client";

import { StatusBadge } from "@/components/ui";

import {
  accountStatusLabels,
  roleLabels,
} from "../auth.routes";
import { useAuthStore } from "../auth.store";
import type {
  AccountStatus,
  AssignedClassSummary,
  EnrollmentSummary,
} from "../auth.types";
import { useState } from "react";
import { Button } from "@/components/ui";
import { ChangePasswordModal } from "./ChangePasswordModal";

function accountStatusTone(status: AccountStatus) {
  switch (status) {
    case "ACTIVE":
      return "success" as const;
    case "INACTIVE":
      return "warning" as const;
    case "LOCKED":
      return "danger" as const;
  }
}

function LearningList({
  title,
  items,
}: {
  title: string;
  items: EnrollmentSummary[] | AssignedClassSummary[];
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-950">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Chưa có dữ liệu được phân công.
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-slate-100">
          {items.map((item) => (
            <li key={item.classId} className="py-3 first:pt-0 last:pb-0">
              <p className="font-medium text-slate-900">
                {item.classCode} · {item.className}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {item.courseCode} · {item.courseName}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function ProfileOverview() {
  const profile = useAuthStore((state) => state.profile);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  if (!profile) {
    return null;
  }

  return (
    <div className="grid max-w-4xl gap-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <dl className="grid gap-5 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-slate-500">Họ và tên</dt>
            <dd className="mt-1 font-semibold text-slate-950">{profile.fullName}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">Mã người dùng</dt>
            <dd className="mt-1 font-semibold text-slate-950">{profile.username}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">Vai trò</dt>
            <dd className="mt-1">
              <StatusBadge tone="info">{roleLabels[profile.role]}</StatusBadge>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">Trạng thái tài khoản</dt>
            <dd className="mt-1">
              <StatusBadge tone={accountStatusTone(profile.status)}>
                {accountStatusLabels[profile.status]}
              </StatusBadge>
            </dd>
          </div>
        </dl>
      </section>

      {profile.role === "STUDENT" && (
        <LearningList
          title="Lớp và khóa học hiện hành"
          items={profile.student?.currentEnrollments ?? []}
        />
      )}
      {profile.role === "INSTRUCTOR" && (
        <LearningList
          title="Lớp được phân công"
          items={profile.instructor?.assignedClasses ?? []}
        />
      )}

      <div className="flex justify-end mt-4">
        <Button onClick={() => setIsPasswordModalOpen(true)}>Đổi mật khẩu</Button>
      </div>

      <ChangePasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />
    </div>
  );
}
