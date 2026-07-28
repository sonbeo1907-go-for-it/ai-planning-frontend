export const PLAN_REVIEW_STATUS = {
  DRAFT: "DRAFT",
  SUBMITTED: "SUBMITTED",
  IN_REVIEW: "IN_REVIEW",
  REVISION_REQUIRED: "REVISION_REQUIRED",
  APPROVED: "APPROVED",
} as const;

export type PlanReviewStatus =
  (typeof PLAN_REVIEW_STATUS)[keyof typeof PLAN_REVIEW_STATUS];

export const PLAN_EXECUTION_STATUS = {
  NOT_STARTED: "NOT_STARTED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CLOSED: "CLOSED",
} as const;

export type PlanExecutionStatus =
  (typeof PLAN_EXECUTION_STATUS)[keyof typeof PLAN_EXECUTION_STATUS];

export const PLAN_ITEM_STATUS = {
  NOT_STARTED: "NOT_STARTED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  BLOCKED: "BLOCKED",
} as const;

export type PlanItemStatus =
  (typeof PLAN_ITEM_STATUS)[keyof typeof PLAN_ITEM_STATUS];
