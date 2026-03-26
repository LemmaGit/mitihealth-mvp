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
  duration: { type: Number, required: true }, // in minutes
  status: { 
    type: String, 
    enum: ["booked", "active", "completed"], 
    default: "booked" 
  },
  jitsiRoom: String, // for video/audio calls
  sessionStartTime: { type: Date }, // when session actually starts
  sessionEndTime: { type: Date }, // when session ends
  firstParticipantJoined: { type: Date }, // track when first person joins
  createdAt: { type: Date, default: Date.now },
});

export const Consultation = mongoose.model("Consultation", ConsultationSchema);
