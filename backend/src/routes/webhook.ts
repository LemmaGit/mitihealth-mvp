import express from "express";
import { Webhook } from "svix";
import { User } from "../models/User.model.ts";
import { clerkClient } from "@clerk/express";

const router = express.Router();

router.post("/", async (req, res) => {
  const payload = req.body.toString();
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

  const eventType = evt.type;
  const data = evt.data;

  if (eventType === "user.created") {
    const role = (data.unsafe_metadata as any)?.role || "patient"; // from signup

    await User.create({
      clerkId: data.id,
      name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
      email: data.email_addresses?.[0]?.email_address,
      phone: data.phone_numbers?.[0]?.phone_number,
      role: role,
    });

    console.log(`✅ User synced: ${data.id} (${role})`);
  }

  res.status(200).json({ success: true });
});

export default router;
