import {Router} from "express";
import { Webhook } from "svix";
import { User } from "../models/User.model.ts";
import { Practitioner } from "../models/Practitioner.model.ts";
import catchAsync from "../utils/catchAsync.ts";

const router = Router();

//TODO: WHY are we adding a default fields to create the practioner create it once the user completes profile since we have the role
// we can manage

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

  const eventType = evt.type;
  const data = evt.data;
  if (eventType === 'user.created') {
    const role = (data.unsafe_metadata as any)?.role || 'patient';
    
    // Create User record
    await User.create({
      clerkId: data.id,
      name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
      email: data.email_addresses?.[0]?.email_address,
      // phone: data.phone_numbers?.[0]?.phone_number,
      role: role,
    });
  
    if (role === 'practitioner') {
      await Practitioner.create({
        clerkId: data.id,
        verificationStatus: 'pending',     // ← admin must approve
        specialization: '',
        experienceYears: 0,
        location: '',
        consultationFee: 0,
      });
    }
  
    console.log(`✅ User created: ${data.id} (${role})`);
  }

  res.status(200).json({ success: true });
}));

export default router;
