"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { WarningPanel } from "@/components/planning";
import { Button, Input } from "@/components/ui";
import { APP_ROUTES } from "@/constants/app-routes";

import {
  authApi,
  isApiClientError,
} from "../auth.api";
import { getRoleHomeRoute } from "../auth.routes";
import {
  loginSchema,
  type LoginFormValues,
} from "../auth.schema";
import { useAuthStore } from "../auth.store";
import { GoogleLoginButton } from "./GoogleLoginButton";

export interface LoginScreenProps {
  reason?: string;
}

function sessionMessage(reason?: string): string | undefined {
  if (reason === "session-expired") {
    return "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục.";
  }

  if (reason === "authentication-required") {
    return "Vui lòng đăng nhập để truy cập chức năng này.";
  }

  if (reason === "account-deactivated") {
    return "Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.";
  }

  return undefined;
}

export function LoginScreen({ reason }: LoginScreenProps) {
  const router = useRouter();
  const [submissionError, setSubmissionError] = useState<string>();
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const profile = useAuthStore((state) => state.profile);
  const establishSession = useAuthStore((state) => state.establishSession);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (isInitialized && profile) {
      router.replace(getRoleHomeRoute(profile.role));
    }
  }, [isInitialized, profile, router]);

  async function handleSubmit(values: LoginFormValues) {
    setSubmissionError(undefined);

    try {
      const token = await authApi.login(values);
      const currentProfile = await authApi.getCurrentProfile(
        token.accessToken,
        false,
      );

      establishSession(token.accessToken, currentProfile);
      router.replace(getRoleHomeRoute(currentProfile.role));
    } catch (error) {
      if (isApiClientError(error)) {
        if (error.code === "VALIDATION_FAILED") {
          Object.entries(error.fieldErrors).forEach(([field, message]) => {
            if (field === "email" || field === "password") {
              form.setError(field, { message });
            }
          });
          return;
        }

        if (error.code === "INVALID_CREDENTIALS") {
          setSubmissionError("Email hoặc mật khẩu không đúng.");
          return;
        }
      }

      setSubmissionError(
        "Không thể đăng nhập lúc này. Vui lòng kiểm tra kết nối và thử lại.",
      );
    }
  }

  const handleGoogleCredential = useCallback(async (idToken: string) => {
    setSubmissionError(undefined);
    setIsGoogleSubmitting(true);

    try {
      const token = await authApi.loginWithGoogle(idToken);
      const currentProfile = await authApi.getCurrentProfile(
        token.accessToken,
        false,
      );

      establishSession(token.accessToken, currentProfile);
      router.replace(getRoleHomeRoute(currentProfile.role));
    } catch (error) {
      if (isApiClientError(error)) {
        if (error.code === "GOOGLE_ACCOUNT_LINK_REQUIRED") {
          setSubmissionError(
            "Email này đã có tài khoản nội bộ. Vui lòng đăng nhập bằng email và mật khẩu để liên kết Google.",
          );
          return;
        }

        if (error.code === "INVALID_GOOGLE_CREDENTIAL") {
          setSubmissionError(
            "Không thể xác thực tài khoản Google. Vui lòng thử lại.",
          );
          return;
        }

        if (error.code === "GOOGLE_AUTH_UNAVAILABLE") {
          setSubmissionError(
            "Đăng nhập bằng Google hiện chưa được cấu hình. Vui lòng thử lại sau.",
          );
          return;
        }
      }

      setSubmissionError(
        "Không thể đăng nhập bằng Google lúc này. Vui lòng kiểm tra kết nối và thử lại.",
      );
    } finally {
      setIsGoogleSubmitting(false);
    }
  }, [establishSession, router]);

  const handleGoogleError = useCallback((message: string) => {
    setSubmissionError(message);
  }, []);

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-10 sm:px-6">
      <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          AI Planning
        </p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
          Đăng nhập
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Dùng tài khoản do trung tâm cấp để truy cập không gian học tập của bạn.
        </p>

        {sessionMessage(reason) && (
          <WarningPanel
            className="mt-5"
            tone="info"
            title="Cần đăng nhập lại"
          >
            {sessionMessage(reason)}
          </WarningPanel>
        )}

        {submissionError && (
          <WarningPanel
            className="mt-5"
            tone="error"
            title="Không thể đăng nhập"
          >
            {submissionError}
          </WarningPanel>
        )}

        <form
          className="mt-6 grid gap-5"
          noValidate
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <Input
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            disabled={isGoogleSubmitting}
            {...form.register("email")}
            error={form.formState.errors.email?.message}
          />
          <div className="space-y-2">
            <Input
              id="password"
              label="Mật khẩu"
              type="password"
              autoComplete="current-password"
              disabled={isGoogleSubmitting}
              {...form.register("password")}
              error={form.formState.errors.password?.message}
            />
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>
          </div>
          <Button
            className="w-full"
            type="submit"
            disabled={isGoogleSubmitting}
            isLoading={form.formState.isSubmitting}
          >
            Đăng nhập
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-slate-500">
          <span className="h-px flex-1 bg-slate-200" />
          <span>hoặc</span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <GoogleLoginButton
          disabled={form.formState.isSubmitting || isGoogleSubmitting}
          onCredential={handleGoogleCredential}
          onError={handleGoogleError}
        />
        {isGoogleSubmitting && (
          <p className="mt-3 text-center text-sm text-slate-600" aria-live="polite">
            Đang đăng nhập bằng Google...
          </p>
        )}

        <div className="mt-6 border-t border-slate-200 pt-6 text-center">
          <p className="mb-3 text-sm text-slate-600">
            Chưa có tài khoản?
          </p>
          <Link
            href={APP_ROUTES.REGISTER}
            className="inline-flex min-h-10 w-full items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500"
          >
            Đăng ký
          </Link>
        </div>
      </section>
    </main>
  );
}
