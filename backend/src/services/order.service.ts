import { Order } from "../models/order.model.ts";

const ALLOWED_ORDER_STATUSES = ["placed", "confirmed", "shipped", "completed"] as const;

export const createOrderForPatient = async (patientId: string, orderData: any) => {
  return Order.create({ patientId, ...orderData });
};

export const getOrdersForPatient = async (patientId: string) => {
  return Order.find({ patientId }).populate("productId");
};

export const getSupplierOrders = async (supplierId: string) => {
  // Populate product only when it belongs to this supplier; non-matching becomes `null`.
  const orders = await Order.find({})
    .populate({
      path: "productId",
      match: { supplierId },
      select: "name price imageUrls",
    })
    .populate("patientId", "name email");

  return orders.filter((order) => order.productId !== null);
};

export const updateOrderStatusForSupplier = async (
  supplierId: string,
  orderId: string,
  orderStatus: string,
) => {
  if (!ALLOWED_ORDER_STATUSES.includes(orderStatus as (typeof ALLOWED_ORDER_STATUSES)[number])) {
    return null;
  }

  const order = await Order.findById(orderId).populate("productId");
  if (!order) return null;
  if (!order.productId) return null; // product not found / not populated (non-supplier)

  // Suppliers can only update orders for their own products.
  if (order.productId.supplierId !== supplierId) return null;

  order.orderStatus = orderStatus;
  await order.save();
  return order;
};

