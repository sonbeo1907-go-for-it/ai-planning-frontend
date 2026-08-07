import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/features/auth/auth.store";
import {
  CourseModule,
  CreateModuleInput,
  ReorderModulesInput,
  UpdateModuleInput,
} from "./curriculum.types";

interface ApiResponseEnvelope<T> {
  data: T;
  timestamp?: string;
}

function authenticatedRequestOptions() {
  return { accessToken: useAuthStore.getState().accessToken };
}

export const curriculumService = {
  getModulesByCourseId(courseId: string): Promise<ApiResponseEnvelope<CourseModule[]>> {
    return apiClient.get<ApiResponseEnvelope<CourseModule[]>>(
      `/courses/${courseId}/modules`,
      authenticatedRequestOptions()
    );
  },

  createModule(
    courseId: string,
    payload: CreateModuleInput
  ): Promise<ApiResponseEnvelope<CourseModule>> {
    return apiClient.post<ApiResponseEnvelope<CourseModule>, CreateModuleInput>(
      `/courses/${courseId}/modules`,
      payload,
      authenticatedRequestOptions()
    );
  },

  updateModule(
    courseId: string,
    moduleId: string,
    payload: UpdateModuleInput
  ): Promise<ApiResponseEnvelope<CourseModule>> {
    return apiClient.patch<ApiResponseEnvelope<CourseModule>, UpdateModuleInput>(
      `/courses/${courseId}/modules/${moduleId}`,
      payload,
      authenticatedRequestOptions()
    );
  },

  reorderModules(
    courseId: string,
    payload: ReorderModulesInput
  ): Promise<ApiResponseEnvelope<CourseModule[]>> {
    return apiClient.put<ApiResponseEnvelope<CourseModule[]>, ReorderModulesInput>(
      `/courses/${courseId}/modules/reorder`,
      payload,
      authenticatedRequestOptions()
    );
  },

  activateModule(
    courseId: string,
    moduleId: string
  ): Promise<ApiResponseEnvelope<CourseModule>> {
    return apiClient.post<ApiResponseEnvelope<CourseModule>, undefined>(
      `/courses/${courseId}/modules/${moduleId}/activate`,
      undefined,
      authenticatedRequestOptions()
    );
  },

  deactivateModule(
    courseId: string,
    moduleId: string
  ): Promise<ApiResponseEnvelope<CourseModule>> {
    return apiClient.post<ApiResponseEnvelope<CourseModule>, undefined>(
      `/courses/${courseId}/modules/${moduleId}/deactivate`,
      undefined,
      authenticatedRequestOptions()
    );
  },
};
