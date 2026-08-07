import { z } from "zod";

const courseNameSchema = z
  .string()
  .trim()
  .min(1, "Vui lòng nhập tên khóa học.")
  .max(150, "Tên khóa học không được quá 150 ký tự.");

const courseDescriptionSchema = z
  .string()
  .trim()
  .max(4000, "Mô tả không được quá 4000 ký tự.")
  .optional();

export const createCourseSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập mã khóa học.")
    .max(50, "Mã khóa học không được quá 50 ký tự.")
    .regex(
      /^[A-Za-z0-9]+(?:_[A-Za-z0-9]+)*$/,
      "Mã chỉ gồm chữ, số và dấu gạch dưới đơn.",
    ),
  name: courseNameSchema,
  description: courseDescriptionSchema,
});

export const updateCourseSchema = z.object({
  name: courseNameSchema,
  description: courseDescriptionSchema,
});

export const createClassSchema = z.object({
  courseId: z.string().uuid("Invalid course ID format").min(1, "Course ID is required"),
  code: z.string().min(1, "Class code is required").max(100, "Code must be 100 characters or less"),
  name: z.string().min(1, "Class name is required").max(255, "Name must be 255 characters or less"),
  description: z.string().optional(),
  status: z.enum(["PLANNED", "ACTIVE", "CLOSED"]),
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
