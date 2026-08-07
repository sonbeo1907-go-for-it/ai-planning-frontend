"use client";

import { useState, useEffect } from "react";
import { curriculumService } from "../curriculum.service";
import type { CourseResponse } from "../curriculum.types";

export function useActiveCourses() {
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await curriculumService.getCourses({
          page: 0,
          size: 100,
          status: "ACTIVE",
        });
        setCourses(response.data.content || []);
      } catch (error) {
        console.error("Failed to fetch active courses:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);

  return { courses, loading };
}
