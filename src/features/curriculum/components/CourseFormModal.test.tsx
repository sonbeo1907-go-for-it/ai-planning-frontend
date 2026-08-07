import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CourseFormModal } from "./CourseFormModal";
import { ApiClientError } from "@/lib/api-client";

vi.mock("@/lib/env", () => ({
  env: { apiUrl: "http://localhost:8080" },
}));

describe("CourseFormModal", () => {
  const mockOnClose = vi.fn();
  const mockOnSubmitCreate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("should not render if isOpen is false", () => {
    render(<CourseFormModal isOpen={false} onClose={mockOnClose} onSubmitCreate={mockOnSubmitCreate} />);
    expect(screen.queryByText("Tạo khóa học mới")).not.toBeInTheDocument();
  });

  it("should render correctly when isOpen is true", () => {
    render(<CourseFormModal isOpen={true} onClose={mockOnClose} onSubmitCreate={mockOnSubmitCreate} />);
    
    expect(screen.getByText("Tạo khóa học mới")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ví dụ: JAV101")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ví dụ: Java Basic")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Mô tả khóa học...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tạo khóa học" })).toBeInTheDocument();
  });

  it("should display validation errors if required fields are missing", async () => {
    const user = userEvent.setup();
    render(<CourseFormModal isOpen={true} onClose={mockOnClose} onSubmitCreate={mockOnSubmitCreate} />);
    
    const submitButton = screen.getByRole("button", { name: "Tạo khóa học" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Course code is required")).toBeInTheDocument();
      expect(screen.getByText("Course name is required")).toBeInTheDocument();
    });

    expect(mockOnSubmitCreate).not.toHaveBeenCalled();
  });

  it("should submit successfully with valid data", async () => {
    const user = userEvent.setup();
    mockOnSubmitCreate.mockResolvedValueOnce(undefined);
    
    render(<CourseFormModal isOpen={true} onClose={mockOnClose} onSubmitCreate={mockOnSubmitCreate} />);
    
    await user.type(screen.getByPlaceholderText("Ví dụ: JAV101"), "COURSE101");
    await user.type(screen.getByPlaceholderText("Ví dụ: Java Basic"), "Test Course");
    
    const submitButton = screen.getByRole("button", { name: "Tạo khóa học" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmitCreate).toHaveBeenCalledWith({
        code: "COURSE101",
        name: "Test Course",
        description: "",
        status: "ACTIVE",
      });
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("should display server error if submission fails", async () => {
    const user = userEvent.setup();
    const error = new ApiClientError({
      status: 409,
      code: "CONFLICT",
      message: "Course code already exists",
      fieldErrors: {},
    });
    mockOnSubmitCreate.mockRejectedValueOnce(error);
    
    render(<CourseFormModal isOpen={true} onClose={mockOnClose} onSubmitCreate={mockOnSubmitCreate} />);
    
    await user.type(screen.getByPlaceholderText("Ví dụ: JAV101"), "COURSE101");
    await user.type(screen.getByPlaceholderText("Ví dụ: Java Basic"), "Test Course");
    
    const submitButton = screen.getByRole("button", { name: "Tạo khóa học" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Course code already exists")).toBeInTheDocument();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });
});
