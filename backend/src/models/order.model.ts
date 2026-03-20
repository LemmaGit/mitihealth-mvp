import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, default: 1 },
  orderStatus: {
    type: String,
    enum: ["placed", "confirmed", "shipped", "completed"],
    default: "placed",
  },
  createdAt: { type: Date, default: Date.now },
});

export const Order = mongoose.model("Order", OrderSchema);
