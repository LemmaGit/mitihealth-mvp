import status from "http-status";
import catchAsync from "../utils/catchAsync";
import { User } from "../models/User.model";
import { clerkClient } from "@clerk/express";

export const getUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  // Get user from our database
  const user = await User.findOne({ clerkId: id });
  if (!user) {
    return res.status(status.NOT_FOUND).json({ message: "User not found" });
  }
  
  // Get user info from Clerk
  const clerkUser = await clerkClient.users.getUser(id);
  
  // Combine user data
  const userData = {
    _id: user._id,
    clerkId: user.clerkId,
    name: user.name || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
    email: user.email || clerkUser.emailAddresses[0]?.emailAddress,
    role: user.role,
    profilePicture: user.profilePicture || clerkUser.imageUrl,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    imageUrl: clerkUser.imageUrl
  };
  
  res.status(status.OK).json(userData);
});
