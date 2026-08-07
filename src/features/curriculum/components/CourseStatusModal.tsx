"use client";

import { useState } from "react";

import { WarningPanel } from "@/components/planning";
import { Button, Modal, StatusBadge } from "@/components/ui";
import { ApiClientError } from "@/lib/api-client";

import type { CourseResponse } from "../curriculum.types";

export interface CourseStatusModalProps {
  course: CourseResponse | null;
  onClose: () => void;
  onConfirm: (course: CourseResponse) => Promise<unknown>;
}

export function CourseStatusModal({
  course,
  onClose,
  onConfirm,
}: CourseStatusModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  if (!course) {
    return null;
  }

  const isDeactivating = course.status === "ACTIVE";

  async function handleConfirm() {
    if (!course) {
      return;
    }

    setIsSubmitting(true);
    setError(undefined);

    try {
      await onConfirm(course);
      handleClose();
    } catch (requestError) {
      setError(
        requestError instanceof ApiClientError
          ? requestError.message
          : "Không thể thay đổi trạng thái khóa học. Vui lòng thử lại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleClose() {
    setError(undefined);
    onClose();
  }

  return (
    <Modal
      isOpen
      title={isDeactivating ? "Ngừng hoạt động khóa học" : "Mở lại khóa học"}
      onClose={() => {
        if (!isSubmitting) {
          handleClose();
        }
      }}
      footer={(
        <>
          <Button variant="ghost" disabled={isSubmitting} onClick={handleClose}>
            Hủy
          </Button>
          <Button
            variant={isDeactivating ? "danger" : "primary"}
            isLoading={isSubmitting}
            onClick={() => void handleConfirm()}
          >
            {isDeactivating ? "Ngừng hoạt động" : "Mở lại khóa học"}
          </Button>
        </>
      )}
    >
      <div className="grid gap-4 text-sm text-slate-700">
        {error && (
          <WarningPanel tone="error" title="Không thể cập nhật trạng thái">
            {error}
          </WarningPanel>
        )}

        <div>
          <p className="font-semibold text-slate-950">{course.name}</p>
          <p className="mt-1 font-mono text-xs text-slate-500">{course.code}</p>
        </div>

        <div className="flex items-center gap-2">
          <span>Trạng thái hiện tại:</span>
          <StatusBadge tone={isDeactivating ? "success" : "neutral"}>
            {isDeactivating ? "Đang hoạt động" : "Ngừng hoạt động"}
          </StatusBadge>
        </div>

        {isDeactivating ? (
          <div className="rounded-md bg-amber-50 p-3 text-amber-900">
            Khóa học vẫn được lưu và xem trong lịch sử, nhưng không thể dùng để
            tạo lớp hoặc enrollment mới. Dữ liệu hiện có không bị xóa.
          </div>
        ) : (
          <p>
            Sau khi mở lại, khóa học có thể tiếp tục được dùng cho lớp và
            enrollment mới.
          </p>
        )}
      </div>
    </Modal>
  );
}
