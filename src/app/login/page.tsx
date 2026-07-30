import type { Metadata } from "next";

import { LoginScreen } from "@/features/auth";

export const metadata: Metadata = {
  title: "Đăng nhập",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;

  return <LoginScreen reason={reason} />;
}
