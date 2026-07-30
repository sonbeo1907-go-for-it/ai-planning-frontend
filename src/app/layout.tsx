import type { Metadata } from "next";
import { Toaster } from "sonner";

import { AuthProvider } from "@/features/auth";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AI Planning",
    template: "%s | AI Planning",
  },
  description:
    "Hệ thống quản lý kế hoạch học tập ngày và tuần.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-white text-slate-950 antialiased">
        <AuthProvider>{children}</AuthProvider>
        <Toaster
          position="top-right"
          richColors
          closeButton
        />
      </body>
    </html>
  );
}
