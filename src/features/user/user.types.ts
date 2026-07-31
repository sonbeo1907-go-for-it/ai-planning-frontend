import { AccountStatus, UserRole } from "@/features/auth/auth.types";
import { PageRequest, PageResponse } from "@/types/pagination";
import { ApiResponse } from "@/types/api";

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface UserSearchParam extends PageRequest {
  keyword?: string;
  role?: UserRole | "";
  status?: AccountStatus | "";
}

export interface CreateUserRequest {
  username: string;
  password?: string;
  fullName: string;
  email: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  role?: UserRole;
  status?: AccountStatus;
  password?: string;
}

export type UsersApiResponse = ApiResponse<PageResponse<User>>;
export type UserDetailApiResponse = ApiResponse<User>;
