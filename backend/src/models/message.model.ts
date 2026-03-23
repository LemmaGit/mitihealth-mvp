import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  text:{ type:String},
  image: {type: String},
  consultationId: { type: mongoose.Schema.Types.ObjectId, ref: "Consultation" },
},{timestamps: true });

export const Message = mongoose.model("Message", MessageSchema);
