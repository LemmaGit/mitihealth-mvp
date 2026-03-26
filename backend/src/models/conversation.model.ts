import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  participants: [{
    userId: { type: String, required: true }, // Clerk ID
    joinedAt: { type: Date, default: Date.now }
  }],
  lastMessage: {
    text: String,
    image: String,
    senderId: { type: String, required: true }, // Clerk ID
    timestamp: { type: Date, default: Date.now }
  },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Index for efficient queries
conversationSchema.index({ "participants.userId": 1 });
conversationSchema.index({ updatedAt: -1 });

export const Conversation = mongoose.model("Conversation", conversationSchema);
