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

export const updateClassSchema = z.object({
  name: z.string().min(1, "Class name is required").max(255, "Name must be 255 characters or less"),
  description: z.string().optional(),
  openedAt: z.string().optional().or(z.literal("")),
  closedAt: z.string().optional().or(z.literal("")),
  version: z.number(),
}).superRefine((data, ctx) => {
  if (data.openedAt && data.closedAt) {
    const openedAt = new Date(data.openedAt).getTime();
    const closedAt = new Date(data.closedAt).getTime();
    if (openedAt > closedAt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ngày mở lớp không được sau ngày đóng lớp",
        path: ["openedAt"],
      });
    }
  }
});
