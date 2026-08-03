import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập email.")
    .email("Email không hợp lệ.")
    .max(254, "Email không được quá 254 ký tự."),
  password: z
    .string()
    .min(1, "Vui lòng nhập mật khẩu.")
    .max(200, "Mật khẩu không được quá 200 ký tự."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
