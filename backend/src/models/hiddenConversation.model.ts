import mongoose from "mongoose";

const hiddenConversationSchema = new mongoose.Schema({
  userId: {
    type: String, // Clerk ID string
    required: true
  },
  hiddenUserId: {
    type: String, // Clerk ID string
    required: true
  }
}, {
  timestamps: true
});

// Create indexes for efficient queries
hiddenConversationSchema.index({ userId: 1, hiddenUserId: 1 });

const HiddenConversation = mongoose.model("HiddenConversation", hiddenConversationSchema);

export { HiddenConversation };
