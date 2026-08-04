import { describe, expect, it } from "vitest";

import { loginSchema, changePasswordSchema } from "./auth.schema";

describe("loginSchema", () => {
  it("accepts an email and password", () => {
    expect(loginSchema.safeParse({
      email: " admin@aiplanning.local ",
      password: "Password@123",
    }).data).toEqual({
      email: "admin@aiplanning.local",
      password: "Password@123",
    });
  });

  it("rejects an invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "Password@123",
    });

    expect(result.success).toBe(false);
  });

  it("requires both credentials", () => {
    const result = loginSchema.safeParse({ email: "", password: "" });

    expect(result.success).toBe(false);
  });
});

describe("changePasswordSchema", () => {
  it("accepts valid passwords", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "OldPassword123",
      newPassword: "NewPassword123!",
      confirmPassword: "NewPassword123!",
    });
    expect(result.success).toBe(true);
  });

  it("rejects when new password is too short", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "OldPassword123",
      newPassword: "Short1!",
      confirmPassword: "Short1!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects when new password matches current password", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "SamePassword123!",
      newPassword: "SamePassword123!",
      confirmPassword: "SamePassword123!",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Mật khẩu mới phải khác mật khẩu hiện tại.");
    }
  });

  it("rejects when confirm password does not match", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "OldPassword123",
      newPassword: "NewPassword123!",
      confirmPassword: "DifferentPassword123!",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Mật khẩu xác nhận không khớp.");
    }
  });
});
