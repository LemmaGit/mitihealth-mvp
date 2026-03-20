import mongoose from "mongoose";

const PractitionerSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  specialization: { type: String, required: true },
  experienceYears: { type: Number, default: 0 },
  location: { type: String, required: true },
  consultationFee: { type: Number, required: true },
  conditionsTreated: [{ type: String }],
  availability: { type: Object, default: {} }, // e.g. { "Monday": ["09:00","10:00"] }
  verificationStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export const Practitioner = mongoose.model("Practitioner", PractitionerSchema);
