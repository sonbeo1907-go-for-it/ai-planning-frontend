# Authentication and Authorization

## Frontend scope

- Login uses the backend's internal-account endpoint.
- Access tokens stay in the Zustand in-memory store only; they are never put
  in `localStorage` or `sessionStorage`.
- The backend refresh token is an `HttpOnly` cookie. On a page reload,
  `AuthProvider` calls the refresh endpoint and restores the profile before
  protected routes are rendered.
- Logout calls the backend's session-revocation endpoint, clears the frontend
  session, then redirects to `/login`.
- A `401 SESSION_EXPIRED` clears the in-memory session and routes the user to
  `/login?reason=session-expired`.

## Backend contract

| Purpose | Method and path | Client behaviour |
| --- | --- | --- |
| Login | `POST /auth/login` | Store `data.accessToken` in memory, then fetch the current profile. |
| Refresh | `POST /auth/refresh` | Relies on the HttpOnly refresh cookie; used only to restore a session. |
| Logout | `POST /auth/logout` | Sends the in-memory access token and refresh cookie; expects `204`. |
| Profile | `GET /profile` | Sends the Bearer token and returns only the current authenticated user. |

All successful responses are wrapped in `{ "data": ... }`. Backend errors
contain `code`, `message`, `requestId`, and optional `violations`; the API
client maps `violations` to frontend field errors.

## Role routing

- `STUDENT` -> `/student/dashboard`
- `INSTRUCTOR` -> `/instructor/dashboard`
- `ADMIN` -> `/admin/dashboard`

`RequireAuth` sends unauthenticated users to `/login` and users outside a
route's allowed roles to `/forbidden`. Backend authorization remains the source
of truth.

## Login UI rules

- Validate a required username (maximum 100 characters) and password
  (maximum 200 characters) before submitting.
- Every `INVALID_CREDENTIALS` response displays the same generic message.
  The UI must not disclose whether an account is unknown, locked, inactive, or
  temporarily blocked.
- Do not log credentials or access tokens.
- Backend CORS must allow the frontend origin. Local development uses
  `CORS_ALLOWED_ORIGINS=http://localhost:3000`.

## Profile UI

- Always use `GET /profile`; never accept a target user ID in the UI.
- Display full name, user code, role, and account status.
- Display student enrollments or instructor class assignments when supplied by
  the backend. The current auth backend returns empty collections until the
  corresponding academic modules are integrated.
