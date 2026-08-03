import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserListTable } from "./UserListTable";
import { useAuthStore } from "@/features/auth";

// Mock the auth store to control user roles
vi.mock("@/features/auth", () => ({
  useAuthStore: vi.fn(),
}));

// Mock DropdownMenu if needed, but integration test with the real one is better
// We'll test with the real DropdownMenu

describe("UserListTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the table with mock users", () => {
    vi.mocked(useAuthStore).mockImplementation((selector: any) => selector({ profile: { role: "ADMIN" } }));
    render(<UserListTable />);
    
    // Check if table headers exist
    expect(screen.getByText("Tên người dùng")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Vai trò")).toBeInTheDocument();
    
    // Check if mock data is rendered
    expect(screen.getByText("Nguyễn Văn A")).toBeInTheDocument();
    expect(screen.getByText("a.nguyen@example.com")).toBeInTheDocument();
    expect(screen.getByText("Trần Thị B")).toBeInTheDocument();
  });

  it("should hide 'Đặt lại mật khẩu' for non-admin users", async () => {
    const user = userEvent.setup();
    // Simulate an INSTRUCTOR logged in
    vi.mocked(useAuthStore).mockImplementation((selector: any) => selector({ profile: { role: "INSTRUCTOR" } }));
    
    render(<UserListTable />);
    
    // Find the first dropdown trigger
    const triggers = screen.getAllByRole("button");
    // Click the first dropdown
    await user.click(triggers[0]);
    
    // Verify options inside dropdown
    expect(screen.getByText("Xem chi tiết")).toBeInTheDocument();
    expect(screen.getByText("Chỉnh sửa")).toBeInTheDocument();
    expect(screen.queryByText("Đặt lại mật khẩu")).not.toBeInTheDocument();
  });

  it("should show 'Đặt lại mật khẩu' for admin users", async () => {
    const user = userEvent.setup();
    // Simulate an ADMIN logged in
    vi.mocked(useAuthStore).mockImplementation((selector: any) => selector({ profile: { role: "ADMIN" } }));
    
    render(<UserListTable />);
    
    // Find the first dropdown trigger
    const triggers = screen.getAllByRole("button");
    // Click the first dropdown
    await user.click(triggers[0]);
    
    // Verify "Đặt lại mật khẩu" is present
    expect(screen.getByText("Đặt lại mật khẩu")).toBeInTheDocument();
  });

  it("should open ResetPasswordModal when clicking 'Đặt lại mật khẩu'", async () => {
    const user = userEvent.setup();
    vi.mocked(useAuthStore).mockImplementation((selector: any) => selector({ profile: { role: "ADMIN" } }));
    
    render(<UserListTable />);
    
    // Click the first dropdown
    const triggers = screen.getAllByRole("button");
    await user.click(triggers[0]);
    
    // Click 'Đặt lại mật khẩu'
    const resetPasswordButton = screen.getByText("Đặt lại mật khẩu");
    await user.click(resetPasswordButton);
    
    // Verify modal opens (title should be visible)
    // There are multiple elements with text "Đặt lại mật khẩu" (button and title)
    // We check for the dialog role
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    
    // Check if the correct user info is passed to the modal
    const dialogWithin = within(dialog);
    expect(dialogWithin.getByText("Nguyễn Văn A")).toBeInTheDocument();
  });
});
