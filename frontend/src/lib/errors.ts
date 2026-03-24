export class AppError extends Error {
  readonly code: string;
  readonly status?: number;
  readonly details?: unknown;

  constructor(message: string, code = "APP_ERROR", status?: number, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export class NetworkError extends AppError {
  constructor(message = "Network error. Please check your connection.", details?: unknown) {
    super(message, "NETWORK_ERROR", undefined, details);
    this.name = "NetworkError";
  }
}

export class ApiRequestError extends AppError {
  constructor(message: string, status?: number, details?: unknown) {
    super(message, "API_REQUEST_ERROR", status, details);
    this.name = "ApiRequestError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "You are not authorized to perform this action.", details?: unknown) {
    super(message, "UNAUTHORIZED_ERROR", 401, details);
    this.name = "UnauthorizedError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "The requested resource was not found.", details?: unknown) {
    super(message, "NOT_FOUND_ERROR", 404, details);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed. Please check your input.", details?: unknown) {
    super(message, "VALIDATION_ERROR", 400, details);
    this.name = "ValidationError";
  }
}
