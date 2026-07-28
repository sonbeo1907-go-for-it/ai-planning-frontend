# API Conventions

## Base URL

`NEXT_PUBLIC_API_URL` chứa base URL đầy đủ, bao gồm version:

```text
http://localhost:8080/api/v1
```

Các giá trị trong `API_ROUTES` chỉ chứa phần đường dẫn phía sau `/api/v1`.

## API client

Mọi HTTP request phải đi qua `src/lib/api-client.ts`. Không gọi `fetch` rải rác trong component.

API client hiện hỗ trợ:

- GET
- POST
- PUT
- PATCH
- DELETE
- Query parameters
- JSON request/response
- `204 No Content`
- Bearer token tùy chọn
- Cookie credentials
- Chuẩn hóa lỗi thành `ApiClientError`

## Error response

Frontend chấp nhận định dạng:

```json
{
  "status": 400,
  "code": "VALIDATION_ERROR",
  "message": "Dữ liệu không hợp lệ",
  "path": "/api/v1/weekly-plans",
  "timestamp": "2026-07-28T08:00:00Z",
  "fieldErrors": {
    "title": "Không được để trống"
  }
}
```

Nếu backend không trả đủ trường, client tạo mã lỗi dự phòng theo HTTP status.
