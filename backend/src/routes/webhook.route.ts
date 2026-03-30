import {Router} from "express";
import { Webhook } from "svix";
import { User } from "../models/User.model";
import catchAsync from "../utils/catchAsync";
import status from "http-status";
import ApiError from "../utils/ApiError";

const router = Router();

router.post("/", catchAsync(async (req, res) => {
  const payload = req.body 
  const headers = req.headers as Record<string, string>;
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  let evt;
  try {
    evt = wh.verify(payload, {
      "svix-id": headers["svix-id"],
      "svix-timestamp": headers["svix-timestamp"],
      "svix-signature": headers["svix-signature"],
    });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return res.status(400).json({ success: false });
  }

  const eventType = (evt as any).type;
  const data = (evt as any).data;

  if (eventType === 'user.updated') {
    const role = (data.unsafe_metadata as any)?.role;
    if(!role) return res.status(status.BAD_REQUEST).json(new ApiError(status.BAD_REQUEST,"Role not found"));
    await User.create({
      clerkId: data.id,
      name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
      email: data.email_addresses?.[0]?.email_address,
      profilePicture:data.image_url,
      role: role,
      isVerified:role!=="practitioner"
    });
  
    console.log(`✅ User created: ${data.id} (${role})`);
  }

  return res.status(200).json({ success: true });
}));

export default router;
