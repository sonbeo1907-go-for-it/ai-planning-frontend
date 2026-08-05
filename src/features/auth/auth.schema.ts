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

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, "Vui lòng nhập họ và tên.")
      .max(150, "Họ và tên không được quá 150 ký tự."),
    email: z
      .string()
      .trim()
      .min(1, "Vui lòng nhập email.")
      .email("Email không hợp lệ.")
      .max(254, "Email không được quá 254 ký tự."),
    password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự.")
      .max(100, "Mật khẩu không được quá 100 ký tự.")
      .regex(/[a-z]/, "Mật khẩu phải có ít nhất một chữ thường.")
      .regex(/[A-Z]/, "Mật khẩu phải có ít nhất một chữ hoa.")
      .regex(/\d/, "Mật khẩu phải có ít nhất một chữ số."),
    confirmPassword: z
      .string()
      .min(1, "Vui lòng xác nhận mật khẩu."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp.",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
