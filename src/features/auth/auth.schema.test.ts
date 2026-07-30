import { describe, expect, it } from "vitest";

import { loginSchema } from "./auth.schema";

describe("loginSchema", () => {
  it("accepts an internal username and password", () => {
    expect(loginSchema.safeParse({
      username: " student-01 ",
      password: "Password@123",
    }).data).toEqual({
      username: "student-01",
      password: "Password@123",
    });
  });

  it("requires both credentials", () => {
    const result = loginSchema.safeParse({ username: "", password: "" });

    expect(result.success).toBe(false);
  });
});
