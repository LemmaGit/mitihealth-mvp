import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  messageText: String,
  imageUrl: String,
  consultationId: { type: mongoose.Schema.Types.ObjectId, ref: "Consultation" },
  createdAt: { type: Date, default: Date.now },
});

export const Message = mongoose.model("Message", MessageSchema);
