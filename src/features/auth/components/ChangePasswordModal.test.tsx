import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { ChangePasswordModal } from "./ChangePasswordModal";
import { authApi } from "../auth.api";
import { useAuthStore } from "../auth.store";
import { toast } from "sonner";

// Mock the API
vi.mock("../auth.api", () => ({
  authApi: {
    changePassword: vi.fn(),
  },
  isApiClientError: vi.fn((error) => error && error.code),
}));

// Mock the Auth Store
vi.mock("../auth.store", () => ({
  useAuthStore: vi.fn(),
}));

// Mock toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("ChangePasswordModal", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthStore as any).mockReturnValue("mock-access-token");
  });

  afterEach(() => {
    cleanup();
  });

  it("renders correctly when open", () => {
    render(<ChangePasswordModal isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByRole("heading", { name: "Đổi mật khẩu" })).toBeInTheDocument();
    expect(screen.getByLabelText("Mật khẩu hiện tại")).toBeInTheDocument();
    expect(screen.getByLabelText("Mật khẩu mới")).toBeInTheDocument();
    expect(screen.getByLabelText("Xác nhận mật khẩu mới")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Đổi mật khẩu" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Hủy" })).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    const { container } = render(<ChangePasswordModal isOpen={false} onClose={mockOnClose} />);
    expect(screen.queryByRole("heading", { name: "Đổi mật khẩu" })).not.toBeInTheDocument();
  });

  it("calls onClose when cancel button is clicked", () => {
    render(<ChangePasswordModal isOpen={true} onClose={mockOnClose} />);
    fireEvent.click(screen.getByRole("button", { name: "Hủy" }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("toggles password visibility", () => {
    render(<ChangePasswordModal isOpen={true} onClose={mockOnClose} />);
    
    const currentPasswordInput = screen.getByLabelText("Mật khẩu hiện tại");
    expect(currentPasswordInput).toHaveAttribute("type", "password");
    
    const toggleCheckbox = screen.getByLabelText("Hiển thị mật khẩu");
    fireEvent.click(toggleCheckbox);
    
    expect(currentPasswordInput).toHaveAttribute("type", "text");
    
    fireEvent.click(toggleCheckbox);
    expect(currentPasswordInput).toHaveAttribute("type", "password");
  });

  it("disables submit button if policy is not met", async () => {
    render(<ChangePasswordModal isOpen={true} onClose={mockOnClose} />);
    
    const currentPasswordInput = screen.getByLabelText("Mật khẩu hiện tại");
    const newPasswordInput = screen.getByLabelText("Mật khẩu mới");
    const confirmPasswordInput = screen.getByLabelText("Xác nhận mật khẩu mới");
    const submitButton = screen.getByRole("button", { name: "Đổi mật khẩu" });
    
    fireEvent.change(currentPasswordInput, { target: { value: "OldPassword123" } });
    fireEvent.change(newPasswordInput, { target: { value: "weak" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "weak" } });
    
    expect(submitButton).toBeDisabled();
  });

  it("submits the form successfully and calls API", async () => {
    (authApi.changePassword as any).mockResolvedValueOnce({});
    
    render(<ChangePasswordModal isOpen={true} onClose={mockOnClose} />);
    
    fireEvent.change(screen.getByLabelText("Mật khẩu hiện tại"), { target: { value: "OldPassword123" } });
    fireEvent.change(screen.getByLabelText("Mật khẩu mới"), { target: { value: "NewPassword123!" } });
    fireEvent.change(screen.getByLabelText("Xác nhận mật khẩu mới"), { target: { value: "NewPassword123!" } });
    
    const submitButton = screen.getByRole("button", { name: "Đổi mật khẩu" });
    
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(authApi.changePassword).toHaveBeenCalledWith(
        {
          currentPassword: "OldPassword123",
          newPassword: "NewPassword123!",
          confirmPassword: "NewPassword123!",
        },
        "mock-access-token"
      );
      expect(toast.success).toHaveBeenCalledWith(expect.stringContaining("Đổi mật khẩu thành công"));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });
});
