"use client";

import { useCallback, useEffect, useState } from "react";
import { userService } from "../user.service";
import {
  CreateUserRequest,
  UpdateUserRequest,
  User,
  UserSearchParam,
} from "../user.types";
import { PageResponse } from "@/types/pagination";
import { ApiClientError } from "@/lib/api-client";

export function useUsers(initialParams?: UserSearchParam) {
  const [params, setParams] = useState<UserSearchParam>({
    page: 0,
    size: 10,
    keyword: "",
    role: "",
    status: "",
    ...initialParams,
  });

  const [pageData, setPageData] = useState<PageResponse<User>>({
    content: [],
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getUsers(params);
      setPageData(response.data);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError("Đã xảy ra lỗi khi tải danh sách người dùng.");
      }
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearchChange = (keyword: string) => {
    setParams((prev) => ({ ...prev, keyword, page: 0 }));
  };

  const handleRoleFilter = (role: UserSearchParam["role"]) => {
    setParams((prev) => ({ ...prev, role, page: 0 }));
  };

  const handleStatusFilter = (status: UserSearchParam["status"]) => {
    setParams((prev) => ({ ...prev, status, page: 0 }));
  };

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  const createUser = async (payload: CreateUserRequest) => {
    const response = await userService.createUser(payload);
    await fetchUsers();
    return response.data;
  };

  const updateUser = async (id: string, payload: UpdateUserRequest) => {
    const response = await userService.updateUser(id, payload);
    await fetchUsers();
    return response.data;
  };

  const deactivateUser = async (id: string) => {
    const response = await userService.deactivateUser(id);
    await fetchUsers();
    return response.data;
  };

  return {
    users: pageData.content,
    pagination: pageData,
    params,
    loading,
    error,
    refetch: fetchUsers,
    handleSearchChange,
    handleRoleFilter,
    handleStatusFilter,
    handlePageChange,
    createUser,
    updateUser,
    deactivateUser,
  };
}
