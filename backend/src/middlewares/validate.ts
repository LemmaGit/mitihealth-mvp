import type { Request, Response, NextFunction } from "express";
import type { ZodTypeAny } from "zod";
import status from "http-status";
import ApiError, { type ValidationErrorItem } from "../utils/ApiError";

type ZodIssueLike = { path: unknown[]; message: string };

//TODO: {"field": "inventory","message": "must be a valid number"} getting values like this 
// for fields that are not even sent fix this

function isMissingOrEmpty(value: unknown): boolean {
  return (
    value === undefined ||
    value === null ||
    value === "" ||
    (typeof value === "number" && Number.isNaN(value))
  );
}

function toFriendlyMessage(issue: ZodIssueLike): string {
  const msg = issue.message.toLowerCase();
  const received = (issue as { received?: unknown }).received;

  // Number / NaN - missing/empty → "is required", else "must be a valid number"
  if (msg.includes("expected number") || msg.includes("received nan")) {
    return isMissingOrEmpty(received) ? "is required" : "must be a valid number";
  }

  // String required / empty
  if (msg.includes("expected string") || (msg.includes("string") && msg.includes("at least 1"))) {
    return received === undefined || received === null ? "is required" : "must not be empty";
  }

  // Array - missing/empty → "is required", else "must be a valid list"
  if (msg.includes("expected array") || msg.includes("received string")) {
    return isMissingOrEmpty(received) ? "is required" : "must be a valid list";
  }

  // URL
  if (msg.includes("invalid") && msg.includes("url")) {
    return "must be a valid URL";
  }

  // Date - missing/empty → "is required", else "must be a valid date"
  if (msg.includes("invalid date")) {
    return isMissingOrEmpty(received) ? "is required" : "must be a valid date";
  }

  // Enum / invalid value - missing → "is required", else "has an invalid value"
  if (msg.includes("invalid enum") || msg.includes("invalid literal")) {
    return isMissingOrEmpty(received) ? "is required" : "has an invalid value";
  }

  // Too small (min length, min items)
  if (msg.includes("too small") || msg.includes("at least")) {
    return issue.message;
  }

  // Nonnegative / positive
  if (msg.includes("nonnegative") || msg.includes("greater than")) {
    return "must be zero or greater";
  }

  // Refine / custom
  if (issue.message && !msg.includes("expected") && !msg.includes("received")) {
    return issue.message;
  }

  // Fallback: simplify raw Zod messages
  if (msg.includes("required")) return "is required";
  return issue.message.replace(/^Invalid input: /, "").replace(/expected \w+, received \w+/, "has an invalid format") || "is invalid";
}

function formatValidationErrors(issues: ZodIssueLike[]): ValidationErrorItem[] {
  return issues.map((issue) => {
    const pathParts = issue.path.filter(
      (p): p is string | number => typeof p === "string" || typeof p === "number"
    );
    const field = pathParts.length > 0 ? pathParts.join(".") : "body";
    return {
      field,
      message: toFriendlyMessage(issue),
    };
  });
}

export const validate =
  (schema: ZodTypeAny) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body ?? {});
    console.log(req.body)
    if (!result.success) {
      const errors = formatValidationErrors(
        result.error.issues as ZodIssueLike[]
      );
      return next(
        new ApiError(status.BAD_REQUEST, "Validation failed", true, undefined, {
          errors,
        })
      );
    }

    req.body = result.data;

    next();
  };
