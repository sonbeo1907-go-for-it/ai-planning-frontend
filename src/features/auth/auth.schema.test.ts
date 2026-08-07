import { describe, expect, it } from "vitest";

import {
  changePasswordSchema,
  loginSchema,
  passwordResetConfirmSchema,
  registerSchema,
} from "./auth.schema";

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
    expect(loginSchema.safeParse({
      email: "not-an-email",
      password: "Password@123",
    }).success).toBe(false);
  });

  it("requires both credentials", () => {
    expect(loginSchema.safeParse({ email: "", password: "" }).success)
      .toBe(false);
  });
});

describe("registerSchema", () => {
  it("accepts a valid Student registration request", () => {
    expect(registerSchema.safeParse({
      fullName: " Nguyen Van A ",
      email: " student@example.com ",
      password: "Password123",
      confirmPassword: "Password123",
    }).data).toEqual({
      fullName: "Nguyen Van A",
      email: "student@example.com",
      password: "Password123",
      confirmPassword: "Password123",
    });
  });

  it("rejects mismatched password confirmation", () => {
    const result = registerSchema.safeParse({
      fullName: "Nguyen Van A",
      email: "student@example.com",
      password: "Password123",
      confirmPassword: "Different123",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues).toContainEqual(expect.objectContaining({
      path: ["confirmPassword"],
    }));
  });

  it.each([
    ["Password", "missing a digit"],
    ["password123", "missing an uppercase letter"],
    ["PASSWORD123", "missing a lowercase letter"],
    ["Pass1", "shorter than eight characters"],
  ])("rejects a password %s (%s)", (password) => {
    expect(registerSchema.safeParse({
      fullName: "Nguyen Van A",
      email: "student@example.com",
      password,
      confirmPassword: password,
    }).success).toBe(false);
  });
});

describe("changePasswordSchema", () => {
  it("accepts a password that follows the shared account policy", () => {
    expect(changePasswordSchema.safeParse({
      currentPassword: "OldPassword123",
      newPassword: "NewPassword123",
      confirmPassword: "NewPassword123",
    }).success).toBe(true);
  });

  it("rejects a new password that matches the current password", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "SamePassword123",
      newPassword: "SamePassword123",
      confirmPassword: "SamePassword123",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues).toContainEqual(expect.objectContaining({
      path: ["newPassword"],
    }));
  });
});

describe("passwordResetConfirmSchema", () => {
  it("uses the same password policy as registration", () => {
    expect(passwordResetConfirmSchema.safeParse({
      newPassword: "NewPassword123",
      confirmPassword: "NewPassword123",
    }).success).toBe(true);
  });
});
