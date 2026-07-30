"use client";

import {
  useEffect,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";

import { APP_ROUTES } from "@/constants/app-routes";
import { LoadingState } from "@/components/ui";

import { useAuthStore } from "../auth.store";
import type { UserRole } from "../auth.types";

export interface RequireAuthProps {
  allowedRoles?: UserRole[];
  children: ReactNode;
}

export function RequireAuth({
  allowedRoles,
  children,
}: RequireAuthProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const profile = useAuthStore((state) => state.profile);

  const isAllowed = profile
    && (!allowedRoles || allowedRoles.includes(profile.role));

  useEffect(() => {
    if (!isInitialized || isAllowed) {
      return;
    }

    if (!profile) {
      const searchParams = new URLSearchParams({ next: pathname });
      router.replace(`${APP_ROUTES.LOGIN}?${searchParams.toString()}`);
      return;
    }

    router.replace(APP_ROUTES.FORBIDDEN);
  }, [isAllowed, isInitialized, pathname, profile, router]);

  if (!isInitialized || !isAllowed) {
    return (
      <LoadingState
        className="min-h-screen"
        label="Đang kiểm tra phiên đăng nhập"
      />
    );
  }

  return children;
}
