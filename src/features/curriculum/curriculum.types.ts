export type ModuleStatus = "ACTIVE" | "INACTIVE";

export interface CourseModule {
  id: string;
  courseId: string;
  code: string;
  name: string;
  description?: string;
  sequenceNumber: number;
  status: ModuleStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

export interface CreateModuleInput {
  code: string;
  name: string;
  description?: string;
  sequenceNumber?: number;
}

export interface UpdateModuleInput {
  name: string;
  description?: string;
}

export interface ModuleOrderItemInput {
  moduleId: string;
  sequenceNumber: number;
}

export interface ReorderModulesInput {
  items: ModuleOrderItemInput[];
}
