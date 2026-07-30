"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { LoadingState } from "@/components/ui";
import { APP_ROUTES } from "@/constants/app-routes";

import { getRoleHomeRoute } from "../auth.routes";
import { useAuthStore } from "../auth.store";

export function AuthLanding() {
  const router = useRouter();
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const profile = useAuthStore((state) => state.profile);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    router.replace(
      profile ? getRoleHomeRoute(profile.role) : APP_ROUTES.LOGIN,
    );
  }, [isInitialized, profile, router]);

  return <LoadingState className="min-h-screen" label="Đang mở AI Planning" />;
}
