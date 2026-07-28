# Architecture

## Quy tắc chính

1. `src/app` chỉ điều phối route, layout, loading và error state.
2. Nghiệp vụ nằm trong `src/features/<feature>`.
3. Component chỉ dùng chung khi không phụ thuộc một nghiệp vụ cụ thể.
4. Feature được phép phụ thuộc `components/ui`, `constants`, `hooks`, `lib`, `types` và `utils`.
5. Không để feature này import file nội bộ của feature khác. Nếu cần chia sẻ, xuất qua `index.ts` hoặc đưa abstraction lên thư mục dùng chung.

## Cấu trúc feature

```text
features/weekly-plan/
├── components/
│   ├── WeeklyPlanForm.tsx
│   ├── WeeklyPlanCard.tsx
│   └── WeeklyPlanStatusBadge.tsx
├── weekly-plan.api.ts
├── weekly-plan.schema.ts
├── weekly-plan.store.ts
├── weekly-plan.types.ts
└── index.ts
```

Các file nghiệp vụ được thêm dần khi feature bắt đầu phát triển; scaffold ban đầu chỉ giữ cấu trúc thư mục.

## Routing

Route group không xuất hiện trong URL. Vì vậy route theo vai trò dùng thêm segment thật:

- `/student/*`
- `/instructor/*`
- `/admin/*`

Trang thiếu quyền được điều hướng tới `/forbidden`. Route không tồn tại sử dụng `app/not-found.tsx`.
