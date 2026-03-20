import type { Request, Response, NextFunction } from "express";
import { ZodObject } from "zod";
import status from "http-status";
import ApiError from "../utils/ApiError.ts";

type Schema = ZodObject;

export const validate =
  (schema: Schema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const keys = Object.keys(schema.shape);

    const object: Record<string, unknown> = keys.reduce(
      (obj, key) => {
        if (Object.prototype.hasOwnProperty.call(req, key)) {
          obj[key] = (req as any)[key];
        }
        return obj;
      },
      {} as Record<string, unknown>,
    );

    const result = schema.safeParse(object);

    if (!result.success) {
      const errors = result.error.issues.map((err) => err.message).join(",");

      return next(new ApiError(status.BAD_REQUEST, errors));
    }

    // assign validated data back to req
    // Object.assign(req, result.data);
    req.body = result.data;

    next();
  };
