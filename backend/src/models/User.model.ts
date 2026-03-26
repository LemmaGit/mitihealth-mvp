import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  name: String,
  email: String,
  phone: String,
  profilePicture: String,
  role: { type: String, enum: ['patient', 'practitioner', 'supplier', 'admin'] },
  isVerified:{type:Boolean,default:true},
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);