//@ts-ignore
import streamifier from "streamifier";
import cloudinary from "../lib/cloudinary.ts";
import type { Request } from "express";
import { clerkClient } from "@clerk/express";


export const uploadImage = (req: Request, folder = "herbs") =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );
//@ts-ignore
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  });


export async function getClerkUsers(users: Array<{ clerkId: string; toObject(): any }>) {
  const usersWithClerkData = await Promise.all(
    users.map(async (user) => {
      const clerkUser = await clerkClient.users.getUser(user.clerkId);

      return {
        ...user.toObject(),
        imageUrl: clerkUser.imageUrl,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
      };
    })
  );

  return usersWithClerkData;
}
