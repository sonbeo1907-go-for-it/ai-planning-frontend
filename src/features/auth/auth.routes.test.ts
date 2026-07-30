import { describe, expect, it } from "vitest";

import { APP_ROUTES } from "@/constants/app-routes";

import { getRoleHomeRoute } from "./auth.routes";

describe("getRoleHomeRoute", () => {
  it.each([
    ["STUDENT", APP_ROUTES.STUDENT.DASHBOARD],
    ["INSTRUCTOR", APP_ROUTES.INSTRUCTOR.DASHBOARD],
    ["ADMIN", APP_ROUTES.ADMIN.DASHBOARD],
  ] as const)("routes %s to the correct landing page", (role, expected) => {
    expect(getRoleHomeRoute(role)).toBe(expected);
  });
});
