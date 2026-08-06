import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { curriculumService } from "../curriculum.service";
import { CreateCourseRequest, CourseResponse } from "../curriculum.types";
import { PageResponse } from "@/types/api";

export function useCourses() {
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [pagination, setPagination] = useState<PageResponse<CourseResponse>>({
    content: [],
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
  });

  const fetchCourses = useCallback(async (page: number = 0) => {
    setLoading(true);
    setError(null);
    try {
      const response = await curriculumService.getCourses(page, pagination.size, ["createdAt,desc"]);
      setCourses(response.data.content);
      setPagination(response.data);
    } catch (err) {
      const msg = "Không thể tải danh sách khóa học";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [pagination.size]);

  useEffect(() => {
    fetchCourses(0);
  }, [fetchCourses]);

  const handleCreateCourse = async (payload: CreateCourseRequest) => {
    try {
      await curriculumService.createCourse(payload);
      toast.success("Khóa học đã được tạo thành công!");
      fetchCourses(0);
    } catch (err) {
      throw err;
    }
  };

  return {
    courses,
    loading,
    error,
    pagination,
    fetchCourses,
    handleCreateCourse,
  };
}
