import { z } from "zod";

export const createCourseSchema = z.object({
  code: z.string().min(1, "Course code is required").max(100, "Code must be 100 characters or less"),
  name: z.string().min(1, "Course name is required").max(255, "Name must be 255 characters or less"),
  description: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"], {
    required_error: "Status is required",
  }),
});

export const createClassSchema = z.object({
  courseId: z.string().uuid("Invalid course ID format").min(1, "Course ID is required"),
  code: z.string().min(1, "Class code is required").max(100, "Code must be 100 characters or less"),
  name: z.string().min(1, "Class name is required").max(255, "Name must be 255 characters or less"),
  description: z.string().optional(),
  status: z.enum(["PLANNED", "ACTIVE", "CLOSED"], {
    required_error: "Status is required",
  }),
});
