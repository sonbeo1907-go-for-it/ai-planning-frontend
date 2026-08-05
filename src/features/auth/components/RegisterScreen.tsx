"use client";

import Link from "next/link";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { StatusPage } from "@/components/layout";
import { WarningPanel } from "@/components/planning";
import { Button, Input } from "@/components/ui";
import { APP_ROUTES } from "@/constants/app-routes";

import {
  authApi,
  isApiClientError,
} from "../auth.api";
import {
  registerSchema,
  type RegisterFormValues,
} from "../auth.schema";

const loginLinkClasses =
  "inline-flex min-h-10 items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";

export function RegisterScreen() {
  const [submissionAccepted, setSubmissionAccepted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string>();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function handleSubmit(values: RegisterFormValues) {
    setSubmissionError(undefined);

    try {
      await authApi.register({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      });
      setSubmissionAccepted(true);
    } catch (error) {
      if (
        isApiClientError(error)
        && error.code === "VALIDATION_FAILED"
      ) {
        Object.entries(error.fieldErrors).forEach(([field, message]) => {
          if (
            field === "fullName"
            || field === "email"
            || field === "password"
          ) {
            form.setError(field, { message });
          }
        });
        return;
      }

      setSubmissionError(
        "Không thể gửi yêu cầu đăng ký lúc này. Vui lòng kiểm tra kết nối và thử lại.",
      );
    }
  }

  if (submissionAccepted) {
    return (
      <StatusPage
        code="Đăng ký thành công"
        title="Yêu cầu đã được tiếp nhận"
        description="Bạn có thể chuyển đến trang đăng nhập để truy cập tài khoản của mình."
        tone="info"
        action={(
          <Link href={APP_ROUTES.LOGIN} className={loginLinkClasses}>
            Đi đến đăng nhập
          </Link>
        )}
      />
    );
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-10 sm:px-6">
      <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          AI Planning
        </p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
          Đăng ký tài khoản
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Tạo tài khoản học viên để sử dụng hệ thống AI Planning.
        </p>

        {submissionError && (
          <WarningPanel
            className="mt-5"
            tone="error"
            title="Không thể đăng ký"
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
            id="fullName"
            label="Họ và tên"
            autoComplete="name"
            {...form.register("fullName")}
            error={form.formState.errors.fullName?.message}
          />
          <Input
            id="register-email"
            label="Email"
            type="email"
            autoComplete="email"
            {...form.register("email")}
            error={form.formState.errors.email?.message}
          />
          <Input
            id="register-password"
            label="Mật khẩu"
            type="password"
            autoComplete="new-password"
            {...form.register("password")}
            error={form.formState.errors.password?.message}
          />
          <Input
            id="register-confirm-password"
            label="Xác nhận mật khẩu"
            type="password"
            autoComplete="new-password"
            {...form.register("confirmPassword")}
            error={form.formState.errors.confirmPassword?.message}
          />
          <p className="text-xs leading-5 text-slate-500">
            Mật khẩu gồm 8–100 ký tự và có ít nhất một chữ hoa, một chữ thường và một chữ số.
          </p>
          <Button
            className="w-full"
            type="submit"
            isLoading={form.formState.isSubmitting}
          >
            Đăng ký
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Đã có tài khoản?{" "}
          <Link
            href={APP_ROUTES.LOGIN}
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Đăng nhập
          </Link>
        </p>
      </section>
    </main>
  );
}
