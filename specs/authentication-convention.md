# Authentication Convention

This document defines the required frontend conventions for authenticated API
requests and protected routes. Its purpose is to prevent a page from rendering
normally while its protected data requests fail with `401 Unauthorized`.

## 1. Authentication ownership

- `AuthProvider` owns session restoration and authentication-error handling.
- `useAuthStore` is the only frontend source of the in-memory access token.
- Access tokens MUST NOT be stored in `localStorage`, `sessionStorage`, URLs,
  logs, or component state outside the auth store.
- The refresh token is managed only by the backend `HttpOnly` cookie.

## 2. Protected API requests

- Every HTTP request MUST go through `src/lib/api-client.ts`.
- Feature components and hooks MUST NOT call `fetch` directly.
- A protected feature service MUST pass the current access token to every
  request:

  ```ts
  import { useAuthStore } from "@/features/auth/auth.store";

  const accessToken = useAuthStore.getState().accessToken;
  return apiClient.get("/users", { accessToken });
  ```

- Services MUST NOT silently omit authentication because an endpoint is being
  called from an authenticated page.
- New work SHOULD use a shared `authenticatedApiClient` wrapper when available;
  the wrapper must attach the token automatically and make omission impossible.
- Public endpoints must be explicitly identified as public and must not depend
  on an access token.

## 3. Protected routes

Every protected page MUST use the shared authentication boundary:

```tsx
<AuthenticatedShell allowedRoles={["ADMIN"]}>
  <PageContent />
</AuthenticatedShell>
```

- `RequireAuth` must complete session initialization before mounting children
  that fetch protected data.
- Role restrictions MUST be declared at the route boundary, not only hidden in
  the sidebar.
- The backend remains the final authorization source of truth.
- Sidebar links are navigation only; they are not an authorization mechanism.

## 4. Error handling

- A `401` response MUST be normalized through `ApiClientError`.
- The global authentication handler clears the in-memory session and redirects
  to login.
- User-facing authentication errors MUST remain generic; never reveal whether
  an account exists, is locked, or is inactive.
- Credentials and access tokens MUST NOT be logged.

## 5. Layering

Use this dependency direction:

```text
page/component -> feature hook -> feature service -> api client -> backend
```

- Components render UI and emit user actions.
- Hooks manage loading, data, and mutation state.
- Services define endpoint calls and authentication options.
- The API client owns headers, cookies, response parsing, and error
  normalization.

## 6. Required tests and review checklist

Every protected feature MUST verify:

- the request contains an `Authorization: Bearer ...` header;
- the route waits for auth initialization;
- an unauthenticated user is redirected to `/login`;
- a user with the wrong role is redirected to `/forbidden`;
- a `401` clears the session and does not expose sensitive details.

Pull requests adding a protected page or service MUST answer these questions:

1. Which route guard protects the page?
2. Which service sends the API request?
3. Where is the access token attached?
4. Which test proves the header and redirect behavior?
