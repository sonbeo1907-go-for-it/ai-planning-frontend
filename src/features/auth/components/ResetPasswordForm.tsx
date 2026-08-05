"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@/components/ui";

import {
  passwordResetConfirmSchema,
  type PasswordResetConfirmFormValues,
} from "../auth.schema";

interface ResetPasswordFormProps {
  onSubmit: (data: PasswordResetConfirmFormValues) => void;
  isLoading: boolean;
}

export function ResetPasswordForm({
  onSubmit,
  isLoading,
}: ResetPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetConfirmFormValues>({
    resolver: zodResolver(passwordResetConfirmSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-sm border border-slate-200"
      noValidate
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">Đặt lại mật khẩu</h2>
        <p className="text-slate-500 text-sm">
          Vui lòng nhập mật khẩu mới cho tài khoản của bạn.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          id="newPassword"
          type="password"
          label="Mật khẩu mới"
          placeholder="••••••••"
          autoComplete="new-password"
          autoFocus
          error={errors.newPassword?.message}
          {...register("newPassword")}
          disabled={isLoading}
        />

        <Input
          id="confirmPassword"
          type="password"
          label="Xác nhận mật khẩu mới"
          placeholder="••••••••"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
          disabled={isLoading}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={isLoading}
        >
          Xác nhận đổi mật khẩu
        </Button>
      </div>
    </form>
  );
}
