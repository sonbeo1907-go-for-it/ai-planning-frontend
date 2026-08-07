import { API_ROUTES } from "@/constants/api-routes";
import { useAuthStore } from "@/features/auth/auth.store";
import { apiClient } from "@/lib/api-client";
import type { ApiResponse, PageResponse } from "@/types/api";

import type {
  ChangeClassStatusRequest,
  ClassResponse,
  CourseModule,
  CourseResponse,
  CourseSearchParams,
  CreateClassRequest,
  CreateCourseRequest,
  CreateModuleInput,
  ReorderModulesInput,
  UpdateClassRequest,
  UpdateCourseRequest,
  UpdateModuleInput,
} from "./curriculum.types";

function authenticatedRequestOptions() {
  return { accessToken: useAuthStore.getState().accessToken };
}

function coursePath(courseId: string): string {
  return `${API_ROUTES.COURSES}/${courseId}`;
}

function modulesPath(courseId: string): string {
  return `${coursePath(courseId)}/modules`;
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

  getModulesByCourseId(
    courseId: string,
  ): Promise<ApiResponse<CourseModule[]>> {
    return apiClient.get<ApiResponse<CourseModule[]>>(
      modulesPath(courseId),
      authenticatedRequestOptions(),
    );
  },

  createModule(
    courseId: string,
    payload: CreateModuleInput,
  ): Promise<ApiResponse<CourseModule>> {
    return apiClient.post<ApiResponse<CourseModule>, CreateModuleInput>(
      modulesPath(courseId),
      payload,
      authenticatedRequestOptions(),
    );
  },

  updateModule(
    courseId: string,
    moduleId: string,
    payload: UpdateModuleInput,
  ): Promise<ApiResponse<CourseModule>> {
    return apiClient.patch<ApiResponse<CourseModule>, UpdateModuleInput>(
      `${modulesPath(courseId)}/${moduleId}`,
      payload,
      authenticatedRequestOptions(),
    );
  },

  reorderModules(
    courseId: string,
    payload: ReorderModulesInput,
  ): Promise<ApiResponse<CourseModule[]>> {
    return apiClient.put<ApiResponse<CourseModule[]>, ReorderModulesInput>(
      `${modulesPath(courseId)}/reorder`,
      payload,
      authenticatedRequestOptions(),
    );
  },

  activateModule(
    courseId: string,
    moduleId: string,
  ): Promise<ApiResponse<CourseModule>> {
    return apiClient.post<ApiResponse<CourseModule>>(
      `${modulesPath(courseId)}/${moduleId}/activate`,
      undefined,
      authenticatedRequestOptions(),
    );
  },

  deactivateModule(
    courseId: string,
    moduleId: string,
  ): Promise<ApiResponse<CourseModule>> {
    return apiClient.post<ApiResponse<CourseModule>>(
      `${modulesPath(courseId)}/${moduleId}/deactivate`,
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
