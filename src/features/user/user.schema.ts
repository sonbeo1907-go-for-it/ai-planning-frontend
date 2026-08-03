import { z } from "zod";

export const createUserSchema = z.object({
  username: z
    .string()
    .min(3, "Mã/Tên đăng nhập phải từ 3 đến 50 ký tự")
    .max(50, "Mã/Tên đăng nhập không quá 50 ký tự")
    .regex(/^[a-zA-Z0-9._-]+$/, "Mã đăng nhập chỉ chứa chữ cái, số, dấu chấm, gạch dưới và gạch ngang"),
  fullName: z
    .string()
    .min(2, "Họ và tên phải từ 2 đến 100 ký tự")
    .max(100, "Họ và tên không quá 100 ký tự"),
  email: z.string().email("Địa chỉ email không hợp lệ"),
  password: z
    .string()
    .min(6, "Mật khẩu phải từ 6 ký tự trở lên")
    .optional()
    .or(z.literal("")),
  role: z.enum(["STUDENT", "INSTRUCTOR", "ADMIN"], {
    message: "Vui lòng chọn vai trò",
  }),
});

export const updateUserSchema = z.object({
  fullName: z
    .string()
    .min(2, "Họ và tên phải từ 2 đến 100 ký tự")
    .max(100, "Họ và tên không quá 100 ký tự"),
  email: z.string().email("Địa chỉ email không hợp lệ"),
  role: z.enum(["STUDENT", "INSTRUCTOR", "ADMIN"]),
  status: z.enum(["ACTIVE", "INACTIVE", "LOCKED"]),
  password: z
    .string()
    .min(6, "Mật khẩu mới phải từ 6 ký tự trở lên")
    .optional()
    .or(z.literal("")),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
