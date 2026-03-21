export interface ValidationErrorItem {
  field: string;
  message: string;
}

class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public details?: { errors: ValidationErrorItem[] };

  constructor(
    statusCode: number,
    message: string,
    isOperational: boolean = true,
    stack?: string,
    details?: { errors: ValidationErrorItem[] },
  ) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
