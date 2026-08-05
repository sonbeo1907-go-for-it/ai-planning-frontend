import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ResetPasswordScreen } from "./ResetPasswordScreen";
import { authApi } from "../auth.api";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";

// Mock external dependencies
vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
  useRouter: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock("../auth.api", () => ({
  authApi: {
    confirmPasswordReset: vi.fn(),
  },
  isApiClientError: (error: any) => error?.name === "ApiClientError",
}));

describe("ResetPasswordScreen", () => {
  const mockPush = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({ push: mockPush });
  });

  afterEach(() => {
    cleanup();
  });

  it("should show invalid token screen if token is missing from URL", () => {
    (useSearchParams as any).mockReturnValue({
      get: vi.fn().mockReturnValue(null),
    });

    render(<ResetPasswordScreen />);

    expect(screen.getByText("Liên kết không hợp lệ")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Yêu cầu đặt lại mật khẩu mới/i })).toBeInTheDocument();
  });

  it("should render form if token is present", () => {
    (useSearchParams as any).mockReturnValue({
      get: vi.fn().mockReturnValue("valid-token"),
    });

    render(<ResetPasswordScreen />);

    expect(screen.getByText("Đặt lại mật khẩu")).toBeInTheDocument();
    expect(screen.getByLabelText("Mật khẩu mới")).toBeInTheDocument();
    expect(screen.getByLabelText(/Xác nhận mật khẩu mới/i)).toBeInTheDocument();
  });

  it("should validate matching passwords", async () => {
    (useSearchParams as any).mockReturnValue({
      get: vi.fn().mockReturnValue("valid-token"),
    });

    render(<ResetPasswordScreen />);

    const newPasswordInput = screen.getByLabelText("Mật khẩu mới");
    const confirmInput = screen.getByLabelText(/Xác nhận mật khẩu mới/i);
    const submitBtn = screen.getByRole("button", { name: /Xác nhận đổi mật khẩu/i });

    fireEvent.change(newPasswordInput, { target: { value: "ValidPassword1!" } });
    fireEvent.change(confirmInput, { target: { value: "DifferentPassword1!" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Mật khẩu xác nhận không khớp.")).toBeInTheDocument();
    });
    expect(authApi.confirmPasswordReset).not.toHaveBeenCalled();
  });

  it("should display success screen on successful api call", async () => {
    (useSearchParams as any).mockReturnValue({
      get: vi.fn().mockReturnValue("valid-token"),
    });
    
    (authApi.confirmPasswordReset as any).mockResolvedValueOnce(undefined);

    render(<ResetPasswordScreen />);

    const newPasswordInput = screen.getByLabelText("Mật khẩu mới");
    const confirmInput = screen.getByLabelText(/Xác nhận mật khẩu mới/i);
    const submitBtn = screen.getByRole("button", { name: /Xác nhận đổi mật khẩu/i });

    fireEvent.change(newPasswordInput, { target: { value: "ValidPassword1!" } });
    fireEvent.change(confirmInput, { target: { value: "ValidPassword1!" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Đặt lại mật khẩu thành công!")).toBeInTheDocument();
    });

    expect(authApi.confirmPasswordReset).toHaveBeenCalledWith({
      token: "valid-token",
      newPassword: "ValidPassword1!",
    });
  });

  it("should handle api 400 error and show toast", async () => {
    (useSearchParams as any).mockReturnValue({
      get: vi.fn().mockReturnValue("valid-token"),
    });

    const error = new Error("Bad Request");
    error.name = "ApiClientError";
    (error as any).status = 400;
    (authApi.confirmPasswordReset as any).mockRejectedValueOnce(error);

    render(<ResetPasswordScreen />);

    const newPasswordInput = screen.getByLabelText("Mật khẩu mới");
    const confirmInput = screen.getByLabelText(/Xác nhận mật khẩu mới/i);
    const submitBtn = screen.getByRole("button", { name: /Xác nhận đổi mật khẩu/i });

    fireEvent.change(newPasswordInput, { target: { value: "ValidPassword1!" } });
    fireEvent.change(confirmInput, { target: { value: "ValidPassword1!" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Liên kết không hợp lệ, đã hết hạn hoặc đã được sử dụng trước đó."
      );
    });
  });
});
