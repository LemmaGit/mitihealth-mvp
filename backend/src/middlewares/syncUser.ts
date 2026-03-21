import status from "http-status";
import { clerkClient } from "@clerk/express";
import { User } from "../models/User.model.ts";
import catchAsync from "../utils/catchAsync.ts";
import ApiError from "../utils/ApiError.ts";

export const syncUser = catchAsync(async (req, res, next) => {
  const auth = (req as any).auth;

  if (!auth?.userId) return next();

  const clerkId = auth.userId;

  let user = await User.findOne({ clerkId });

  const clerkUser = await clerkClient.users.getUser(clerkId);

  if(!clerkUser) return next(new ApiError(status.NOT_FOUND,`User not found: ${status[status.NOT_FOUND]}`))
  
  if (!user) {
    await User.findOneAndUpdate(
        { clerkId },
        {
          clerkId,
          name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
          email: clerkUser.emailAddresses?.[0]?.emailAddress,
          role: clerkUser.unsafeMetadata?.role || "patient",
        },
        { upsert: true, new: true }
      );

    console.log("⚠️ Fallback user created:", clerkId);
  }

  (req as any).dbUser = user;

  next();
});