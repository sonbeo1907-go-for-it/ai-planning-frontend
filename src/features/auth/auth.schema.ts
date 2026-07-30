import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập mã người dùng.")
    .max(100, "Mã người dùng không được quá 100 ký tự."),
  password: z
    .string()
    .min(1, "Vui lòng nhập mật khẩu.")
    .max(200, "Mật khẩu không được quá 200 ký tự."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
