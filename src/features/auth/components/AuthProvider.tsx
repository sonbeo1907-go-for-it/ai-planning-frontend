"use client";

import {
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { APP_ROUTES } from "@/constants/app-routes";
import { setAuthenticationErrorHandler } from "@/lib/api-client";

import { authApi } from "../auth.api";
import { connectAccountEvents } from "../account-events";
import { useAuthStore } from "../auth.store";

export interface AuthProviderProps {
  children: ReactNode;
}

function loginUrl(reason: string, returnPath: string): string {
  const searchParams = new URLSearchParams({ reason, next: returnPath });
  return `${APP_ROUTES.LOGIN}?${searchParams.toString()}`;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const initialized = useAuthStore((state) => state.isInitialized);
  const accessToken = useAuthStore((state) => state.accessToken);
  const initializationStarted = useRef(false);

  useEffect(() => {
    setAuthenticationErrorHandler((error) => {
      const { clearSession } = useAuthStore.getState();
      clearSession();

      if (window.location.pathname === APP_ROUTES.LOGIN) {
        return;
      }

      const reason = error.code === "SESSION_EXPIRED"
        ? "session-expired"
        : "authentication-required";
      const returnPath = `${window.location.pathname}${window.location.search}`;

      toast.error(
        error.code === "SESSION_EXPIRED"
          ? "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
          : "Vui lòng đăng nhập để tiếp tục.",
      );
      router.replace(loginUrl(reason, returnPath));
    });

    return () => {
      setAuthenticationErrorHandler(undefined);
    };
  }, [pathname, router]);

  useEffect(() => {
    if (initializationStarted.current || initialized) {
      return;
    }

    initializationStarted.current = true;

    async function restoreSession() {
      const { establishSession, finishInitialization } = useAuthStore.getState();

      try {
        const token = await authApi.refresh();
        const profile = await authApi.getCurrentProfile(
          token.accessToken,
          false,
        );
        establishSession(token.accessToken, profile);
      } catch {
        finishInitialization();
      }
    }

    void restoreSession();
  }, [initialized]);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    return connectAccountEvents(accessToken, () => {
      const returnPath = `${window.location.pathname}${window.location.search}`;
      useAuthStore.getState().clearSession();
      toast.error("Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.");
      router.replace(loginUrl("account-deactivated", returnPath));
    });
  }, [accessToken, router]);

  return children;
}
