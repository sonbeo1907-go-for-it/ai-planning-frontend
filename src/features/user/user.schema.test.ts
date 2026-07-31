import { describe, expect, it } from "vitest";
import { createUserSchema, updateUserSchema } from "./user.schema";

describe("User Validation Schemas (US-ADM-01)", () => {
  it("nên validate hợp lệ khi thông tin tạo người dùng đầy đủ", () => {
    const validData = {
      username: "student_01",
      fullName: "Nguyễn Văn A",
      email: "student01@example.com",
      role: "STUDENT",
    };

    const result = createUserSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("nên trả về lỗi khi mã đăng nhập chứa ký tự không hợp lệ", () => {
    const invalidData = {
      username: "student@01!",
      fullName: "Nguyễn Văn A",
      email: "student01@example.com",
      role: "STUDENT",
    };

    const result = createUserSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("nên validate hợp lệ khi cập nhật thông tin người dùng", () => {
    const validUpdate = {
      fullName: "Nguyễn Văn B",
      email: "student02@example.com",
      role: "INSTRUCTOR",
      status: "INACTIVE",
    };

    const result = updateUserSchema.safeParse(validUpdate);
    expect(result.success).toBe(true);
  });
});
