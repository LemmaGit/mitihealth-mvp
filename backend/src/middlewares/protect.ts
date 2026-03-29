import status from "http-status";
import { getAuth } from "@clerk/express";
import ApiError from "../utils/ApiError";

export const protect = (req: any, res: any, next: any) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return next(new ApiError(status.UNAUTHORIZED, status[status.UNAUTHORIZED]));
  }

  req.userId = userId;

  next();
};
