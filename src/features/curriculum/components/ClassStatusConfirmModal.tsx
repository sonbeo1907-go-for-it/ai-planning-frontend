import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ClassResponse } from "../curriculum.types";

interface ClassStatusConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  cls: ClassResponse | null;
  action: "OPEN" | "CLOSE" | null;
}

export function ClassStatusConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  cls,
  action,
}: ClassStatusConfirmModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!cls || !action) return null;

  const isOpening = action === "OPEN";
  const title = isOpening ? "Bắt đầu lớp học" : "Đóng lớp học";
  const confirmText = isOpening ? "Bắt đầu ngay" : "Đóng lớp";
  const colorClass = isOpening ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700";
  const iconColor = isOpening ? "text-emerald-600 bg-emerald-100" : "text-rose-600 bg-rose-100";

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => !isSubmitting && onClose()}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${iconColor}`}>
                    {isOpening ? (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6v4H9z" />
                      </svg>
                    )}
                  </div>
                  
                  <Dialog.Title as="h3" className="text-lg font-bold text-slate-900 mb-2">
                    {title}
                  </Dialog.Title>
                  
                  <div className="mt-2 text-sm text-slate-500 space-y-2">
                    <p>
                      Bạn có chắc chắn muốn {isOpening ? "mở" : "đóng"} lớp <strong>{cls.name}</strong> ({cls.code}) không?
                    </p>
                    <p className="text-amber-600 bg-amber-50 px-3 py-2 rounded-lg text-xs font-medium border border-amber-200">
                      Hệ thống sẽ tự động ghi nhận ngày hôm nay làm ngày {isOpening ? "bắt đầu" : "kết thúc"} thực tế của lớp học. Thao tác này không thể hoàn tác trực tiếp.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex gap-3 w-full">
                  <button
                    type="button"
                    className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition"
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    className={`flex-1 flex justify-center items-center px-4 py-2 text-sm font-medium text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition ${colorClass} ${
                      isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                    onClick={handleConfirm}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      confirmText
                    )}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
