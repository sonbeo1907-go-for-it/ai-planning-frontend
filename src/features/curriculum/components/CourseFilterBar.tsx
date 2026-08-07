"use client";

import { useState, type FormEvent } from "react";

import { Button, SearchInput, Select } from "@/components/ui";

import type { CourseListParams } from "../hooks/useCourses";
import type { CourseStatus } from "../curriculum.types";

export interface CourseFilterBarProps {
  params: CourseListParams;
  disabled?: boolean;
  onSearch: (search: string) => void;
  onStatusChange: (status: CourseStatus | "") => void;
}

export function CourseFilterBar({
  params,
  disabled = false,
  onSearch,
  onStatusChange,
}: CourseFilterBarProps) {
  const [search, setSearch] = useState(params.search);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(search.trim());
  }

  return (
    <form
      className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[minmax(0,1fr)_14rem_auto] md:items-end"
      onSubmit={handleSubmit}
    >
      <SearchInput
        id="course-search"
        label="Tìm kiếm"
        placeholder="Tìm theo mã hoặc tên khóa học"
        maxLength={150}
        value={search}
        disabled={disabled}
        onChange={(event) => setSearch(event.target.value)}
        onClear={search ? () => {
          setSearch("");
          onSearch("");
        } : undefined}
      />

      <Select
        id="course-status-filter"
        label="Trạng thái"
        value={params.status}
        disabled={disabled}
        options={[
          { value: "", label: "Tất cả trạng thái" },
          { value: "ACTIVE", label: "Đang hoạt động" },
          { value: "INACTIVE", label: "Ngừng hoạt động" },
        ]}
        onChange={(event) => {
          onStatusChange(event.target.value as CourseStatus | "");
        }}
      />

      <Button type="submit" disabled={disabled}>
        Tìm kiếm
      </Button>
    </form>
  );
}
