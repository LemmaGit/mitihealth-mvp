import status from "http-status";
import { clerkClient } from "@clerk/express";
import { User } from "../models/User.model";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/ApiError";

export const syncUser = catchAsync(async (req, res, next) => {
  const auth = (req as any).auth;

  if (!auth?.userId) return next();

  const clerkId = auth.userId;

  let user = await User.findOne({ clerkId });

  const clerkUser = await clerkClient.users.getUser(clerkId);

  if(!clerkUser) return next(new ApiError(status.NOT_FOUND,`User not found: ${status[status.NOT_FOUND]}`))
  if(!clerkUser.unsafeMetadata?.role) return next(new ApiError(status.NOT_FOUND,`User role not found: ${status[status.NOT_FOUND]}`))
  // if no user we create it here
  if (!user) {
    await User.create(
        { 
          clerkId,
          name: `${clerkUser.firstName} ${clerkUser.lastName}`.trim(),
          email: clerkUser.emailAddresses?.[0]?.emailAddress,
          role: clerkUser.unsafeMetadata?.role as string,
          profilePicture:clerkUser.imageUrl,
        }
      );

    console.log("⚠️ Fallback user created:", clerkId);
  }

  (req as any).dbUser = user;

  next();
});
