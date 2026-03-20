import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  name: String,
  email: String,
  phone: String,
  role: { type: String, enum: ['patient', 'practitioner', 'supplier', 'admin'] },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);