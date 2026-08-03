"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, X as XIcon, AlertTriangle, Dices, Copy } from "lucide-react";
import { toast } from "sonner";

import { WarningPanel } from "@/components/planning";
import { Modal, Input, Button } from "@/components/ui";

const resetPasswordSchema = z
  .object({
    password: z.string().min(1, "Vui lòng nhập mật khẩu tạm thời."),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp.",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: number | string;
    name: string;
    email: string;
    status: string;
  } | null;
}

function generateRandomPassword() {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const NUMS = "0123456789";
  const SPECS = "!@#$%^&*";

  let pass = "";
  pass += chars[Math.floor(Math.random() * chars.length)];
  pass += CHARS[Math.floor(Math.random() * CHARS.length)];
  pass += NUMS[Math.floor(Math.random() * NUMS.length)];
  pass += SPECS[Math.floor(Math.random() * SPECS.length)];

  const all = chars + CHARS + NUMS + SPECS;
  for (let i = 0; i < 8; i++) {
    pass += all[Math.floor(Math.random() * all.length)];
  }

  return pass
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
}

export function ResetPasswordModal({ isOpen, onClose, user }: ResetPasswordModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const passwordVal = useWatch({ control, name: "password" }) || "";

  const clearFormState = () => {
    reset();
    setShowPassword(false);
    setSubmissionError(null);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    clearFormState();
    onClose();
  };

  // Validate policy for UI checkmarks
  const hasMinLength = passwordVal.length >= 8;
  const hasUppercase = /[A-Z]/.test(passwordVal);
  const hasLowercase = /[a-z]/.test(passwordVal);
  const hasNumber = /[0-9]/.test(passwordVal);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(passwordVal);

  const isPolicyValid = hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!isPolicyValid) return; // double check

    setSubmissionError(null);

    // Simulate API errors for demonstration based on password
    if (data.password === "Server@123") {
      await new Promise((r) => setTimeout(r, 1000));
      setSubmissionError("Không thể đặt lại mật khẩu. Vui lòng thử lại.");
      return;
    }
    if (data.password === "User@123") {
      await new Promise((r) => setTimeout(r, 1000));
      setSubmissionError("Không tìm thấy người dùng.");
      return;
    }
    if (data.password === "Changed@123") {
      await new Promise((r) => setTimeout(r, 1000));
      setSubmissionError("Thông tin người dùng đã thay đổi. Vui lòng tải lại trang.");
      return;
    }

    // TODO: Connect to actual API
    await new Promise((r) => setTimeout(r, 1000));

    clearFormState();
    onClose();
    toast.success("Đặt lại mật khẩu thành công.");
  };

  const handleGeneratePassword = () => {
    const newPass = generateRandomPassword();
    setValue("password", newPass, { shouldValidate: true, shouldDirty: true });
    setValue("confirmPassword", newPass, { shouldValidate: true, shouldDirty: true });
    setShowPassword(true);
  };

  const handleCopy = () => {
    if (!passwordVal) return;
    navigator.clipboard.writeText(passwordVal);
    toast.success("Đã sao chép mật khẩu vào bộ nhớ tạm");
  };

  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Đặt lại mật khẩu"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose} disabled={isSubmitting} type="button">
            Hủy
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={!isPolicyValid || isSubmitting}
            isLoading={isSubmitting}
            type="submit"
          >
            Đặt lại mật khẩu
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-md bg-slate-50 p-4 text-sm text-slate-700 border border-slate-200">
          <p className="mb-1">Bạn đang đặt lại mật khẩu cho:</p>
          <div className="font-semibold text-slate-900">{user.name}</div>
          <div className="text-slate-500">{user.email}</div>
          <div className="mt-1">
            Trạng thái:{" "}
            <span className="font-medium text-slate-900">
              {user.status === "ACTIVE" ? "Đang hoạt động" : "Đã vô hiệu hóa"}
            </span>
          </div>
        </div>

        {user.status !== "ACTIVE" && (
          <div className="flex gap-3 rounded-md border border-amber-200 bg-amber-50 p-4">
            <AlertTriangle className="size-5 shrink-0 text-amber-500" />
            <div>
              <h3 className="text-sm font-medium text-amber-800">
                Người dùng này đang bị vô hiệu hóa.
              </h3>
              <p className="mt-1 text-sm text-amber-700">
                Việc đặt lại mật khẩu không kích hoạt lại tài khoản.
              </p>
            </div>
          </div>
        )}

        {submissionError && (
          <WarningPanel tone="error" title="Lỗi đặt lại mật khẩu">
            {submissionError}
          </WarningPanel>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">Mật khẩu tạm thời</label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                className="h-7 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                onClick={handleGeneratePassword}
              >
                <Dices className="mr-1 size-3" />
                Tạo ngẫu nhiên
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-7 px-2 text-xs text-slate-600 hover:text-slate-700 hover:bg-slate-100"
                onClick={handleCopy}
                disabled={!passwordVal}
              >
                <Copy className="mr-1 size-3" />
                Copy
              </Button>
            </div>
          </div>
          <Input
            id="new-password"
            type={showPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu mới"
            {...register("password")}
            error={
              errors.password?.message ||
              (passwordVal.length > 0 && !isPolicyValid
                ? "Mật khẩu chưa đáp ứng chính sách bảo mật."
                : undefined)
            }
          />

          <Input
            id="confirm-password"
            label="Xác nhận mật khẩu"
            type={showPassword ? "text" : "password"}
            placeholder="Nhập lại mật khẩu mới"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />

          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
            />
            Hiển thị mật khẩu
          </label>
        </div>

        <div className="rounded-md border border-slate-200 p-4">
          <p className="mb-3 text-sm font-semibold text-slate-900">Mật khẩu phải có:</p>
          <ul className="space-y-2 text-sm">
            <PolicyItem isValid={hasMinLength} text="Tối thiểu 8 ký tự" />
            <PolicyItem isValid={hasUppercase} text="Ít nhất 1 chữ hoa" />
            <PolicyItem isValid={hasLowercase} text="Ít nhất 1 chữ thường" />
            <PolicyItem isValid={hasNumber} text="Ít nhất 1 chữ số" />
            <PolicyItem isValid={hasSpecial} text="Ít nhất 1 ký tự đặc biệt" />
          </ul>
        </div>
      </form>
    </Modal>
  );
}

function PolicyItem({ isValid, text }: { isValid: boolean; text: string }) {
  return (
    <li className="flex items-center gap-2">
      {isValid ? (
        <Check className="size-4 text-emerald-600" />
      ) : (
        <XIcon className="size-4 text-slate-300" />
      )}
      <span className={isValid ? "text-slate-900" : "text-slate-500"}>{text}</span>
    </li>
  );
}
