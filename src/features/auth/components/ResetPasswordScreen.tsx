"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui";

import { authApi, isApiClientError } from "../auth.api";
import type { PasswordResetConfirmFormValues } from "../auth.schema";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { ResetPasswordSuccess } from "./ResetPasswordSuccess";

export function ResetPasswordScreen() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Handle missing token early
  if (!token) {
    return (
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-sm border border-slate-200 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Liên kết không hợp lệ</h2>
        <p className="text-slate-600">
          Đường dẫn đặt lại mật khẩu không hợp lệ hoặc đã bị thiếu token. 
          Vui lòng yêu cầu lại đường dẫn mới.
        </p>

        <div className="pt-4 space-y-2">
          <Button
            variant="primary"
            className="w-full"
            onClick={() => router.push("/forgot-password")}
          >
            Yêu cầu đặt lại mật khẩu mới
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/login")}
          >
            Quay lại Đăng nhập
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (data: PasswordResetConfirmFormValues) => {
    try {
      setIsLoading(true);
      await authApi.confirmPasswordReset({
        token,
        newPassword: data.newPassword,
      });
      setIsSuccess(true);
    } catch (error) {
      if (isApiClientError(error)) {
        if (error.status === 400 || error.status === 404) {
          toast.error("Liên kết không hợp lệ, đã hết hạn hoặc đã được sử dụng trước đó.");
        } else if (error.status === 429) {
          toast.error("Thao tác quá nhanh. Vui lòng thử lại sau.");
        } else {
          toast.error(error.message || "Có lỗi xảy ra, vui lòng thử lại sau.");
        }
      } else {
        toast.error("Không thể kết nối máy chủ. Vui lòng kiểm tra mạng.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return <ResetPasswordSuccess />;
  }

  return (
    <ResetPasswordForm
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
}
