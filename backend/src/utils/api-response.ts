export type ApiSuccessResponse<TData> = {
  success: true;
  message?: string;
  data: TData;
};

export type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export function createSuccessResponse<TData>(data: TData, message?: string): ApiSuccessResponse<TData> {
  return message === undefined ? { success: true, data } : { success: true, message, data };
}

export function createErrorResponse({
  code,
  message,
  details
}: {
  code: string;
  message: string;
  details?: unknown;
}): ApiErrorResponse {
  return {
    success: false,
    error: details === undefined ? { code, message } : { code, message, details }
  };
}