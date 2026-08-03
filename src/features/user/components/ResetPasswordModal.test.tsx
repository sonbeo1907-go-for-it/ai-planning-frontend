import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResetPasswordModal } from "./ResetPasswordModal";

// Mock matchMedia which is required by some UI libraries (if any) or jsdom
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const mockUser = {
  id: 1,
  name: "Nguyễn Văn A",
  email: "a@example.com",
  status: "ACTIVE",
};

const mockDisabledUser = {
  ...mockUser,
  status: "LOCKED",
};

describe("ResetPasswordModal", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("should not render if user is null or isOpen is false", () => {
    const { container, rerender } = render(
      <ResetPasswordModal isOpen={true} onClose={mockOnClose} user={null} />
    );
    expect(container).toBeEmptyDOMElement();

    rerender(<ResetPasswordModal isOpen={false} onClose={mockOnClose} user={mockUser} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should render user info and active status correctly", () => {
    render(<ResetPasswordModal isOpen={true} onClose={mockOnClose} user={mockUser} />);
    
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Nguyễn Văn A")).toBeInTheDocument();
    expect(screen.getByText("a@example.com")).toBeInTheDocument();
    expect(screen.getByText("Đang hoạt động")).toBeInTheDocument();
    // Warning should not be visible
    expect(screen.queryByText("Người dùng này đang bị vô hiệu hóa.")).not.toBeInTheDocument();
  });

  it("should render warning panel for disabled users", () => {
    render(<ResetPasswordModal isOpen={true} onClose={mockOnClose} user={mockDisabledUser} />);
    
    expect(screen.getByText("Đã vô hiệu hóa")).toBeInTheDocument();
    expect(screen.getByText("Người dùng này đang bị vô hiệu hóa.")).toBeInTheDocument();
    expect(screen.getByText("Việc đặt lại mật khẩu không kích hoạt lại tài khoản.")).toBeInTheDocument();
  });

  it("should enable submit button only when policies are met and passwords match", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordModal isOpen={true} onClose={mockOnClose} user={mockUser} />);
    
    const passwordInput = screen.getByPlaceholderText("Nhập mật khẩu mới");
    const confirmInput = screen.getByPlaceholderText("Nhập lại mật khẩu mới");
    const submitButton = screen.getByRole("button", { name: "Đặt lại mật khẩu" });

    expect(submitButton).toBeDisabled();

    // Type invalid password (missing special char and number)
    await user.type(passwordInput, "Password");
    expect(submitButton).toBeDisabled();

    // Clear and type valid password
    await user.clear(passwordInput);
    await user.type(passwordInput, "Valid123@Pass");
    await user.type(confirmInput, "Valid123@Pass");

    // Wait for the form state to update and validation to pass
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it("should show error when passwords do not match", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordModal isOpen={true} onClose={mockOnClose} user={mockUser} />);
    
    const passwordInput = screen.getByPlaceholderText("Nhập mật khẩu mới");
    const confirmInput = screen.getByPlaceholderText("Nhập lại mật khẩu mới");

    await user.type(passwordInput, "Valid123@Pass");
    await user.type(confirmInput, "Different123!");

    // Zod validation message for confirm password should appear
    await waitFor(() => {
      expect(screen.getByText("Mật khẩu xác nhận không khớp.")).toBeInTheDocument();
    });
  });
});
