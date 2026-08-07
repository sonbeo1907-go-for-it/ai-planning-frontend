import { beforeEach, describe, expect, it, vi } from "vitest";

import { API_ROUTES } from "@/constants/api-routes";
import { apiClient } from "@/lib/api-client";

import { curriculumService } from "./curriculum.service";

vi.mock("@/features/auth/auth.store", () => ({
  useAuthStore: {
    getState: () => ({ accessToken: "admin-access-token" }),
  },
}));

vi.mock("@/lib/api-client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
  },
}));

describe("curriculumService course API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("searches the backend course collection with supported query fields", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { content: [] } });

    await curriculumService.getCourses({
      search: "java",
      status: "ACTIVE",
      page: 1,
      size: 10,
    });

    expect(apiClient.get).toHaveBeenCalledWith(API_ROUTES.COURSES, {
      accessToken: "admin-access-token",
      query: {
        search: "java",
        status: "ACTIVE",
        page: 1,
        size: 10,
      },
    });
  });

  it("creates a course without a client-selected status", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: {} });
    const payload = {
      code: "FULLSTACK_JAVA",
      name: "Fullstack Java",
      description: "Training program",
    };

    await curriculumService.createCourse(payload);

    expect(apiClient.post).toHaveBeenCalledWith(
      API_ROUTES.COURSES,
      payload,
      { accessToken: "admin-access-token" },
    );
  });

  it("patches only mutable course details", async () => {
    vi.mocked(apiClient.patch).mockResolvedValue({ data: {} });
    const payload = {
      name: "Fullstack Java Advanced",
      description: "Updated program",
    };

    await curriculumService.updateCourse("course-id", payload);

    expect(apiClient.patch).toHaveBeenCalledWith(
      `${API_ROUTES.COURSES}/course-id`,
      payload,
      { accessToken: "admin-access-token" },
    );
  });

  it("uses explicit idempotent status action endpoints", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: {} });

    await curriculumService.deactivateCourse("course-id");
    await curriculumService.activateCourse("course-id");

    expect(apiClient.post).toHaveBeenNthCalledWith(
      1,
      `${API_ROUTES.COURSES}/course-id/deactivate`,
      undefined,
      { accessToken: "admin-access-token" },
    );
    expect(apiClient.post).toHaveBeenNthCalledWith(
      2,
      `${API_ROUTES.COURSES}/course-id/activate`,
      undefined,
      { accessToken: "admin-access-token" },
    );
  });
});
