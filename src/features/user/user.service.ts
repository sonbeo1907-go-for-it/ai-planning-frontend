import { API_ROUTES } from "@/constants/api-routes";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/features/auth/auth.store";
import {
  CreateUserRequest,
  UpdateUserRequest,
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

  createUser(payload: CreateUserRequest): Promise<UserDetailApiResponse> {
    return apiClient.post<UserDetailApiResponse, CreateUserRequest>(
      API_ROUTES.USERS,
      payload,
      authenticatedRequestOptions(),
    );
  },

  updateUser(id: string, payload: UpdateUserRequest): Promise<UserDetailApiResponse> {
    return apiClient.put<UserDetailApiResponse, UpdateUserRequest>(
      `${API_ROUTES.USERS}/${id}`,
      payload,
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
