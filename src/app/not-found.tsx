import { StatusPage } from "@/components/layout";

export default function NotFound() {
  return (
    <StatusPage
      code="404"
      title="Không tìm thấy trang"
      description="Đường dẫn không tồn tại hoặc tài nguyên đã được di chuyển."
    />
  );
}
