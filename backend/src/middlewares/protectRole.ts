import status from "http-status";
import { User } from "../models/User.model.ts";
import ApiError from "../utils/ApiError.ts";

export const protectRole = (allowedRoles: string[]) => {
  return async (req: any, res: any, next: any) => {
    const user = await User.findOne({ clerkId: req.userId });

    if (!user || !allowedRoles.includes(user.role!)) {
      return next(new ApiError(status.FORBIDDEN, status[status.FORBIDDEN]));
    }
    next();
  };
};
