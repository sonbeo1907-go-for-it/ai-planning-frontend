"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button, Input } from "@/components/ui";

import {
  passwordResetRequestSchema,
  type PasswordResetRequestFormValues,
} from "../auth.schema";

interface ForgotPasswordFormProps {
  onSubmit: (data: PasswordResetRequestFormValues) => void;
  isLoading: boolean;
}

export function ForgotPasswordForm({
  onSubmit,
  isLoading,
}: ForgotPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetRequestFormValues>({
    resolver: zodResolver(passwordResetRequestSchema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-sm border border-slate-200"
      noValidate
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">Quên mật khẩu?</h2>
        <p className="text-slate-500 text-sm">
          Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn đường dẫn để đặt lại mật khẩu.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          id="email"
          type="email"
          label="Địa chỉ Email"
          placeholder="name@example.com"
          autoComplete="email"
          autoFocus
          error={errors.email?.message}
          {...register("email")}
          disabled={isLoading}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={isLoading}
        >
          Gửi yêu cầu
        </Button>
      </div>
    </form>
  );
}
