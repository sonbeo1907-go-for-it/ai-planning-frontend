import { API_ROUTES } from "@/constants/api-routes";
import { useAuthStore } from "@/features/auth/auth.store";
import { apiClient } from "@/lib/api-client";
import type { ApiResponse, PageResponse } from "@/types/api";

import type {
  ClassResponse,
  CourseResponse,
  CourseSearchParams,
  ChangeClassStatusRequest,
  CreateClassRequest,
  CreateCourseRequest,
  UpdateClassRequest,
  UpdateCourseRequest,
} from "./curriculum.types";

function authenticatedRequestOptions() {
  return { accessToken: useAuthStore.getState().accessToken };
}

function coursePath(courseId: string): string {
  return `${API_ROUTES.COURSES}/${courseId}`;
}

export const curriculumService = {
  createCourse(
    payload: CreateCourseRequest,
  ): Promise<ApiResponse<CourseResponse>> {
    return apiClient.post<ApiResponse<CourseResponse>, CreateCourseRequest>(
      API_ROUTES.COURSES,
      payload,
      authenticatedRequestOptions(),
    );
  },

  getCourses(
    params: CourseSearchParams = {},
  ): Promise<ApiResponse<PageResponse<CourseResponse>>> {
    return apiClient.get<ApiResponse<PageResponse<CourseResponse>>>(
      API_ROUTES.COURSES,
      {
        ...authenticatedRequestOptions(),
        query: {
          search: params.search,
          status: params.status,
          page: params.page,
          size: params.size,
        },
      },
    );
  },

  getCourse(courseId: string): Promise<ApiResponse<CourseResponse>> {
    return apiClient.get<ApiResponse<CourseResponse>>(
      coursePath(courseId),
      authenticatedRequestOptions(),
    );
  },

  updateCourse(
    courseId: string,
    payload: UpdateCourseRequest,
  ): Promise<ApiResponse<CourseResponse>> {
    return apiClient.patch<ApiResponse<CourseResponse>, UpdateCourseRequest>(
      coursePath(courseId),
      payload,
      authenticatedRequestOptions(),
    );
  },

  activateCourse(courseId: string): Promise<ApiResponse<CourseResponse>> {
    return apiClient.post<ApiResponse<CourseResponse>>(
      `${coursePath(courseId)}/activate`,
      undefined,
      authenticatedRequestOptions(),
    );
  },

  deactivateCourse(courseId: string): Promise<ApiResponse<CourseResponse>> {
    return apiClient.post<ApiResponse<CourseResponse>>(
      `${coursePath(courseId)}/deactivate`,
      undefined,
      authenticatedRequestOptions(),
    );
  },

  createClass(payload: CreateClassRequest): Promise<ApiResponse<ClassResponse>> {
    return apiClient.post<ApiResponse<ClassResponse>, CreateClassRequest>(
      API_ROUTES.ADMIN.CLASSES,
      payload,
      authenticatedRequestOptions(),
    );
  },

  getClasses(
    page = 0,
    size = 20,
    sort: string[] = [],
  ): Promise<ApiResponse<PageResponse<ClassResponse>>> {
    return apiClient.get<ApiResponse<PageResponse<ClassResponse>>>(
      API_ROUTES.ADMIN.CLASSES,
      {
        ...authenticatedRequestOptions(),
        query: { page, size, sort },
      },
    );
  },

  updateClass(
    id: string,
    payload: UpdateClassRequest,
  ): Promise<ApiResponse<ClassResponse>> {
    return apiClient.put<ApiResponse<ClassResponse>, UpdateClassRequest>(
      `${API_ROUTES.ADMIN.CLASSES}/${id}`,
      payload,
      authenticatedRequestOptions(),
    );
  },

  changeClassStatus(
    id: string,
    payload: ChangeClassStatusRequest,
  ): Promise<ApiResponse<ClassResponse>> {
    return apiClient.put<ApiResponse<ClassResponse>, ChangeClassStatusRequest>(
      `${API_ROUTES.ADMIN.CLASSES}/${id}/status`,
      payload,
      authenticatedRequestOptions(),
    );
  },
};
