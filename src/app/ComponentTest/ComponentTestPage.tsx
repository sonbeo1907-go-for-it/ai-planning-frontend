"use client";

import {
  useState,
  type ReactNode,
} from "react";
import {
  BookOpen,
  CalendarDays,
  LayoutDashboard,
} from "lucide-react";

import {
  AppShell,
  Header,
  MainContent,
  Sidebar,
  StatusPage,
} from "@/components/layout";
import {
  DurationSummary,
  PlanItemRow,
  PlanStatusBadge,
  WarningPanel,
} from "@/components/planning";
import {
  Button,
  Input,
  LoadingState,
  Modal,
  Pagination,
  SearchInput,
  Select,
  Skeleton,
  StatusBadge,
} from "@/components/ui";

function ComponentSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function ComponentTestPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [course, setCourse] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <AppShell
        sidebar={(
          <Sidebar
            navigationItems={[
              {
                href: "/student/dashboard",
                label: "Tổng quan",
                icon: <LayoutDashboard className="size-5" />,
              },
              {
                href: "/student/weekly-plans",
                label: "Kế hoạch tuần",
                icon: <CalendarDays className="size-5" />,
                badge: 2,
              },
              {
                href: "/student/daily-plans",
                label: "Kế hoạch ngày",
                icon: <BookOpen className="size-5" />,
              },
            ]}
          />
        )}
        header={(
          <Header
            title="Component Test"
            subtitle="Visual sandbox for shared components"
            user={{ name: "Nguyễn Minh Anh", role: "Học viên" }}
            actions={<StatusBadge tone="info">Development</StatusBadge>}
          />
        )}
      >
        <MainContent
          title="Component library"
          description="Các component dùng dữ liệu minh họa, không gọi backend."
          actions={<Button onClick={() => setIsModalOpen(true)}>Mở modal</Button>}
        >
          <div className="grid gap-6">
            <ComponentSection title="Form and input components">
              <div className="grid gap-4 md:grid-cols-3">
                <Input
                  id="example-name"
                  label="Tên mục tiêu"
                  placeholder="Ví dụ: Hoàn thành bài thực hành"
                />
                <SearchInput
                  id="example-search"
                  label="Tìm hoạt động"
                  placeholder="Nhập tên hoạt động"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onClear={() => setSearchQuery("")}
                />
                <Select
                  id="example-course"
                  label="Khóa học"
                  placeholder="Chọn khóa học"
                  value={course}
                  onChange={(event) => setCourse(event.target.value)}
                  options={[
                    { value: "java", label: "JV101 Fullstack Java" },
                    { value: "web", label: "Web Frontend" },
                  ]}
                />
              </div>
            </ComponentSection>

            <ComponentSection title="Buttons, badges, loading, and pagination">
              <div className="flex flex-wrap items-center gap-3">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="ghost">Ghost</Button>
                <Button isLoading>Loading</Button>
                <StatusBadge tone="neutral">Nháp</StatusBadge>
                <StatusBadge tone="info">Đã nộp</StatusBadge>
                <StatusBadge tone="success">Đã duyệt</StatusBadge>
                <StatusBadge tone="warning">Cảnh báo</StatusBadge>
                <StatusBadge tone="danger">Lỗi</StatusBadge>
              </div>
              <div className="grid gap-4 py-6 md:grid-cols-2">
                <LoadingState
                  className="rounded-lg border border-slate-200"
                  label="Đang tải kế hoạch"
                  description="Dữ liệu kế hoạch đang được chuẩn bị."
                />
                <div className="space-y-3 rounded-lg border border-slate-200 p-4">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </div>
              <Pagination page={1} totalPages={4} createHref={(page) => `?page=${page}`} />
            </ComponentSection>

            <ComponentSection title="Plan statuses and duration">
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-lg border border-slate-200 p-4">
                  <p className="mb-3 text-sm font-medium text-slate-700">
                    Review và execution status luôn hiển thị riêng.
                  </p>
                  <PlanStatusBadge
                    reviewStatus="APPROVED"
                    executionStatus="IN_PROGRESS"
                  />
                </div>
                <DurationSummary
                  availableMinutes={180}
                  plannedMinutes={210}
                  actualMinutes={95}
                />
              </div>
            </ComponentSection>

            <ComponentSection title="Plan item and planning warnings">
              <div className="grid gap-4">
                <PlanItemRow
                  activityType="Thực hành"
                  title="Xây dựng giao diện đăng nhập với React Hook Form"
                  durationMinutes={90}
                  priority="HIGH"
                  status="IN_PROGRESS"
                  completionRate={60}
                  isAiSuggested
                  resourceHref="https://example.com/curriculum/login-form"
                  warning="Thời lượng mục này khá cao so với thời gian còn lại trong ngày."
                  actions={<Button variant="secondary">Chỉnh sửa</Button>}
                />
                <WarningPanel
                  title="Kế hoạch vượt thời gian có thể học"
                  warnings={[
                    "Tổng thời lượng vượt 30 phút.",
                    "Hãy giảm phạm vi hoặc chuyển một mục sang ngày khác.",
                  ]}
                  action={<Button variant="ghost">Xem chi tiết</Button>}
                />
              </div>
            </ComponentSection>
          </div>
        </MainContent>
      </AppShell>

      <Modal
        isOpen={isModalOpen}
        title="Modal component"
        onClose={() => setIsModalOpen(false)}
        footer={<Button onClick={() => setIsModalOpen(false)}>Đã hiểu</Button>}
      >
        <p className="text-sm leading-6 text-slate-600">
          Modal này kiểm tra hành vi đóng bằng nút, nền mờ và phím Escape.
        </p>
      </Modal>

      <StatusPage
        code="INFO"
        tone="info"
        title="StatusPage tone preview"
        description="Đây là ví dụ route-level status page với tone info."
        action={<Button variant="secondary">Custom action</Button>}
      />
    </>
  );
}
