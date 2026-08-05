import { Suspense } from "react";
import { ResetPasswordScreen } from "@/features/auth/components/ResetPasswordScreen";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Đặt lại mật khẩu - AI Planning",
  description: "Đặt lại mật khẩu cho tài khoản AI Planning của bạn",
};

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        }
      >
        <ResetPasswordScreen />
      </Suspense>
    </div>
  );
}
