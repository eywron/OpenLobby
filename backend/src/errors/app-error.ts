export type AppErrorOptions = {
  message: string;
  statusCode?: number;
  code?: string;
  details?: unknown;
};

export class AppError extends Error {
  public readonly statusCode: number;

  public readonly code: string;

  public readonly details?: unknown;

  constructor({ message, statusCode = 500, code = "INTERNAL_SERVER_ERROR", details }: AppErrorOptions) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}