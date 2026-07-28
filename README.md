# AI Planning Frontend

Frontend cho hệ thống quản lý kế hoạch học tập ngày và tuần.

## Công nghệ

- Next.js App Router
- React
- TypeScript strict
- Tailwind CSS
- React Hook Form và Zod
- Zustand
- Vitest và Testing Library

## Yêu cầu môi trường

- Node.js 22
- npm 10 trở lên

## Chạy local

```bash
cp .env.example .env.local
npm ci
npm run dev
```

Ứng dụng mặc định chạy tại `http://localhost:3000`.

## Kiểm tra project

```bash
npm run lint
npm run type-check
npm test
npm run build
```

## Nguyên tắc tổ chức

- `src/app`: route, layout và error boundary.
- `src/components/ui`: UI primitive dùng chung.
- `src/components/layout`: component bố cục toàn hệ thống.
- `src/features`: API, type, schema, store và component theo nghiệp vụ.
- `src/lib`: hạ tầng dùng chung như API client và environment.
- `src/types`: kiểu dữ liệu dùng qua nhiều feature.
- `specs`: quyết định kỹ thuật và đặc tả frontend.

Đọc [`specs/README.md`](specs/README.md) trước khi phát triển feature mới.
