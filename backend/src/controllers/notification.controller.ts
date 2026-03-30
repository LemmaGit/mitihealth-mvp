import status from "http-status";
import catchAsync from "../utils/catchAsync.ts";
import ApiError from "../utils/ApiError.ts";
import {
  clearNotification,
  getNotificationsForUser,
  markNotificationRead,
} from "../services/notification.service.ts";

export const getMyNotifications = catchAsync(async (req: any, res) => {
  const userId: string | undefined = req.userId;
  if (!userId) {
    throw new ApiError(status.UNAUTHORIZED, status[status.UNAUTHORIZED]);
  }
  const notifications = await getNotificationsForUser(userId);
  res.status(status.OK).json(notifications);
});

export const markAsRead = catchAsync(async (req: any, res) => {
  const userId: string | undefined = req.userId;
  if (!userId) {
    throw new ApiError(status.UNAUTHORIZED, status[status.UNAUTHORIZED]);
  }
  const updated = await markNotificationRead(userId, req.params.id as string);
  if (!updated) {
    throw new ApiError(status.NOT_FOUND, "Notification not found");
  }
  res.status(status.OK).json(updated);
});

export const clearOne = catchAsync(async (req: any, res) => {
  const userId: string | undefined = req.userId;
  if (!userId) {
    throw new ApiError(status.UNAUTHORIZED, status[status.UNAUTHORIZED]);
  }
  const deleted = await clearNotification(userId, req.params.id as string);
  if (!deleted) {
    throw new ApiError(status.NOT_FOUND, "Notification not found");
  }
  res.status(status.OK).json({ success: true });
});
