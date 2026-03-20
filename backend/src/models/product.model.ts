import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  supplierId: { type: String, required: true }, // clerkId
  name: { type: String, required: true },
  description: String,
  ingredients: [String],
  usageInstructions: [String],
  price: { type: Number, required: true },
  inventory: { type: Number, default: 0 },
  imageUrls: [String],
  verificationStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export const Product = mongoose.model("Product", ProductSchema);
