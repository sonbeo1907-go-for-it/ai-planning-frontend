import { toAuthorizationHeader } from "@/lib/auth";
import { env } from "@/lib/env";
import type {
  ApiErrorResponse,
  FieldErrors,
} from "@/types/api";

type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE";

type QueryPrimitive =
  | string
  | number
  | boolean
  | null
  | undefined;

export type QueryValue =
  | QueryPrimitive
  | QueryPrimitive[];

export type QueryParams =
  Record<string, QueryValue>;

export interface ApiRequestOptions
  extends Omit<RequestInit, "body" | "method"> {
  query?: QueryParams;
  body?: unknown;
  accessToken?: string | null;
  handleAuthenticationError?: boolean;
}

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return (
    typeof value === "object"
    && value !== null
    && !Array.isArray(value)
  );
}

function getString(value: unknown): string | undefined {
  return typeof value === "string"
    ? value
    : undefined;
}

function appendQueryValue(
  searchParams: URLSearchParams,
  key: string,
  value: QueryPrimitive,
): void {
  if (
    value === null
    || value === undefined
    || value === ""
  ) {
    return;
  }

  searchParams.append(key, String(value));
}

function createUrl(
  path: string,
  query?: QueryParams,
): string {
  const normalizedPath = path.startsWith("/")
    ? path
    : `/${path}`;

  const url = new URL(`${env.apiUrl}${normalizedPath}`);

  if (!query) {
    return url.toString();
  }

  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        appendQueryValue(url.searchParams, key, item);
      });
      return;
    }

    appendQueryValue(url.searchParams, key, value);
  });

  return url.toString();
}

async function parseResponseBody(
  response: Response,
): Promise<unknown> {
  if (response.status === 204) {
    return null;
  }

  const text = await response.text();

  if (!text.trim()) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function normalizeFieldErrors(
  value: unknown,
): FieldErrors {
  if (isRecord(value)) {
    return Object.entries(value).reduce<FieldErrors>(
      (errors, [field, message]) => {
        if (typeof message === "string") {
          errors[field] = message;
        }
        return errors;
      },
      {},
    );
  }

  if (Array.isArray(value)) {
    return value.reduce<FieldErrors>((errors, item) => {
      if (!isRecord(item)) {
        return errors;
      }

      const field = getString(item.field);
      const message = getString(item.message);

      if (field && message) {
        errors[field] = message;
      }

      return errors;
    }, {});
  }

  return {};
}

export class ApiClientError extends Error {
  readonly status: number;
  readonly code: string;
  readonly path?: string;
  readonly timestamp?: string;
  readonly requestId?: string;
  readonly fieldErrors: FieldErrors;
  readonly payload?: unknown;

  constructor(
    error: ApiErrorResponse,
    payload?: unknown,
  ) {
    super(error.message);

    this.name = "ApiClientError";
    this.status = error.status;
    this.code = error.code;
    this.path = error.path;
    this.timestamp = error.timestamp;
    this.requestId = error.requestId;
    this.fieldErrors = error.fieldErrors;
    this.payload = payload;
  }
}

export type AuthenticationErrorHandler = (
  error: ApiClientError,
) => void;

let authenticationErrorHandler: AuthenticationErrorHandler | undefined;

/**
 * Lets the client-side authentication boundary respond consistently to 401
 * responses without coupling the shared HTTP client to a feature store.
 */
export function setAuthenticationErrorHandler(
  handler: AuthenticationErrorHandler | undefined,
): void {
  authenticationErrorHandler = handler;
}

function createApiClientError(
  response: Response,
  payload: unknown,
): ApiClientError {
  const objectPayload = isRecord(payload)
    ? payload
    : {};

  return new ApiClientError(
    {
      status: response.status,
      code:
        getString(objectPayload.code)
        ?? `HTTP_${response.status}`,
      message:
        getString(objectPayload.message)
        ?? response.statusText
        ?? "Đã xảy ra lỗi khi gọi API.",
      path: getString(objectPayload.path),
      timestamp: getString(objectPayload.timestamp),
      requestId: getString(objectPayload.requestId),
      fieldErrors: normalizeFieldErrors(
        objectPayload.fieldErrors
        ?? objectPayload.errors
        ?? objectPayload.violations,
      ),
    },
    payload,
  );
}

async function request<T>(
  method: HttpMethod,
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const {
    query,
    body,
    accessToken,
    handleAuthenticationError = true,
    headers: customHeaders,
    ...requestInit
  } = options;

  const headers = new Headers(customHeaders);
  headers.set("Accept", "application/json");

  const authorization = toAuthorizationHeader(accessToken);

  if (authorization && !headers.has("Authorization")) {
    headers.set("Authorization", authorization);
  }

  let requestBody: BodyInit | undefined;

  if (body !== undefined) {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    requestBody = JSON.stringify(body);
  }

  const response = await fetch(createUrl(path, query), {
    credentials: "include",
    ...requestInit,
    method,
    headers,
    body: requestBody,
  });

  const payload = await parseResponseBody(response);

  if (!response.ok) {
    const error = createApiClientError(response, payload);

    if (error.status === 401 && handleAuthenticationError) {
      authenticationErrorHandler?.(error);
    }

    throw error;
  }

  return payload as T;
}

type GetOptions = Omit<ApiRequestOptions, "body">;

export const apiClient = {
  get<T>(
    path: string,
    options?: GetOptions,
  ): Promise<T> {
    return request<T>("GET", path, options);
  },

  post<TResponse, TBody = unknown>(
    path: string,
    body?: TBody,
    options?: Omit<ApiRequestOptions, "body">,
  ): Promise<TResponse> {
    return request<TResponse>("POST", path, {
      ...options,
      body,
    });
  },

  put<TResponse, TBody = unknown>(
    path: string,
    body: TBody,
    options?: Omit<ApiRequestOptions, "body">,
  ): Promise<TResponse> {
    return request<TResponse>("PUT", path, {
      ...options,
      body,
    });
  },

  patch<TResponse, TBody = unknown>(
    path: string,
    body: TBody,
    options?: Omit<ApiRequestOptions, "body">,
  ): Promise<TResponse> {
    return request<TResponse>("PATCH", path, {
      ...options,
      body,
    });
  },

  delete<T>(
    path: string,
    options?: ApiRequestOptions,
  ): Promise<T> {
    return request<T>("DELETE", path, options);
  },
};
