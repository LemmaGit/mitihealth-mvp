import { Order } from "../models/order.model";
import { Product } from "../models/product.model";
import { createNotification } from "./notification.service";

const ALLOWED_ORDER_STATUSES = ["placed", "confirmed", "shipped", "completed"] as const;

export const createOrderForPatient = async (patientId: string, orderData: any) => {
  const order = await Order.create({ patientId, ...orderData });
  const product = await Product.findById(order.productId);
  if (product?.supplierId) {
    await createNotification({
      userId: product.supplierId,
      type: "order:new",
      title: "New order placed",
      message: `A new order was placed for ${product.name}.`,
      metadata: { orderId: order._id, productId: product._id },
      sendEmailAlert: true,
    });
  }
  return order;
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
  if ((order.productId as any).supplierId !== supplierId) return null;

  order.orderStatus = orderStatus as "placed" | "confirmed" | "shipped" | "completed";
  await order.save();
  return order;
};

export const getOrderById = async (orderId: string) => {
  return Order.findById(orderId)
    .populate("productId", "name price imageUrls")
    .populate("patientId", "name email");
};

