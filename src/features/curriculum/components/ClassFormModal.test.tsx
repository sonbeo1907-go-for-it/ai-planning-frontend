import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ClassFormModal } from "./ClassFormModal";
import { ApiClientError } from "@/lib/api-client";
import { curriculumService } from "../curriculum.service";

vi.mock("@/lib/env", () => ({
  env: { apiUrl: "http://localhost:8080" },
}));

vi.mock("../curriculum.service", () => ({
  curriculumService: {
    getCourses: vi.fn(),
  },
}));

describe("ClassFormModal", () => {
  const mockOnClose = vi.fn();
  const mockOnSubmitCreate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (curriculumService.getCourses as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: {
        content: [
          { id: "123e4567-e89b-12d3-a456-426614174000", code: "COURSE1", name: "Course 1" },
        ],
      },
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("should not render if isOpen is false", () => {
    render(<ClassFormModal isOpen={false} onClose={mockOnClose} onSubmitCreate={mockOnSubmitCreate} />);
    expect(screen.queryByText("Tạo lớp học mới")).not.toBeInTheDocument();
  });

  it("should render correctly when isOpen is true", () => {
    render(<ClassFormModal isOpen={true} onClose={mockOnClose} onSubmitCreate={mockOnSubmitCreate} />);
    
    expect(screen.getByText("Tạo lớp học mới")).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /Khóa học/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ví dụ: JAV101-01")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ví dụ: Java Basic K1")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tạo lớp học" })).toBeInTheDocument();
  });

  it("should display validation errors if required fields are missing", async () => {
    const user = userEvent.setup();
    render(<ClassFormModal isOpen={true} onClose={mockOnClose} onSubmitCreate={mockOnSubmitCreate} />);
    
    const submitButton = screen.getByRole("button", { name: "Tạo lớp học" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid course ID format")).toBeInTheDocument();
      expect(screen.getByText("Class code is required")).toBeInTheDocument();
      expect(screen.getByText("Class name is required")).toBeInTheDocument();
    });

    expect(mockOnSubmitCreate).not.toHaveBeenCalled();
  });

  it("should submit successfully with valid data", async () => {
    const user = userEvent.setup();
    mockOnSubmitCreate.mockResolvedValueOnce(undefined);
    
    render(<ClassFormModal isOpen={true} onClose={mockOnClose} onSubmitCreate={mockOnSubmitCreate} />);
    
    // Wait for the mock course to appear in the select
    await waitFor(() => {
        expect(screen.getByRole("option", { name: "COURSE1 - Course 1" })).toBeInTheDocument();
    });

    await user.selectOptions(screen.getByRole("combobox", { name: /Khóa học/i }), "123e4567-e89b-12d3-a456-426614174000");
    await user.type(screen.getByPlaceholderText("Ví dụ: JAV101-01"), "CLASS01");
    await user.type(screen.getByPlaceholderText("Ví dụ: Java Basic K1"), "Test Class");
    
    const submitButton = screen.getByRole("button", { name: "Tạo lớp học" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmitCreate).toHaveBeenCalledWith({
        courseId: "123e4567-e89b-12d3-a456-426614174000",
        code: "CLASS01",
        name: "Test Class",
        description: "",
        status: "PLANNED",
      });
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("should display server error if submission fails", async () => {
    const user = userEvent.setup();
    const error = new ApiClientError({
      status: 404,
      code: "NOT_FOUND",
      message: "Course not found",
      fieldErrors: {},
    });
    mockOnSubmitCreate.mockRejectedValueOnce(error);
    
    render(<ClassFormModal isOpen={true} onClose={mockOnClose} onSubmitCreate={mockOnSubmitCreate} />);
    
    await waitFor(() => {
        expect(screen.getByRole("option", { name: "COURSE1 - Course 1" })).toBeInTheDocument();
    });

    await user.selectOptions(screen.getByRole("combobox", { name: /Khóa học/i }), "123e4567-e89b-12d3-a456-426614174000");
    await user.type(screen.getByPlaceholderText("Ví dụ: JAV101-01"), "CLASS01");
    await user.type(screen.getByPlaceholderText("Ví dụ: Java Basic K1"), "Test Class");
    
    const submitButton = screen.getByRole("button", { name: "Tạo lớp học" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Course not found")).toBeInTheDocument();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });
});
