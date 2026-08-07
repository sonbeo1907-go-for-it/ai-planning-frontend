import { API_ROUTES } from "@/constants/api-routes";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/features/auth/auth.store";
import { PageResponse } from "@/types/api";
import {
  CreateCourseRequest,
  CourseResponse,
  CreateClassRequest,
  ClassResponse,
  UpdateClassRequest,
  ChangeClassStatusRequest,
} from "./curriculum.types";

function authenticatedRequestOptions() {
  return { accessToken: useAuthStore.getState().accessToken };
}

export const curriculumService = {
  createCourse(payload: CreateCourseRequest): Promise<{ data: CourseResponse }> {
    return apiClient.post<{ data: CourseResponse }, CreateCourseRequest>(
      API_ROUTES.ADMIN.COURSES,
      payload,
      authenticatedRequestOptions(),
    );
  },

  getCourses(page: number = 0, size: number = 20): Promise<{ data: PageResponse<CourseResponse> }> {
    return apiClient.get<{ data: PageResponse<CourseResponse> }>(
      API_ROUTES.ADMIN.COURSES,
      {
        ...authenticatedRequestOptions(),
        query: { page, size },
      }
    );
  },

  createClass(payload: CreateClassRequest): Promise<{ data: ClassResponse }> {
    return apiClient.post<{ data: ClassResponse }, CreateClassRequest>(
      API_ROUTES.ADMIN.CLASSES,
      payload,
      authenticatedRequestOptions(),
    );
  },

  getClasses(page: number = 0, size: number = 20, sort: string[] = []): Promise<{ data: PageResponse<ClassResponse> }> {
    const query: Record<string, any> = { page, size };
    if (sort.length > 0) {
      query.sort = sort;
    }
    return apiClient.get<{ data: PageResponse<ClassResponse> }>(
      API_ROUTES.ADMIN.CLASSES,
      {
        ...authenticatedRequestOptions(),
        query,
      }
    );
  },

  updateClass(id: string, payload: UpdateClassRequest): Promise<{ data: ClassResponse }> {
    return apiClient.put<{ data: ClassResponse }, UpdateClassRequest>(
      `${API_ROUTES.ADMIN.CLASSES}/${id}`,
      payload,
      authenticatedRequestOptions(),
    );
  },

  changeClassStatus(id: string, payload: ChangeClassStatusRequest): Promise<{ data: ClassResponse }> {
    return apiClient.put<{ data: ClassResponse }, ChangeClassStatusRequest>(
      `${API_ROUTES.ADMIN.CLASSES}/${id}/status`,
      payload,
      authenticatedRequestOptions(),
    );
  },
};
