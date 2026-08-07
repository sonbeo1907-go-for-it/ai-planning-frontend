import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { curriculumService } from "../curriculum.service";
import { CreateClassRequest, UpdateClassRequest, ClassResponse } from "../curriculum.types";
import { PageResponse } from "@/types/api";

export function useClasses() {
  const [classes, setClasses] = useState<ClassResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [pagination, setPagination] = useState<PageResponse<ClassResponse>>({
    content: [],
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
  });

  const fetchClasses = useCallback(async (page: number = 0) => {
    setLoading(true);
    setError(null);
    try {
      const response = await curriculumService.getClasses(page, pagination.size, ["createdAt,desc"]);
      setClasses(response.data.content);
      setPagination(response.data);
    } catch {
      const msg = "Không thể tải danh sách lớp học";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [pagination.size]);

  useEffect(() => {
    // The request lifecycle intentionally updates loading/data state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchClasses(0);
  }, [fetchClasses]);

  const handleCreateClass = async (payload: CreateClassRequest) => {
    try {
      await curriculumService.createClass(payload);
      toast.success("Lớp học đã được tạo thành công!");
      fetchClasses(0);
    } catch (err) {
      throw err;
    }
  };

  const handleUpdateClass = async (id: string, payload: UpdateClassRequest) => {
    try {
      await curriculumService.updateClass(id, payload);
      toast.success("Cập nhật lớp học thành công!");
      fetchClasses(pagination.page);
    } catch (err) {
      throw err;
    }
  };

  return {
    classes,
    loading,
    error,
    pagination,
    fetchClasses,
    handleCreateClass,
    handleUpdateClass,
  };
}
