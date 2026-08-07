"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

export function ForgotPasswordSuccess() {
  const router = useRouter();

  useEffect(() => {
    // Focus on the back button for accessibility
    document.getElementById("back-to-login-btn")?.focus();
  }, []);

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-sm border border-slate-200 text-center">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-slate-800">Kiểm tra email của bạn</h2>
      <p className="text-slate-600">
        Nếu tài khoản của bạn tồn tại trong hệ thống, một đường dẫn đặt lại mật khẩu đã được gửi đến email của bạn.
        <br />
        Vui lòng kiểm tra cả thư mục Spam/Junk nếu không tìm thấy.
      </p>

      <div className="pt-4">
        <Button
          id="back-to-login-btn"
          variant="primary"
          className="w-full"
          onClick={() => router.push("/login")}
        >
          Quay lại Đăng nhập
        </Button>
      </div>
    </div>
  );
}
