import mongoose from "mongoose";

const ConsultationSchema = new mongoose.Schema({
  patientId: { type: String, required: true }, // clerkId
  practitionerId: { type: String, required: true },
  consultationDate: { type: Date, required: true },
  consultationTime: String,
  consultationType: {
    type: String,
    enum: ["chat", "audio", "video"],
    required: true,
  },
  status: { type: String, default: "booked" },
  jitsiRoom: String, // for video/audio calls
  createdAt: { type: Date, default: Date.now },
});

export const Consultation = mongoose.model("Consultation", ConsultationSchema);
