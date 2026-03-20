import { getAuth } from "@clerk/express";
import { Order } from "../models/order.model.ts";

export const createOrder = async (req, res) => {
  const { userId } = getAuth(req);
  const order = await Order.create({ patientId: userId, ...req.body });
  res.json(order);
};

export const getMyOrder = async (req, res) => {
  const { userId } = getAuth(req);
  const orders = await Order.find({ patientId: userId }).populate("productId");
  res.json(orders);
};
