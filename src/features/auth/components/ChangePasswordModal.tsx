"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X as XIcon } from "lucide-react";
import { toast } from "sonner";

import { WarningPanel } from "@/components/planning";
import { Modal, Input, Button } from "@/components/ui";
import { authApi, isApiClientError } from "@/features/auth/auth.api";
import { useAuthStore } from "@/features/auth/auth.store";
import { changePasswordSchema, type ChangePasswordFormValues } from "@/features/auth/auth.schema";

export interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const accessToken = useAuthStore((state) => state.accessToken);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const passwordVal = useWatch({ control, name: "newPassword" }) || "";

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

  const hasMinLength = passwordVal.length >= 8;
  const hasUppercase = /[A-Z]/.test(passwordVal);
  const hasLowercase = /[a-z]/.test(passwordVal);
  const hasNumber = /[0-9]/.test(passwordVal);

  const isPolicyValid = hasMinLength && hasUppercase && hasLowercase && hasNumber;

  const onSubmit = async (data: ChangePasswordFormValues) => {
    if (!isPolicyValid || !accessToken) return;

    setSubmissionError(null);

    try {
      await authApi.changePassword(
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        },
        accessToken
      );
      toast.success("Đổi mật khẩu thành công. Các thiết bị khác đã bị đăng xuất.");
      clearFormState();
      onClose();
    } catch (error) {
      if (isApiClientError(error)) {
        if (error.code === "CURRENT_PASSWORD_INCORRECT") {
          setSubmissionError("Mật khẩu hiện tại không chính xác.");
        } else if (error.code === "NEW_PASSWORD_MUST_BE_DIFFERENT") {
          setSubmissionError("Mật khẩu mới phải khác mật khẩu hiện tại.");
        } else if (error.code === "PASSWORD_POLICY_VIOLATION") {
          setSubmissionError("Mật khẩu mới không đáp ứng chính sách bảo mật.");
        } else {
          setSubmissionError(error.message || "Đã xảy ra lỗi khi đổi mật khẩu.");
        }
      } else {
        setSubmissionError("Đã xảy ra lỗi không xác định.");
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Đổi mật khẩu"
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
            Đổi mật khẩu
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {submissionError && (
          <WarningPanel tone="error" title="Lỗi đổi mật khẩu">
            {submissionError}
          </WarningPanel>
        )}

        <div className="space-y-4">
          <Input
            id="current-password"
            label="Mật khẩu hiện tại"
            type={showPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu hiện tại"
            autoComplete="current-password"
            {...register("currentPassword")}
            error={errors.currentPassword?.message}
          />

          <Input
            id="new-password"
            label="Mật khẩu mới"
            type={showPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu mới"
            autoComplete="new-password"
            {...register("newPassword")}
            error={
              errors.newPassword?.message ||
              (passwordVal.length > 0 && !isPolicyValid
                ? "Mật khẩu chưa đáp ứng chính sách bảo mật."
                : undefined)
            }
          />

          <Input
            id="confirm-password"
            label="Xác nhận mật khẩu mới"
            type={showPassword ? "text" : "password"}
            placeholder="Nhập lại mật khẩu mới"
            autoComplete="new-password"
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
