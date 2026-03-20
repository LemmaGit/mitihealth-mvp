import { getAuth } from "@clerk/express";
import { Practitioner } from "../models/Practitioner.model.ts";

export const getAllVerifiedPractitioners = async (req, res) => {
  const { condition, location, minFee, maxFee } = req.query;

  const query: any = { verificationStatus: "approved" };

  if (condition) query.conditionsTreated = { $in: [condition] };
  if (location) query.location = { $regex: location, $options: "i" };
  if (minFee) query.consultationFee = { $gte: Number(minFee) };
  if (maxFee)
    query.consultationFee = { ...query.consultationFee, $lte: Number(maxFee) };

  const practitioners = await Practitioner.find(query).populate(
    "clerkId",
    "name email",
  );
  res.json(practitioners);
};

export const getPractitioner = async (req, res) => {
  const practitioner = await Practitioner.findById(req.params.id);
  if (!practitioner) return res.status(404).json({ error: "Not found" });
  res.json(practitioner);
};

export const updatePractitionerProfile = async (req, res) => {
  const { userId } = getAuth(req);
  const data = req.body;

  const practitioner = await Practitioner.findOneAndUpdate(
    { clerkId: userId },
    { clerkId: userId, ...data },
    { upsert: true, new: true },
  );

  res.json(practitioner);
};

export const adminVerification = async (req, res) => {
  const { status } = req.body; // approved or rejected
  const practitioner = await Practitioner.findByIdAndUpdate(
    req.params.id,
    { verificationStatus: status },
    { new: true },
  );
  res.json(practitioner);
};
