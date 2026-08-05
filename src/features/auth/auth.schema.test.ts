import { describe, expect, it } from "vitest";

import {
  loginSchema,
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
    const result = registerSchema.safeParse({
      fullName: "Nguyen Van A",
      email: "student@example.com",
      password,
      confirmPassword: password,
    });

    expect(result.success).toBe(false);
  });
});
