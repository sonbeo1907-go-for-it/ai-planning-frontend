import { Metadata } from "next";
import { ForgotPasswordScreen } from "@/features/auth/components";

export const metadata: Metadata = {
  title: "Quên mật khẩu - AI Planning",
  description: "Yêu cầu đặt lại mật khẩu cho tài khoản AI Planning.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordScreen />;
}
