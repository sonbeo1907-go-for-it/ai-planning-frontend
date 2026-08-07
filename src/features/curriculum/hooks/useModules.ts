import { useState, useCallback, useEffect } from "react";
import {
  CourseModule,
  CreateModuleInput,
  ModuleOrderItemInput,
  UpdateModuleInput,
} from "../curriculum.types";
import { curriculumService } from "../curriculum.service";

export function useModules(courseId: string) {
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchModules = useCallback(async () => {
    if (!courseId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await curriculumService.getModulesByCourseId(courseId);
      setModules(response.data || []);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Không thể tải danh sách module";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  const createModule = async (
    payload: CreateModuleInput
  ): Promise<{ success: boolean; error?: string }> => {
    setIsSubmitting(true);
    setError(null);
    try {
      await curriculumService.createModule(courseId, payload);
      await fetchModules();
      return { success: true };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Tạo module thất bại";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateModule = async (
    moduleId: string,
    payload: UpdateModuleInput
  ): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    try {
      await curriculumService.updateModule(courseId, moduleId, payload);
      await fetchModules();
      return true;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Cập nhật module thất bại";
      setError(errorMsg);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const reorderModules = async (items: ModuleOrderItemInput[]): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await curriculumService.reorderModules(courseId, { items });
      setModules(response.data || []);
      return true;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Sắp xếp lại thứ tự module thất bại";
      setError(errorMsg);
      await fetchModules();
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const activateModule = async (moduleId: string): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    try {
      await curriculumService.activateModule(courseId, moduleId);
      await fetchModules();
      return true;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Kích hoạt lại module thất bại";
      setError(errorMsg);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deactivateModule = async (moduleId: string): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    try {
      await curriculumService.deactivateModule(courseId, moduleId);
      await fetchModules();
      return true;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Ngừng sử dụng module thất bại";
      setError(errorMsg);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    modules,
    isLoading,
    isSubmitting,
    error,
    refreshModules: fetchModules,
    createModule,
    updateModule,
    reorderModules,
    activateModule,
    deactivateModule,
  };
}
