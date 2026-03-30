import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import status from "http-status";
import ApiError from "../utils/ApiError";

interface CustomError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorConverter = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let error = err as CustomError;

  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode ||
      (error instanceof mongoose.Error
        ? status.BAD_REQUEST
        : status.INTERNAL_SERVER_ERROR);

    const message = error.message || status[statusCode as keyof typeof status];

    error = new ApiError(statusCode, message as string, false, error.stack);
  }

  next(error);
};

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.log(err)
  let { statusCode, message } = err;

  if (process.env.NODE_ENV === "production" && !err.isOperational) {
    statusCode = status.INTERNAL_SERVER_ERROR;
    message = status[statusCode as keyof typeof status] as string;
  }

  const response: Record<string, unknown> = {
    error: true,
    code: statusCode,
    message,
    ...(err.details?.errors && { errors: err.details.errors }),
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  };

  res.locals.errorMessage = message;

  if (process.env.NODE_ENV === "development") {
    console.error(err);
  }

  res.status(statusCode).send(response);
};
