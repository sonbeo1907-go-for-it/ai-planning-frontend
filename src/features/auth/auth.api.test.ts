import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { API_ROUTES } from "@/constants/api-routes";
import { apiClient } from "@/lib/api-client";

import { authApi } from "./auth.api";

vi.mock("@/lib/api-client", () => ({
  apiClient: {
    post: vi.fn(),
  },
  ApiClientError: class ApiClientError extends Error {},
}));

describe("authApi.loginWithGoogle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("posts the Google Identity Services credential to the Google-login endpoint", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      data: {
        accessToken: "local-access-token",
        tokenType: "Bearer",
        expiresIn: 900,
      },
    });

    await expect(authApi.loginWithGoogle("google-id-token"))
      .resolves
      .toEqual({
        accessToken: "local-access-token",
        tokenType: "Bearer",
        expiresIn: 900,
      });

    expect(apiClient.post).toHaveBeenCalledWith(
      API_ROUTES.AUTH.GOOGLE_LOGIN,
      { idToken: "google-id-token" },
      { handleAuthenticationError: false },
    );
  });
});

describe("authApi.register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("posts a public Student registration request", async () => {
    vi.mocked(apiClient.post).mockResolvedValue(null);

    const credentials = {
      email: "student@example.com",
      password: "Password123",
      fullName: "Nguyen Van A",
    };

    await expect(authApi.register(credentials)).resolves.toBeUndefined();

    expect(apiClient.post).toHaveBeenCalledWith(
      API_ROUTES.AUTH.REGISTER,
      credentials,
      { handleAuthenticationError: false },
    );
  });
});
