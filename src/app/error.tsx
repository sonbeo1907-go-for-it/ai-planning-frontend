"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-6 py-16">
      <section className="w-full max-w-lg text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-600">
          Error
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
          Đã xảy ra lỗi
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Không thể tải nội dung. Bạn có thể thử lại thao tác vừa thực hiện.
        </p>
        <div className="mt-8">
          <Button onClick={() => unstable_retry()}>
            Thử lại
          </Button>
        </div>
      </section>
    </main>
  );
}
