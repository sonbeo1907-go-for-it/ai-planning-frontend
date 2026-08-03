import { describe, expect, it } from "vitest";

import { loginSchema } from "./auth.schema";

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
