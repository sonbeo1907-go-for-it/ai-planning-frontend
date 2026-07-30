import type { Metadata } from "next";

import {
  AuthenticatedShell,
  ProfileOverview,
} from "@/features/auth";

export const metadata: Metadata = {
  title: "Hồ sơ cá nhân",
};

export default function ProfilePage() {
  return (
    <AuthenticatedShell
      title="Hồ sơ cá nhân"
      description="Thông tin tài khoản và phạm vi truy cập hiện tại của bạn."
    >
      <ProfileOverview />
    </AuthenticatedShell>
  );
}
