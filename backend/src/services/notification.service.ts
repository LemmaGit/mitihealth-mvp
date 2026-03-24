import { Notification } from "../models/notification.model.ts";
import { User } from "../models/User.model.ts";
import { io, getReceiverSocketId } from "../lib/socket.ts";
import { sendEmail } from "../lib/mailer.ts";

export const createNotification = async (input: {
  userId: string;
  type: string;
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
  sendEmailAlert?: boolean;
}) => {
  const notification = await Notification.create({
    userId: input.userId,
    type: input.type,
    title: input.title,
    message: input.message,
    metadata: input.metadata || {},
  });

  const receiverSocketId = getReceiverSocketId(input.userId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("notification:new", notification);
  }

  if (input.sendEmailAlert) {
    const recipient = await User.findOne({ clerkId: input.userId }).select("email");
    if (recipient?.email) {
      await sendEmail(recipient.email, input.title, input.message);
    }
  }

  return notification;
};

export const createNotificationsForRole = async (input: {
  role: "admin" | "patient" | "practitioner" | "supplier";
  type: string;
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
  sendEmailAlert?: boolean;
}) => {
  const users = await User.find({ role: input.role }).select("clerkId");
  return Promise.all(
    users.map((u) =>
      createNotification({
        userId: u.clerkId,
        type: input.type,
        title: input.title,
        message: input.message,
        metadata: input.metadata,
        sendEmailAlert: input.sendEmailAlert,
      }),
    ),
  );
};

export const getNotificationsForUser = async (userId: string) => {
  return Notification.find({ userId }).sort({ createdAt: -1 }).limit(50);
};

export const markNotificationRead = async (userId: string, id: string) => {
  return Notification.findOneAndUpdate(
    { _id: id, userId },
    { isRead: true },
    { returnDocument: "after" },
  );
};

export const clearNotification = async (userId: string, id: string) => {
  return Notification.findOneAndDelete({ _id: id, userId });
};
