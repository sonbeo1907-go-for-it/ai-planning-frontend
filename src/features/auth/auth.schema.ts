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

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại."),
    newPassword: z.string().min(8, "Mật khẩu mới phải có ít nhất 8 ký tự."),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp.",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "Mật khẩu mới phải khác mật khẩu hiện tại.",
    path: ["newPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export const passwordResetRequestSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập email.")
    .email("Email không hợp lệ.")
    .max(254, "Email không được quá 254 ký tự."),
});

export type PasswordResetRequestFormValues = z.infer<typeof passwordResetRequestSchema>;

export const passwordResetConfirmSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Mật khẩu mới phải có ít nhất 8 ký tự.")
      .max(50, "Mật khẩu không được quá 50 ký tự.")
      .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất 1 chữ hoa.")
      .regex(/[a-z]/, "Mật khẩu phải chứa ít nhất 1 chữ thường.")
      .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất 1 chữ số.")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt."),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp.",
    path: ["confirmPassword"],
  });

export type PasswordResetConfirmFormValues = z.infer<typeof passwordResetConfirmSchema>;
