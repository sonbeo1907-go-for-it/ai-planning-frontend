"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import { authApi } from "../auth.api";
import type { PasswordResetRequestFormValues } from "../auth.schema";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { ForgotPasswordSuccess } from "./ForgotPasswordSuccess";
import { ApiClientError } from "@/lib/api-client";

export function ForgotPasswordScreen() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: PasswordResetRequestFormValues) => {
    try {
      setIsLoading(true);
      await authApi.requestPasswordReset(data);
      setIsSuccess(true);
    } catch (error) {
      if (error instanceof ApiClientError) {
        if (error.status === 429) {
          toast.error("Bạn vừa gửi yêu cầu gần đây. Vui lòng thử lại sau 3 phút.");
        } else if (error.status === 500) {
          toast.error("Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.");
        } else {
          toast.error(error.message || "Không thể xử lý yêu cầu. Vui lòng thử lại.");
        }
      } else {
        toast.error("Không thể kết nối máy chủ. Vui lòng kiểm tra mạng.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50">
      <div className="w-full max-w-md mb-6">
        <Link
          href="/login"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại Đăng nhập
        </Link>
      </div>

      {isSuccess ? (
        <ForgotPasswordSuccess />
      ) : (
        <ForgotPasswordForm onSubmit={handleSubmit} isLoading={isLoading} />
      )}
    </div>
  );
}
