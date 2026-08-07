"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ApiClientError } from "@/lib/api-client";
import type { PageResponse } from "@/types/api";

import { curriculumService } from "../curriculum.service";
import type {
  CourseResponse,
  CourseStatus,
  CreateCourseRequest,
  UpdateCourseRequest,
} from "../curriculum.types";

export interface CourseListParams {
  search: string;
  status: CourseStatus | "";
  page: number;
  size: number;
}

const initialParams: CourseListParams = {
  search: "",
  status: "",
  page: 0,
  size: 10,
};

const initialPage: PageResponse<CourseResponse> = {
  content: [],
  page: 0,
  size: 10,
  totalElements: 0,
  totalPages: 0,
  first: true,
  last: true,
};

function listErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) {
    return error.message;
  }

  return "Không thể tải danh sách khóa học. Vui lòng thử lại.";
}

export function useCourses() {
  const [params, setParams] = useState<CourseListParams>(initialParams);
  const [pageData, setPageData] = useState<PageResponse<CourseResponse>>(
    initialPage,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await curriculumService.getCourses({
        search: params.search.trim() || undefined,
        status: params.status || undefined,
        page: params.page,
        size: params.size,
      });
      setPageData(response.data);
    } catch (requestError) {
      setError(listErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    // The request lifecycle intentionally updates loading/data state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchCourses();
  }, [fetchCourses]);

  const handleSearch = (search: string) => {
    setParams((current) => ({ ...current, search, page: 0 }));
  };

  const handleStatusFilter = (status: CourseStatus | "") => {
    setParams((current) => ({ ...current, status, page: 0 }));
  };

  const handlePageChange = (page: number) => {
    setParams((current) => ({
      ...current,
      page: Math.max(0, page),
    }));
  };

  const createCourse = async (payload: CreateCourseRequest) => {
    const response = await curriculumService.createCourse({
      ...payload,
      code: payload.code.toUpperCase(),
    });
    toast.success("Khóa học đã được tạo thành công.");
    setParams((current) => ({ ...current, page: 0 }));
    return response.data;
  };

  const updateCourse = async (
    courseId: string,
    payload: UpdateCourseRequest,
  ) => {
    try {
      const response = await curriculumService.updateCourse(courseId, payload);
      toast.success("Thông tin khóa học đã được cập nhật.");
      await fetchCourses();
      return response.data;
    } catch (requestError) {
      if (
        requestError instanceof ApiClientError
        && ["CONCURRENT_MODIFICATION", "COURSE_NOT_FOUND"].includes(
          requestError.code,
        )
      ) {
        await fetchCourses();
      }
      throw requestError;
    }
  };

  const changeCourseStatus = async (course: CourseResponse) => {
    try {
      const response = course.status === "ACTIVE"
        ? await curriculumService.deactivateCourse(course.id)
        : await curriculumService.activateCourse(course.id);

      toast.success(
        course.status === "ACTIVE"
          ? "Khóa học đã được chuyển sang ngừng hoạt động."
          : "Khóa học đã được mở lại.",
      );
      await fetchCourses();
      return response.data;
    } catch (requestError) {
      if (
        requestError instanceof ApiClientError
        && ["CONCURRENT_MODIFICATION", "COURSE_NOT_FOUND"].includes(
          requestError.code,
        )
      ) {
        await fetchCourses();
      }
      throw requestError;
    }
  };

  return {
    courses: pageData.content,
    pagination: pageData,
    params,
    loading,
    error,
    refetch: fetchCourses,
    handleSearch,
    handleStatusFilter,
    handlePageChange,
    createCourse,
    updateCourse,
    changeCourseStatus,
  };
}
