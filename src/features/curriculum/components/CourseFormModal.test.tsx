import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ApiClientError } from "@/lib/api-client";

import type { CourseResponse } from "../curriculum.types";
import { CourseFormModal } from "./CourseFormModal";

vi.mock("@/lib/env", () => ({
  env: { apiUrl: "http://localhost:8080/api/v1" },
}));

const course: CourseResponse = {
  id: "2bf5ab4a-4971-4c71-a1cb-528ec4142230",
  code: "FULLSTACK_JAVA",
  name: "Fullstack Java",
  description: "Java training",
  status: "ACTIVE",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-02T00:00:00Z",
  createdBy: "fe08bdf1-6e74-4b7b-84e7-caf7d145aa01",
  updatedBy: "fe08bdf1-6e74-4b7b-84e7-caf7d145aa01",
  version: 2,
};

describe("CourseFormModal", () => {
  const onClose = vi.fn();
  const onSubmitCreate = vi.fn();
  const onSubmitUpdate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  function renderModal(selectedCourse: CourseResponse | null = null) {
    return render(
      <CourseFormModal
        isOpen
        course={selectedCourse}
        onClose={onClose}
        onSubmitCreate={onSubmitCreate}
        onSubmitUpdate={onSubmitUpdate}
      />,
    );
  }

  it("does not render when closed", () => {
    render(
      <CourseFormModal
        isOpen={false}
        onClose={onClose}
        onSubmitCreate={onSubmitCreate}
        onSubmitUpdate={onSubmitUpdate}
      />,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("creates an active-by-default course without submitting status", async () => {
    const user = userEvent.setup();
    onSubmitCreate.mockResolvedValueOnce(undefined);
    renderModal();

    expect(screen.queryByLabelText("Trạng thái")).not.toBeInTheDocument();
    await user.type(screen.getByLabelText("Mã khóa học"), "fullstack_java");
    await user.type(screen.getByLabelText("Tên khóa học"), "Fullstack Java");
    await user.type(screen.getByLabelText("Mô tả"), "Java training");
    await user.click(screen.getByRole("button", { name: "Tạo khóa học" }));

    await waitFor(() => {
      expect(onSubmitCreate).toHaveBeenCalledWith({
        code: "FULLSTACK_JAVA",
        name: "Fullstack Java",
        description: "Java training",
      });
    });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("rejects a code containing repeated underscores", async () => {
    const user = userEvent.setup();
    renderModal();

    await user.type(screen.getByLabelText("Mã khóa học"), "FULLSTACK__JAVA");
    await user.type(screen.getByLabelText("Tên khóa học"), "Fullstack Java");
    await user.click(screen.getByRole("button", { name: "Tạo khóa học" }));

    expect(await screen.findByText("Mã chỉ gồm chữ, số và dấu gạch dưới đơn."))
      .toBeInTheDocument();
    expect(onSubmitCreate).not.toHaveBeenCalled();
  });

  it("maps duplicate codes to the code field", async () => {
    const user = userEvent.setup();
    onSubmitCreate.mockRejectedValueOnce(new ApiClientError({
      status: 409,
      code: "COURSE_CODE_ALREADY_EXISTS",
      message: "Course code already exists",
      fieldErrors: {},
    }));
    renderModal();

    await user.type(screen.getByLabelText("Mã khóa học"), "FULLSTACK_JAVA");
    await user.type(screen.getByLabelText("Tên khóa học"), "Fullstack Java");
    await user.click(screen.getByRole("button", { name: "Tạo khóa học" }));

    expect(await screen.findByText("Mã khóa học này đã được sử dụng."))
      .toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("keeps the code immutable and submits only mutable fields when editing", async () => {
    const user = userEvent.setup();
    onSubmitUpdate.mockResolvedValueOnce(undefined);
    renderModal(course);

    expect(screen.getByLabelText("Mã khóa học")).toHaveAttribute("readonly");
    const nameInput = screen.getByLabelText("Tên khóa học");
    await user.clear(nameInput);
    await user.type(nameInput, "Fullstack Java Advanced");
    await user.click(screen.getByRole("button", { name: "Lưu thay đổi" }));

    await waitFor(() => {
      expect(onSubmitUpdate).toHaveBeenCalledWith(course.id, {
        name: "Fullstack Java Advanced",
        description: "Java training",
      });
    });
  });
});
