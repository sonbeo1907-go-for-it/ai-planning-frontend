import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { CourseResponse } from "../curriculum.types";
import { CourseStatusModal } from "./CourseStatusModal";

vi.mock("@/lib/env", () => ({
  env: { apiUrl: "http://localhost:8080/api/v1" },
}));

const activeCourse: CourseResponse = {
  id: "2bf5ab4a-4971-4c71-a1cb-528ec4142230",
  code: "FULLSTACK_JAVA",
  name: "Fullstack Java",
  description: null,
  status: "ACTIVE",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-02T00:00:00Z",
  createdBy: "fe08bdf1-6e74-4b7b-84e7-caf7d145aa01",
  updatedBy: "fe08bdf1-6e74-4b7b-84e7-caf7d145aa01",
  version: 1,
};

describe("CourseStatusModal", () => {
  afterEach(() => {
    cleanup();
  });

  it("explains the inactive-course rule and confirms deactivation", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();

    render(
      <CourseStatusModal
        course={activeCourse}
        onClose={onClose}
        onConfirm={onConfirm}
      />,
    );

    expect(screen.getByText(/không thể dùng để tạo lớp hoặc enrollment mới/i))
      .toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Ngừng hoạt động" }));

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledWith(activeCourse);
    });
    expect(onClose).toHaveBeenCalledOnce();
  });
});
