import { API_ROUTES } from "@/constants/api-routes";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/features/auth/auth.store";
import { UserRole } from "@/features/auth/auth.types";
import {
  UserSearchParam,
  UserDetailApiResponse,
  UsersApiResponse,
} from "./user.types";

function authenticatedRequestOptions() {
  return { accessToken: useAuthStore.getState().accessToken };
}

export const userService = {
  getUsers(params?: UserSearchParam): Promise<UsersApiResponse> {
    return apiClient.get<UsersApiResponse>(API_ROUTES.USERS, {
      ...authenticatedRequestOptions(),
      query: params as Record<string, string | number | boolean>,
    });
  },

  getUserById(id: string): Promise<UserDetailApiResponse> {
    return apiClient.get<UserDetailApiResponse>(
      `${API_ROUTES.USERS}/${id}`,
      authenticatedRequestOptions(),
    );
  },

  updateUserRole(id: string, role: UserRole): Promise<UserDetailApiResponse> {
    return apiClient.patch<UserDetailApiResponse, { role: UserRole }>(
      `${API_ROUTES.USERS}/${id}/role`,
      { role },
      authenticatedRequestOptions(),
    );
  },

  activateUser(id: string): Promise<UserDetailApiResponse> {
    return apiClient.post<UserDetailApiResponse>(
      `${API_ROUTES.USERS}/${id}/activate`,
      undefined,
      authenticatedRequestOptions(),
    );
  },

  deactivateUser(id: string): Promise<UserDetailApiResponse> {
    return apiClient.delete<UserDetailApiResponse>(
      `${API_ROUTES.USERS}/${id}`,
      authenticatedRequestOptions(),
    );
  },
};
