import status from "http-status";
import { clerkClient } from "@clerk/express";
import ApiError from "../utils/ApiError.ts";

export const protectRole = (allowedRoles: string[]) => {
  return async (req: any, res: any, next: any) => {
    if (!req.userId) {
      return next(new ApiError(status.UNAUTHORIZED, status[status.UNAUTHORIZED]));
    }

    const clerkUser = await clerkClient.users.getUser(req.userId);
    const role =
      (clerkUser.publicMetadata as Record<string, string>)?.role ??
      (clerkUser.unsafeMetadata as Record<string, string>)?.role;

    if (!role || !allowedRoles.includes(role)) {
      return next(
        new ApiError(status.FORBIDDEN, "You are not authorized to access this resource")
      );
    }

    req.userRole = role;
    next();
  };
};
