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
| Login | `POST /auth/login` | Send `{ "email", "password" }`, store `data.accessToken` in memory, then fetch the current profile. |
| Register | `POST /auth/register` | Send `{ "email", "password", "fullName" }`; accept an empty `202` response and direct the user to login. |
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

- Validate a required email (valid format, maximum 254 characters) and password
  (maximum 200 characters) before submitting.
- Every `INVALID_CREDENTIALS` response displays the same generic message.
  The message is `Email hoặc mật khẩu không đúng.`
  The UI must not disclose whether an account is unknown, locked, inactive, or
  temporarily blocked.
- Do not log credentials or access tokens.
- Backend CORS must allow the frontend origin. Local development uses
  `CORS_ALLOWED_ORIGINS=http://localhost:3000`.

## Registration UI rules

- `/register` is public and is linked from the login screen.
- Submit only `email`, `password`, and `fullName`. The client must not submit a
  role, status, or username; the backend creates an active Student account and
  generates its internal username.
- Require a local `confirmPassword` field that matches `password`; never include
  `confirmPassword` in the backend request.
- Validate email format and its 254-character limit, full name up to 150
  characters, and a password of 8–100 characters containing an uppercase
  letter, lowercase letter, and digit.
- Treat every valid `202 Accepted` response identically, including duplicate
  email submissions. Show a generic acknowledgement and link back to login so
  the UI does not reveal whether an email is already registered.
- Map `400 VALIDATION_FAILED` field violations to the matching form fields.

## Profile UI

- Always use `GET /profile`; never accept a target user ID in the UI.
- Display full name, user code, role, and account status.
- Display student enrollments or instructor class assignments when supplied by
  the backend. The current auth backend returns empty collections until the
  corresponding academic modules are integrated.
