import mongoose from "mongoose";

const PractitionerSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  specialization: { type: String, required: true },
  practicingSinceEC: { type: Number, required: true },
  location: { type: String, required: true },
  consultationTypes: {
    chat: {
      enabled: { type: Boolean, default: false },
      price: { type: Number, default: 0 }
    },
    audio: {
      enabled: { type: Boolean, default: false },
      price: { type: Number, default: 0 }
    },
    video: {
      enabled: { type: Boolean, default: false },
      price: { type: Number, default: 0 }
    }
  },
  conditionsTreated: [{ type: String }],
  availability: { type: mongoose.Schema.Types.Mixed, default: [] },
  bio: { type: String, default: "" },
  verificationStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export const Practitioner = mongoose.model("Practitioner", PractitionerSchema);
