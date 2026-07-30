"use client";

import {
  useEffect,
  useState,
} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { WarningPanel } from "@/components/planning";
import { Button, Input } from "@/components/ui";

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

  return undefined;
}

export function LoginScreen({ reason }: LoginScreenProps) {
  const router = useRouter();
  const [submissionError, setSubmissionError] = useState<string>();
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const profile = useAuthStore((state) => state.profile);
  const establishSession = useAuthStore((state) => state.establishSession);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
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
            if (field === "username" || field === "password") {
              form.setError(field, { message });
            }
          });
          return;
        }

        if (error.code === "INVALID_CREDENTIALS") {
          setSubmissionError("Tên đăng nhập hoặc mật khẩu không đúng.");
          return;
        }
      }

      setSubmissionError(
        "Không thể đăng nhập lúc này. Vui lòng kiểm tra kết nối và thử lại.",
      );
    }
  }

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
            id="username"
            label="Mã người dùng"
            autoComplete="username"
            {...form.register("username")}
            error={form.formState.errors.username?.message}
          />
          <Input
            id="password"
            label="Mật khẩu"
            type="password"
            autoComplete="current-password"
            {...form.register("password")}
            error={form.formState.errors.password?.message}
          />
          <Button
            className="w-full"
            type="submit"
            isLoading={form.formState.isSubmitting}
          >
            Đăng nhập
          </Button>
        </form>
      </section>
    </main>
  );
}
