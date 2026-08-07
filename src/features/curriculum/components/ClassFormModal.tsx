"use client";

import { useState } from "react";
import type { CreateClassRequest, UpdateClassRequest, ClassResponse } from "../curriculum.types";
import { ApiClientError } from "@/lib/api-client";
import { CreateClassForm } from "./CreateClassForm";
import { UpdateClassForm } from "./UpdateClassForm";

interface ClassFormModalProps {
  isOpen: boolean;
  cls: ClassResponse | null;
  onClose: () => void;
  onSubmitCreate?: (payload: CreateClassRequest) => Promise<void>;
  onSubmitUpdate?: (id: string, payload: UpdateClassRequest) => Promise<void>;
}

export function ClassFormModal({
  isOpen,
  cls,
  onClose,
  onSubmitCreate,
  onSubmitUpdate,
}: ClassFormModalProps) {
  const isEditMode = Boolean(cls);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setServerError(null);
    onClose();
  };

  const handleCreate = async (payload: CreateClassRequest) => {
    if (!onSubmitCreate) return;
    setSubmitting(true);
    setServerError(null);
    try {
      await onSubmitCreate(payload);
      handleClose();
    } catch (err) {
      if (err instanceof ApiClientError) {
        setServerError(err.message);
      } else {
        setServerError("Tạo lớp học thất bại. Vui lòng kiểm tra lại.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (payload: UpdateClassRequest) => {
    if (!cls || !onSubmitUpdate) return;
    setSubmitting(true);
    setServerError(null);
    
    try {
      await onSubmitUpdate(cls.id, payload);
      handleClose();
    } catch (err) {
      if (err instanceof ApiClientError) {
        if (err.status === 409 && err.message.includes("lock")) {
           setServerError("Dữ liệu đã bị thay đổi bởi người khác. Vui lòng làm mới trang (F5) và thử lại.");
        } else {
           setServerError(err.message);
        }
      } else {
        setServerError("Cập nhật lớp học thất bại. Vui lòng kiểm tra lại.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">
            {isEditMode ? `Cập nhật lớp học: ${cls?.code}` : "Tạo lớp học mới"}
          </h3>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {serverError && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{serverError}</span>
            </div>
          )}

          {!isEditMode ? (
            <CreateClassForm 
              onSubmit={handleCreate} 
              onCancel={handleClose} 
              submitting={submitting} 
            />
          ) : (
            <UpdateClassForm 
              cls={cls!} 
              onSubmit={handleUpdate} 
              onCancel={handleClose} 
              submitting={submitting} 
            />
          )}
        </div>
      </div>
    </div>
  );
}
