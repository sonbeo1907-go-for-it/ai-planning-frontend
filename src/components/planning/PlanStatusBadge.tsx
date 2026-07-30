import {
  type PlanExecutionStatus,
  type PlanReviewStatus,
} from "@/constants/plan-status";
import {
  StatusBadge,
  type StatusBadgeTone,
} from "@/components/ui";

export interface PlanStatusBadgeProps {
  reviewStatus?: PlanReviewStatus;
  executionStatus?: PlanExecutionStatus;
  className?: string;
}

interface StatusPresentation {
  label: string;
  tone: StatusBadgeTone;
}

const reviewStatusPresentation: Record<
  PlanReviewStatus,
  StatusPresentation
> = {
  DRAFT: { label: "Nháp", tone: "neutral" },
  SUBMITTED: { label: "Đã nộp", tone: "info" },
  IN_REVIEW: { label: "Đang duyệt", tone: "warning" },
  REVISION_REQUIRED: { label: "Cần chỉnh sửa", tone: "danger" },
  APPROVED: { label: "Đã duyệt", tone: "success" },
};

const executionStatusPresentation: Record<
  PlanExecutionStatus,
  StatusPresentation
> = {
  NOT_STARTED: { label: "Chưa bắt đầu", tone: "neutral" },
  IN_PROGRESS: { label: "Đang thực hiện", tone: "info" },
  COMPLETED: { label: "Đã hoàn thành", tone: "success" },
  CLOSED: { label: "Đã đóng", tone: "neutral" },
};

/** Displays review and execution statuses separately as required by the SRS. */
export function PlanStatusBadge({
  reviewStatus,
  executionStatus,
  className,
}: PlanStatusBadgeProps) {
  if (!reviewStatus && !executionStatus) {
    return null;
  }

  return (
    <div className={className} aria-label="Trạng thái kế hoạch">
      <div className="flex flex-wrap gap-2">
        {reviewStatus && (
          <StatusBadge tone={reviewStatusPresentation[reviewStatus].tone}>
            Duyệt: {reviewStatusPresentation[reviewStatus].label}
          </StatusBadge>
        )}
        {executionStatus && (
          <StatusBadge tone={executionStatusPresentation[executionStatus].tone}>
            Thực hiện: {executionStatusPresentation[executionStatus].label}
          </StatusBadge>
        )}
      </div>
    </div>
  );
}
