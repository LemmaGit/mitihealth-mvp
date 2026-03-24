import status from "http-status";
import { Message } from "../models/message.model.ts";
import catchAsync from "../utils/catchAsync.ts";
import { User } from "../models/User.model.ts";
import { sendMessageService } from "../services/message.service.ts";


export const getUsersForSidebar = catchAsync(async (req, res) => {
     //@ts-ignore  
     const loggedInUserId = req.userId;
    const filteredUsers = await User.find({
      clerkId: { $ne: loggedInUserId },
    });
    res.status(status.OK).json(filteredUsers);

 });

export const getMessages = catchAsync(async (req, res) => {
  
    const { receiverId: userToChatId } = req.params;
    //@ts-ignore  
    const myId = req.userId;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    res.status(status.OK).json(messages);
 
});

export const sendMessage = catchAsync(async (req, res) => {
    const { text } = req.body;
    const { id: receiverId } = req.params;
    //@ts-ignore  
    const senderId = req.userId;  
    const newMessage = await sendMessageService(senderId,receiverId as string,text,req.file);
    res.status(status.CREATED).json(newMessage);
});
