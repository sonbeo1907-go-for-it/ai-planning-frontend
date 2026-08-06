"use client";

import type { ReactNode } from "react";
import {
  CalendarDays,
  LayoutDashboard,
  LogOut,
  UserRound,
  UsersRound,
  GraduationCap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  AppShell,
  Header,
  MainContent,
  Sidebar,
} from "@/components/layout";
import { Button } from "@/components/ui";
import { APP_ROUTES } from "@/constants/app-routes";

import { authApi } from "../auth.api";
import { getRoleHomeRoute, roleLabels } from "../auth.routes";
import { useAuthStore } from "../auth.store";
import type { UserRole } from "../auth.types";
import { RequireAuth } from "./RequireAuth";

export interface AuthenticatedShellProps {
  title: string;
  description?: string;
  allowedRoles?: UserRole[];
  children: ReactNode;
}

function getNavigationItems(role: UserRole) {
  return [
    {
      href: getRoleHomeRoute(role),
      label: "Tổng quan",
      icon: <LayoutDashboard className="size-5" />,
    },
    ...(role === "STUDENT"
      ? [{
        href: APP_ROUTES.STUDENT.WEEKLY_PLANS,
        label: "Kế hoạch tuần",
        icon: <CalendarDays className="size-5" />,
      }]
      : []),
    ...(role === "ADMIN"
      ? [{
        href: APP_ROUTES.ADMIN.USERS,
        label: "Quản lý người dùng",
        icon: <UsersRound className="size-5" />,
        children: [
          {
            href: APP_ROUTES.ADMIN.USERS,
            label: "Danh sách người dùng",
          },
        ],
      }]
      : []),
    ...(role === "ADMIN"
      ? [{
        href: APP_ROUTES.ADMIN.COURSES, // Default route for the parent group
        label: "Đào tạo",
        icon: <GraduationCap className="size-5" />,
        children: [
          {
            href: APP_ROUTES.ADMIN.COURSES,
            label: "Khóa học",
          },
          {
            href: APP_ROUTES.ADMIN.CLASSES,
            label: "Lớp học",
          },
        ],
      }]
      : []),
    {
      href: APP_ROUTES.PROFILE,
      label: "Hồ sơ cá nhân",
      icon: <UserRound className="size-5" />,
    },
  ];
}

function AuthenticatedFrame({
  title,
  description,
  children,
}: Omit<AuthenticatedShellProps, "allowedRoles">) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const profile = useAuthStore((state) => state.profile);
  const clearSession = useAuthStore((state) => state.clearSession);

  if (!profile) {
    return null;
  }

  async function handleLogout() {
    try {
      await authApi.logout(accessToken);
      clearSession();
      router.replace(APP_ROUTES.LOGIN);
    } catch {
      toast.error("Không thể đăng xuất. Vui lòng thử lại.");
    }
  }

  return (
    <AppShell
      sidebar={<Sidebar navigationItems={getNavigationItems(profile.role)} />}
      header={(
        <Header
          title={title}
          user={{ name: profile.fullName, role: roleLabels[profile.role] }}
          actions={(
            <Button
              variant="ghost"
              className="px-3"
              onClick={handleLogout}
              aria-label="Đăng xuất"
            >
              <LogOut className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Đăng xuất</span>
            </Button>
          )}
        />
      )}
    >
      <MainContent title={title} description={description}>
        {children}
      </MainContent>
    </AppShell>
  );
}

export function AuthenticatedShell({
  allowedRoles,
  ...props
}: AuthenticatedShellProps) {
  return (
    <RequireAuth allowedRoles={allowedRoles}>
      <AuthenticatedFrame {...props} />
    </RequireAuth>
  );
}
