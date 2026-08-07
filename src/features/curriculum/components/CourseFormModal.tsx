"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { WarningPanel } from "@/components/planning";
import { Button, Input, Modal } from "@/components/ui";
import { ApiClientError } from "@/lib/api-client";
import { cn } from "@/utils/cn";

import { createCourseSchema } from "../curriculum.schema";
import type {
  CourseResponse,
  CreateCourseRequest,
  UpdateCourseRequest,
} from "../curriculum.types";

type CourseFormValues = z.infer<typeof createCourseSchema>;

export interface CourseFormModalProps {
  isOpen: boolean;
  course?: CourseResponse | null;
  onClose: () => void;
  onSubmitCreate: (payload: CreateCourseRequest) => Promise<unknown>;
  onSubmitUpdate: (
    courseId: string,
    payload: UpdateCourseRequest,
  ) => Promise<unknown>;
}

function submissionMessage(error: ApiClientError): string {
  switch (error.code) {
    case "COURSE_NOT_FOUND":
      return "Khóa học không còn tồn tại. Danh sách đã được làm mới.";
    case "CONCURRENT_MODIFICATION":
      return "Khóa học vừa được thay đổi ở nơi khác. Danh sách đã được làm mới; vui lòng mở lại và thử lại.";
    default:
      return error.message || "Không thể lưu khóa học. Vui lòng thử lại.";
  }
}

export function CourseFormModal({
  isOpen,
  course,
  onClose,
  onSubmitCreate,
  onSubmitUpdate,
}: CourseFormModalProps) {
  const [serverError, setServerError] = useState<string>();
  const isEditing = Boolean(course);
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    form.reset({
      code: course?.code ?? "",
      name: course?.name ?? "",
      description: course?.description ?? "",
    });
  }, [course, form, isOpen]);

  function handleClose() {
    if (form.formState.isSubmitting) {
      return;
    }
    setServerError(undefined);
    form.reset();
    onClose();
  }

  async function handleSubmit(values: CourseFormValues) {
    setServerError(undefined);

    try {
      if (course) {
        await onSubmitUpdate(course.id, {
          name: values.name,
          description: values.description ?? "",
        });
      } else {
        await onSubmitCreate({
          code: values.code.toUpperCase(),
          name: values.name,
          description: values.description ?? "",
        });
      }
      form.reset();
      onClose();
    } catch (error) {
      if (error instanceof ApiClientError) {
        Object.entries(error.fieldErrors).forEach(([field, message]) => {
          if (field === "code" || field === "name" || field === "description") {
            form.setError(field, { message });
          }
        });

        if (error.code === "COURSE_CODE_ALREADY_EXISTS") {
          form.setError("code", {
            message: "Mã khóa học này đã được sử dụng.",
          });
          return;
        }

        setServerError(submissionMessage(error));
        return;
      }

      setServerError("Không thể lưu khóa học. Vui lòng thử lại.");
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      title={isEditing ? "Cập nhật khóa học" : "Tạo khóa học mới"}
      onClose={handleClose}
      footer={(
        <>
          <Button
            variant="ghost"
            disabled={form.formState.isSubmitting}
            onClick={handleClose}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            form="course-form"
            isLoading={form.formState.isSubmitting}
          >
            {isEditing ? "Lưu thay đổi" : "Tạo khóa học"}
          </Button>
        </>
      )}
    >
      <form
        id="course-form"
        className="grid gap-4"
        noValidate
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        {serverError && (
          <WarningPanel tone="error" title="Không thể lưu khóa học">
            {serverError}
          </WarningPanel>
        )}

        <Input
          id="course-code"
          label="Mã khóa học"
          placeholder="Ví dụ: FULLSTACK_JAVA"
          maxLength={50}
          autoComplete="off"
          readOnly={isEditing}
          className={cn("font-mono uppercase", isEditing && "bg-slate-100")}
          {...form.register("code")}
          error={form.formState.errors.code?.message}
        />
        {isEditing && (
          <p className="-mt-2 text-xs text-slate-500">
            Mã khóa học là duy nhất và không thể thay đổi.
          </p>
        )}

        <Input
          id="course-name"
          label="Tên khóa học"
          placeholder="Ví dụ: Fullstack Java"
          maxLength={150}
          autoComplete="off"
          {...form.register("name")}
          error={form.formState.errors.name?.message}
        />

        <label className="grid gap-1.5">
          <span className="text-sm font-medium text-slate-700">Mô tả</span>
          <textarea
            id="course-description"
            rows={5}
            maxLength={4000}
            placeholder="Mô tả tổng quan có thể dùng làm ngữ cảnh cho AI"
            className={cn(
              "w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
              form.formState.errors.description
                && "border-red-500 focus:border-red-500 focus:ring-red-100",
            )}
            aria-invalid={Boolean(form.formState.errors.description)}
            aria-describedby={
              form.formState.errors.description
                ? "course-description-error"
                : undefined
            }
            {...form.register("description")}
          />
          {form.formState.errors.description && (
            <span id="course-description-error" className="text-sm text-red-600">
              {form.formState.errors.description.message}
            </span>
          )}
        </label>

        {!isEditing && (
          <p className="rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-800">
            Khóa học mới sẽ tự động ở trạng thái Đang hoạt động.
          </p>
        )}
      </form>
    </Modal>
  );
}
