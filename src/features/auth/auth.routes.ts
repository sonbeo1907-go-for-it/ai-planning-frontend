import { APP_ROUTES } from "@/constants/app-routes";

import type { UserRole } from "./auth.types";

export function getRoleHomeRoute(role: UserRole): string {
  switch (role) {
    case "STUDENT":
      return APP_ROUTES.STUDENT.DASHBOARD;
    case "INSTRUCTOR":
      return APP_ROUTES.INSTRUCTOR.DASHBOARD;
    case "ADMIN":
      return APP_ROUTES.ADMIN.DASHBOARD;
  }
}

export const roleLabels: Record<UserRole, string> = {
  STUDENT: "Học viên",
  INSTRUCTOR: "Giảng viên",
  ADMIN: "Quản trị viên",
};

export const accountStatusLabels = {
  ACTIVE: "Đang hoạt động",
  INACTIVE: "Ngừng hoạt động",
  LOCKED: "Đã khóa",
} as const;
