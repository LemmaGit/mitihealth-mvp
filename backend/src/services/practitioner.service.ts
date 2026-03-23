import { Practitioner } from "../models/Practitioner.model.ts";

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
  const query: any = { verificationStatus: "approved" };
  const { condition, location, minFee, maxFee } = filters;

  if (condition) query.conditionsTreated = { $in: [condition] };
  if (location) query.location = { $regex: String(location), $options: "i" };
  if (minFee) query["consultationTypes.video.price"] = { $gte: Number(minFee) };
  if (maxFee)
    query["consultationTypes.video.price"] = {
      ...(query["consultationTypes.video.price"] || {}),
      $lte: Number(maxFee),
    };

  return Practitioner.find(query).select(
    "clerkId specialization practicingSinceEC location consultationTypes conditionsTreated availability verificationStatus createdAt",
  );
};

export const findPractitionerById = async (id: string) => {
  return Practitioner.findOne({
  clerkId: id,
});;
};

export const upsertPractitionerProfile = async (userId: string, data: any) => {
  return Practitioner.findOneAndUpdate(
    { clerkId: userId },
    { clerkId: userId, ...data }, 
    { upsert: true, returnDocument: "after" },
  );
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

