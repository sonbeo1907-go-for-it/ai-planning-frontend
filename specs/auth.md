# Authentication and Authorization

## Phạm vi nền

- Đăng nhập qua API.
- Lấy thông tin người dùng hiện tại.
- Điều hướng người dùng chưa đăng nhập về `/login`.
- Điều hướng người dùng thiếu quyền về `/forbidden`.
- Không hiển thị chức năng không thuộc role hiện tại.

## Quyết định cần chốt trước khi hiện thực

- Access token nằm trong response body hay cookie.
- Backend có refresh token hay không.
- Hành vi logout và thu hồi token.
- Danh sách role chính thức.

Không lưu access token vào `localStorage` trước khi nhóm chốt mô hình bảo mật. `api-client.ts` hỗ trợ cả Bearer token được truyền vào và cookie credentials.
