import type { Metadata } from "next";

import { StatusPage } from "@/components/layout";

export const metadata: Metadata = {
  title: "Không có quyền truy cập",
};

export default function ForbiddenPage() {
  return (
    <StatusPage
      code="403"
      title="Không có quyền truy cập"
      description="Tài khoản của bạn không có quyền truy cập chức năng này."
    />
  );
}
