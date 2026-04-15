import { clerkClient } from "@clerk/express";
import { User } from "../models/User.model";
import catchAsync from "../utils/catchAsync";

export const syncUser = catchAsync(async (req, res, next) => {
  const auth = (req as any).auth;

  if (!auth?.userId) return next();

  const clerkId = auth.userId;

  let user = await User.findOne({ clerkId });

  let clerkUser;
  try {
    clerkUser = await clerkClient.users.getUser(clerkId);
  } catch (err) {
    console.error("Clerk fetch failed:", err);
    return next();
  }

  if (!user) {
    user = await User.create({
      clerkId,
      name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim(),
      email: clerkUser.emailAddresses?.[0]?.emailAddress,
      role: clerkUser.unsafeMetadata?.role || "user",
      profilePicture: clerkUser.imageUrl,
    });
  }
  (req as any).dbUser = user;
  next();
});