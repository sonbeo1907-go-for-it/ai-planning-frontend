import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { curriculumService } from "../curriculum.service";
import { CreateClassRequest, UpdateClassRequest, ChangeClassStatusRequest, ClassResponse } from "../curriculum.types";
import { PageResponse } from "@/types/api";

function requestErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message
    ? error.message
    : fallback;
}

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
    } catch (requestError) {
      toast.error(requestErrorMessage(
        requestError,
        "Đã xảy ra lỗi khi tạo lớp học",
      ));
      throw requestError;
    }
  };

  const handleUpdateClass = async (id: string, payload: UpdateClassRequest) => {
    try {
      await curriculumService.updateClass(id, payload);
      toast.success("Cập nhật lớp học thành công!");
      fetchClasses(pagination.page);
    } catch (requestError) {
      toast.error(requestErrorMessage(
        requestError,
        "Đã xảy ra lỗi khi cập nhật lớp học",
      ));
      throw requestError;
    }
  };

  const handleChangeStatus = async (id: string, payload: ChangeClassStatusRequest) => {
    try {
      await curriculumService.changeClassStatus(id, payload);
      toast.success("Chuyển trạng thái lớp học thành công!");
      fetchClasses(pagination.page);
    } catch (requestError) {
      toast.error(requestErrorMessage(
        requestError,
        "Đã xảy ra lỗi khi chuyển trạng thái lớp học",
      ));
      throw requestError;
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
    handleChangeStatus,
  };
}
