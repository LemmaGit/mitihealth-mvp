import { getAuth } from "@clerk/express";
import { Message } from "../models/message.model.ts";

export const getMessages = async (req, res) => {
  const { userId } = getAuth(req);
  const messages = await Message.find({
    $or: [
      { senderId: userId, receiverId: req.params.receiverId },
      { senderId: req.params.receiverId, receiverId: userId },
    ],
  }).sort({ createdAt: 1 });
  res.json(messages);
};
