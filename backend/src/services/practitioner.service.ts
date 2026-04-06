import { clerkClient} from "@clerk/express";
import { Practitioner } from "../models/Practitioner.model";
import { createNotificationsForRole } from "./notification.service";
import mongoose from "mongoose";

const ALLOWED_VERIFICATION_STATUSES = ["pending", "approved", "rejected"] as const;

const isAllowedVerificationStatus = (value: unknown): value is
  (typeof ALLOWED_VERIFICATION_STATUSES)[number] => {
  return (
    typeof value === "string" &&
    (ALLOWED_VERIFICATION_STATUSES as readonly string[]).includes(value)
  );
};

export const findVerifiedPractitioners = async (filters: {
  condition?: unknown;
  location?: unknown;
  minFee?: unknown;
  maxFee?: unknown;
}) => {
  const query: Record<string, unknown> = { verificationStatus: "approved" };
  const { condition, location, minFee, maxFee } = filters;

  if (condition) query.conditionsTreated = { $in: [condition] };
  if (location) query.location = { $regex: String(location), $options: "i" };

  const min = minFee != null && String(minFee) !== "" ? Number(minFee) : null;
  const max = maxFee != null && String(maxFee) !== "" ? Number(maxFee) : null;

  if (min != null || max != null) {
    const low = min != null && !Number.isNaN(min) ? min : 0;
    const high =
      max != null && !Number.isNaN(max) ? max : Number.MAX_SAFE_INTEGER;
    const priceBounds = { $gte: low, $lte: high };
    query.$or = [
      {
        "consultationTypes.chat.enabled": true,
        "consultationTypes.chat.price": priceBounds,
      },
      {
        "consultationTypes.audio.enabled": true,
        "consultationTypes.audio.price": priceBounds,
      },
      {
        "consultationTypes.video.enabled": true,
        "consultationTypes.video.price": priceBounds,
      },
    ];
  }

  // also fetch thir infor from clerk and sent that too

  const practitioners = await Practitioner.find(query).select(
    "clerkId specialization practicingSinceEC location consultationTypes conditionsTreated availability verificationStatus createdAt",
  );
  const practitionersWithClerk = await Promise.all(practitioners.map(async (p) => {
    const user = await clerkClient.users.getUser(p.clerkId);
    return {
      ...p.toObject(),
      clerkInfo: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0]?.emailAddress,
        profileImage: user.imageUrl,
      },
    };
  })
);

return practitionersWithClerk;
};

export const findPractitionerById = async (id: string) => {
  const user = await clerkClient.users.getUser(id);
  const practitioner = await Practitioner.findOne({ clerkId: id });

  if (!practitioner) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const Consultation = mongoose.model("Consultation");
  
  const futureConsultations = await Consultation.find({
    practitionerId: id,
    consultationDate: { $gte: today },
    status: "active",
  }).select("consultationDate consultationTime");

  const obj = practitioner.toObject(); 
  return {
    ...obj,
    imageUrl: user.imageUrl,
    fullName: user.fullName,
    activeSlots: futureConsultations.map((c: any) => ({
      date: c.consultationDate,
      time: c.consultationTime,
    })),
  };
};

export const getPractitionerData = async (id: string) => {
  const user = await clerkClient.users.getUser(id);
  const practitioner = await Practitioner.findOne({
    clerkId: id,
  });

  return {
    clerkId: practitioner?.clerkId,
    specialization: practitioner?.specialization,
    practicingSinceEC: practitioner?.practicingSinceEC,
    location: practitioner?.location,
    consultationTypes: practitioner?.consultationTypes,
    conditionsTreated: practitioner?.conditionsTreated || [],
    availability: practitioner?.availability || [],
    bio: practitioner?.bio || "",
    verificationStatus: practitioner?.verificationStatus,
    imageUrl: user.imageUrl,
    fullName: user.fullName,
  };
};

export const upsertPractitionerProfile = async (userId: string, data: any) => {
  const practitioner = await Practitioner.findOneAndUpdate(
    { clerkId: userId },
    { clerkId: userId, ...data }, 
    { upsert: true, returnDocument: "after" },
  );
  await createNotificationsForRole({
    role: "admin",
    type: "practitioner:pending",
    title: "New practitioner profile pending",
    message: `Practitioner ${userId} submitted/updated profile for review.`,
    metadata: { practitionerId: practitioner?._id, clerkId: userId },
  });
  return practitioner;
};

export const updatePractitionerVerification = async (
  id: string,
  verificationStatus: unknown,
) => {
  if (!isAllowedVerificationStatus(verificationStatus)) return null;

  return Practitioner.findByIdAndUpdate(
    id,
    { verificationStatus },
    { returnDocument: "after" },
  );
};

export const updatePractitionerAvailabilityAndFee = async (
  userId: string,
  payload: {
    consultationTypes?: any;
    availability?: any;
  },
) => {
  return Practitioner.findOneAndUpdate(
    { clerkId: userId },
    {
      ...(typeof payload.consultationTypes !== "undefined"
        ? { consultationTypes: payload.consultationTypes }
        : {}),
      ...(typeof payload.availability !== "undefined"
        ? { availability: payload.availability }
        : {}),
    },
    { returnDocument: "after" },
  );
};

