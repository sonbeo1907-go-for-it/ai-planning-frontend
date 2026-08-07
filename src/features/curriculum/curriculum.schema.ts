import { z } from "zod";

export const createModuleSchema = z.object({
  code: z
    .string()
    .min(1, "Mã module không được để trống")
    .max(50, "Mã module tối đa 50 ký tự")
    .regex(
      /^[A-Za-z0-9]+(?:_[A-Za-z0-9]+)*$/,
      "Mã module chỉ được chứa chữ cái, chữ số và dấu gạch dưới"
    ),
  name: z
    .string()
    .min(1, "Tên module không được để trống")
    .max(150, "Tên module tối đa 150 ký tự"),
  description: z
    .string()
    .max(4000, "Mô tả tối đa 4000 ký tự")
    .optional(),
  sequenceNumber: z
    .number()
    .min(1, "Thứ tự sắp xếp phải lớn hơn 0")
    .optional(),
});

export type CreateModuleFormValues = z.infer<typeof createModuleSchema>;

export const updateModuleSchema = z.object({
  name: z
    .string()
    .min(1, "Tên module không được để trống")
    .max(150, "Tên module tối đa 150 ký tự"),
  description: z
    .string()
    .max(4000, "Mô tả tối đa 4000 ký tự")
    .optional(),
});

export type UpdateModuleFormValues = z.infer<typeof updateModuleSchema>;
