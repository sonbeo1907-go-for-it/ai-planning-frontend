import { API_ROUTES } from "@/constants/api-routes";
import {
  apiClient,
  type ApiClientError,
} from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";

import type {
  AccessTokenResponse,
  CurrentUserProfile,
  LoginCredentials,
} from "./auth.types";

function unwrap<T>(response: ApiResponse<T>): T {
  return response.data;
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AccessTokenResponse> {
    const response = await apiClient.post<
      ApiResponse<AccessTokenResponse>,
      LoginCredentials
    >(API_ROUTES.AUTH.LOGIN, credentials, {
      handleAuthenticationError: false,
    });

    return unwrap(response);
  },

  async refresh(): Promise<AccessTokenResponse> {
    const response = await apiClient.post<ApiResponse<AccessTokenResponse>>(
      API_ROUTES.AUTH.REFRESH,
      undefined,
      { handleAuthenticationError: false },
    );

    return unwrap(response);
  },

  async getCurrentProfile(
    accessToken: string,
    handleAuthenticationError = true,
  ): Promise<CurrentUserProfile> {
    const response = await apiClient.get<ApiResponse<CurrentUserProfile>>(
      API_ROUTES.PROFILE,
      { accessToken, handleAuthenticationError },
    );

    return unwrap(response);
  },

  async logout(accessToken: string | null): Promise<void> {
    await apiClient.post<null>(API_ROUTES.AUTH.LOGOUT, undefined, {
      accessToken,
      handleAuthenticationError: false,
    });
  },
};

export function isApiClientError(error: unknown): error is ApiClientError {
  return error instanceof Error && error.name === "ApiClientError";
}
