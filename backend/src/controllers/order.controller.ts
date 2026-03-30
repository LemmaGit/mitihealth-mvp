import status from "http-status";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/ApiError";
import {
  createOrderForPatient,
  getOrdersForPatient,
  getSupplierOrders,
  getOrderById,
  updateOrderStatusForSupplier,
} from "../services/order.service";

export const createOrder = catchAsync(async (req: any, res) => {
  const userId: string | undefined = req.userId;
  if (!userId) {
    throw new ApiError(status.UNAUTHORIZED, status[status.UNAUTHORIZED]);
  }

  const order = await createOrderForPatient(userId, req.body);
  res.json(order);
});

export const getMyOrder = catchAsync(async (req: any, res) => {
  const userId: string | undefined = req.userId;
  if (!userId) {
    throw new ApiError(status.UNAUTHORIZED, status[status.UNAUTHORIZED]);
  }

  const orders = await getOrdersForPatient(userId);
  res.json(orders);
});

export const getMySupplierOrders = catchAsync(async (req: any, res) => {
  const userId: string | undefined = req.userId;
  if (!userId) {
    throw new ApiError(status.UNAUTHORIZED, status[status.UNAUTHORIZED]);
  }

  const orders = await getSupplierOrders(userId);
  res.json(orders);
});

export const getOrderDetails = catchAsync(async (req: any, res) => {
  const { orderId } = req.params;
  
  const order = await getOrderById(orderId);
  if (!order) {
    throw new ApiError(status.NOT_FOUND, "Order not found");
  }
  
  res.status(status.OK).json(order);
});

export const updateOrderStatusForSupplierHandler = catchAsync(async (req: any, res) => {
  const userId: string | undefined = req.userId;
  const { orderId } = req.params;
  const { status: statusFromBody } = req.body;

  if (!userId) {
    throw new ApiError(status.UNAUTHORIZED, status[status.UNAUTHORIZED]);
  }

  const newStatus: string = Array.isArray(statusFromBody)
    ? String(statusFromBody[0])
    : String(statusFromBody);

  if (!newStatus) {
    throw new ApiError(status.BAD_REQUEST, "Order status is required");
  }

  const updated = await updateOrderStatusForSupplier(userId, orderId, newStatus);
  if (!updated) {
    // Keep message simple; 404 vs 403 is not always distinguishable without extra queries.
    throw new ApiError(status.NOT_FOUND, "Order not found (or you do not have permission)");
  }

  res.status(status.OK).json({ success: true, order: updated });
});
