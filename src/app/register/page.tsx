import type { Metadata } from "next";

import { RegisterScreen } from "@/features/auth";

export const metadata: Metadata = {
  title: "Đăng ký",
};

export default function RegisterPage() {
  return <RegisterScreen />;
}
