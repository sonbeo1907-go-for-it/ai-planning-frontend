export type CourseStatus = "ACTIVE" | "INACTIVE";

export type ClassStatus = "PLANNED" | "ACTIVE" | "CLOSED";

export interface CreateCourseRequest {
  code: string;
  name: string;
  description?: string;
}

export interface UpdateCourseRequest {
  name: string;
  description?: string;
}

export interface CourseSearchParams {
  search?: string;
  status?: CourseStatus;
  page?: number;
  size?: number;
}

export interface CourseResponse {
  id: string;
  code: string;
  name: string;
  description: string | null;
  status: CourseStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

export interface CreateClassRequest {
  courseId: string;
  code: string;
  name: string;
  description?: string;
  status: ClassStatus;
}

export interface UpdateClassRequest {
  name: string;
  description?: string;
  openedAt?: string;
  closedAt?: string;
  version: number;
}

export interface ClassResponse {
  id: string;
  courseId: string;
  code: string;
  name: string;
  description?: string;
  status: ClassStatus;
  openedAt?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  version: number;
}
