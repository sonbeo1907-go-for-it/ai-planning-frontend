export type FieldErrors = Record<string, string>;

export interface ApiErrorResponse {
  status: number;
  code: string;
  message: string;
  path?: string;
  timestamp?: string;
  requestId?: string;
  fieldErrors: FieldErrors;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
