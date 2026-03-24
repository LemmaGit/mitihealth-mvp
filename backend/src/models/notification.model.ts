import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true }, // clerkId recipient
  type: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const Notification = mongoose.model("Notification", NotificationSchema);
