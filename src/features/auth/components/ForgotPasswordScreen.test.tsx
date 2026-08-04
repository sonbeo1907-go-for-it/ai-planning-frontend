import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { ForgotPasswordScreen } from "./ForgotPasswordScreen";
import { authApi } from "../auth.api";
import { toast } from "sonner";
import { ApiClientError } from "@/lib/api-client";

// Mock the API
vi.mock("../auth.api", () => ({
  authApi: {
    requestPasswordReset: vi.fn(),
  },
}));

// Mock env
vi.mock("@/lib/env", () => ({
  env: {
    apiUrl: "http://localhost:8080/api/v1",
    appName: "AI Planning Test",
  },
}));

// Mock toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}));

// Helper to create ApiClientError
const createApiError = (status: number, message: string) => {
  return new ApiClientError({ status, code: `HTTP_${status}`, message, fieldErrors: {} });
};

describe("ForgotPasswordScreen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the forgot password form initially", () => {
    render(<ForgotPasswordScreen />);
    
    expect(screen.getByText("Quên mật khẩu?")).toBeDefined();
    expect(screen.getByLabelText("Địa chỉ Email")).toBeDefined();
    expect(screen.getByRole("button", { name: "Gửi yêu cầu" })).toBeDefined();
  });

  it("shows validation error when submitting empty email", async () => {
    render(<ForgotPasswordScreen />);
    
    const submitBtn = screen.getByRole("button", { name: "Gửi yêu cầu" });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Vui lòng nhập email.")).toBeDefined();
    });
    
    // API should not be called
    expect(authApi.requestPasswordReset).not.toHaveBeenCalled();
  });

  it("shows validation error for invalid email format", async () => {
    render(<ForgotPasswordScreen />);
    
    const emailInput = screen.getByLabelText("Địa chỉ Email");
    fireEvent.change(emailInput, { target: { value: "not-an-email" } });
    
    const submitBtn = screen.getByRole("button", { name: "Gửi yêu cầu" });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Email không hợp lệ.")).toBeDefined();
    });
    
    expect(authApi.requestPasswordReset).not.toHaveBeenCalled();
  });

  it("calls API and shows success screen on successful submission", async () => {
    vi.mocked(authApi.requestPasswordReset).mockResolvedValueOnce(undefined);
    
    render(<ForgotPasswordScreen />);
    
    const emailInput = screen.getByLabelText("Địa chỉ Email");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    
    const submitBtn = screen.getByRole("button", { name: "Gửi yêu cầu" });
    fireEvent.click(submitBtn);

    // Note: Loading state check is skipped here because the mock resolves instantly,
    // causing the DOM to immediately render the Success screen.

    await waitFor(() => {
      expect(authApi.requestPasswordReset).toHaveBeenCalledWith({ email: "test@example.com" });
    });

    // Should switch to success screen
    await waitFor(() => {
      expect(screen.getByText("Kiểm tra email của bạn")).toBeDefined();
    });
    
    // Success component should have the back button
    expect(screen.getByRole("button", { name: "Quay lại Đăng nhập" })).toBeDefined();
  });

  it("shows rate limit toast on 429 error", async () => {
    vi.mocked(authApi.requestPasswordReset).mockRejectedValueOnce(
      createApiError(429, "Too many requests")
    );
    
    render(<ForgotPasswordScreen />);
    
    const emailInput = screen.getByLabelText("Địa chỉ Email");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Gửi yêu cầu" }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Bạn vừa gửi yêu cầu gần đây. Vui lòng thử lại sau 3 phút.");
    });
    
    // Should still show the form
    expect(screen.getByText("Quên mật khẩu?")).toBeDefined();
  });

  it("shows server error toast on 500 error", async () => {
    vi.mocked(authApi.requestPasswordReset).mockRejectedValueOnce(
      createApiError(500, "Internal Server Error")
    );
    
    render(<ForgotPasswordScreen />);
    
    const emailInput = screen.getByLabelText("Địa chỉ Email");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Gửi yêu cầu" }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.");
    });
  });

  it("shows network error toast when exception is not ApiClientError", async () => {
    vi.mocked(authApi.requestPasswordReset).mockRejectedValueOnce(
      new Error("Network Error")
    );
    
    render(<ForgotPasswordScreen />);
    
    const emailInput = screen.getByLabelText("Địa chỉ Email");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Gửi yêu cầu" }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Không thể kết nối máy chủ. Vui lòng kiểm tra mạng.");
    });
  });
});
