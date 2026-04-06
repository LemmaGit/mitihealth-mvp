import status from "http-status";
import { Message } from "../models/message.model";
import { User } from "../models/User.model";
import { Conversation } from "../models/conversation.model";
import { sendMessageService } from "../services/message.service";
import catchAsync from "../utils/catchAsync";
import { getClerkUsers } from "../utils/helpers";

export const getUsersForSidebar = catchAsync(async (req, res) => {
  //@ts-ignore  
  const loggedInUserId = req.userId;

  // Get conversations where user is a participant
  const conversations = await Conversation.find({
    "participants.userId": loggedInUserId
  })
  .sort({ updatedAt: -1 });

  // Extract unique user IDs from conversations (excluding self)
  const conversationUserIds = [...new Set(
    conversations.flatMap(conv => 
      conv.participants
        .filter(p => p.userId !== loggedInUserId)
        .map(p => p.userId)
    )
  )];

  // Get users you've had conversations with
  const conversationUsers = await User.find({
    clerkId: { $in: conversationUserIds }
  });

  // Get admin users (excluding self)
  const adminUsers = await User.find({
    clerkId: { $ne: loggedInUserId },
    role: "admin",
  });

  // Combine and deduplicate users
  const allUserIds = [
    ...adminUsers.map(u => u.clerkId),
    ...conversationUserIds
  ];

  const uniqueUsers = await User.find({
    clerkId: { $in: allUserIds }
  });

  const allUsers = await getClerkUsers(uniqueUsers);

  res.status(status.OK).json(allUsers);
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
    const senderId = req.userId as string;  
    const newMessage = await sendMessageService(senderId,receiverId as string,text,req.file);
    res.status(status.CREATED).json(newMessage);
});

export const hideConversation = catchAsync(async (req, res) => {
  const { userId } = req.params;
  //@ts-ignore  
  const loggedInUserId = req.userId;
    
  // Remove the specific conversation shared by both users
  await Conversation.findOneAndDelete({
    participants: {
      $all: [
        { $elemMatch: { userId: loggedInUserId } },
        { $elemMatch: { userId: userId } }
      ],
      $size: 2
    }
  });
  
  // Also delete associated messages? Let's keep them in the Message collection 
  // but they won't be reachable since the Conversation is gone from the sidebar.
  // Actually, delete the messages too to fulfill "remove both from each other's thread"
  await Message.deleteMany({
    $or: [
      { senderId: loggedInUserId, receiverId: userId },
      { senderId: userId, receiverId: loggedInUserId }
    ]
  });
    
  res.status(status.OK).json({ message: "Conversation hidden successfully" });
});
