import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { authApi } from "../auth.api";
import { ResetPasswordScreen } from "./ResetPasswordScreen";

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
  isApiClientError: (error: unknown) => (
    error instanceof Error && error.name === "ApiClientError"
  ),
}));

function setResetToken(token: string | null): void {
  const params = token
    ? new URLSearchParams(`token=${token}`)
    : new URLSearchParams();

  vi.mocked(useSearchParams).mockReturnValue(params as never);
}

describe("ResetPasswordScreen", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as never);
  });

  afterEach(() => {
    cleanup();
  });

  it("shows the invalid-link screen when the token is missing", () => {
    setResetToken(null);

    render(<ResetPasswordScreen />);

    expect(screen.getByText("Liên kết không hợp lệ")).toBeInTheDocument();
    expect(screen.getByRole("button", {
      name: /Yêu cầu đặt lại mật khẩu mới/i,
    })).toBeInTheDocument();
  });

  it("renders the form when a token is present", () => {
    setResetToken("valid-token");

    render(<ResetPasswordScreen />);

    expect(screen.getByText("Đặt lại mật khẩu")).toBeInTheDocument();
    expect(screen.getByLabelText("Mật khẩu mới")).toBeInTheDocument();
    expect(screen.getByLabelText(/Xác nhận mật khẩu mới/i)).toBeInTheDocument();
  });

  it("rejects a mismatched password confirmation", async () => {
    setResetToken("valid-token");

    render(<ResetPasswordScreen />);

    fireEvent.change(screen.getByLabelText("Mật khẩu mới"), {
      target: { value: "ValidPassword1" },
    });
    fireEvent.change(screen.getByLabelText(/Xác nhận mật khẩu mới/i), {
      target: { value: "DifferentPassword1" },
    });
    fireEvent.click(screen.getByRole("button", {
      name: /Xác nhận đổi mật khẩu/i,
    }));

    await waitFor(() => {
      expect(screen.getByText("Mật khẩu xác nhận không khớp."))
        .toBeInTheDocument();
    });
    expect(authApi.confirmPasswordReset).not.toHaveBeenCalled();
  });

  it("shows the success screen after a successful request", async () => {
    setResetToken("valid-token");
    vi.mocked(authApi.confirmPasswordReset).mockResolvedValueOnce(undefined);

    render(<ResetPasswordScreen />);

    fireEvent.change(screen.getByLabelText("Mật khẩu mới"), {
      target: { value: "ValidPassword1" },
    });
    fireEvent.change(screen.getByLabelText(/Xác nhận mật khẩu mới/i), {
      target: { value: "ValidPassword1" },
    });
    fireEvent.click(screen.getByRole("button", {
      name: /Xác nhận đổi mật khẩu/i,
    }));

    await waitFor(() => {
      expect(screen.getByText("Đặt lại mật khẩu thành công!"))
        .toBeInTheDocument();
    });
    expect(authApi.confirmPasswordReset).toHaveBeenCalledWith({
      token: "valid-token",
      newPassword: "ValidPassword1",
    });
  });

  it("shows the expired-link message for a 400 response", async () => {
    setResetToken("valid-token");
    const error = Object.assign(new Error("Bad Request"), {
      name: "ApiClientError",
      status: 400,
    });
    vi.mocked(authApi.confirmPasswordReset).mockRejectedValueOnce(error);

    render(<ResetPasswordScreen />);

    fireEvent.change(screen.getByLabelText("Mật khẩu mới"), {
      target: { value: "ValidPassword1" },
    });
    fireEvent.change(screen.getByLabelText(/Xác nhận mật khẩu mới/i), {
      target: { value: "ValidPassword1" },
    });
    fireEvent.click(screen.getByRole("button", {
      name: /Xác nhận đổi mật khẩu/i,
    }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Liên kết không hợp lệ, đã hết hạn hoặc đã được sử dụng trước đó.",
      );
    });
  });
});
