import status from "http-status";
import { Message } from "../models/message.model";
import { Conversation } from "../models/conversation.model";
import ApiError from "../utils/ApiError";
import { uploadImage } from "../utils/helpers";
import { getReceiverSocketId, io } from "../lib/socket";

//TODO: make sure they are in a room
export const sendMessageService = async (senderId:string,receiverId:string,text:string,file:Express.Multer.File) => {
    let imageUrl;
    if (file) {
      // Create a mock request object for the uploadImage function
      const mockReq = { file } as any;
      let result = await uploadImage(mockReq);
      imageUrl = (result as {secure_url: string}).secure_url;
    }
    if(!text && !imageUrl){
      throw new ApiError(status.BAD_REQUEST, "Message is empty");
    }
    const newMessage = new Message({    
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // Update or create conversation
    await Conversation.findOneAndUpdate(
      { 
        "participants.userId": { $all: [senderId, receiverId] }
      },
      {
        $set: {
          lastMessage: {
            text,
            image: imageUrl,
            senderId,
            timestamp: new Date()
          },
          updatedAt: new Date()
        }
      },
      { upsert: false, new: true }
    );

    // If no conversation was found, create a new one
    const existingConversation = await Conversation.findOne({
      "participants.userId": { $all: [senderId, receiverId] }
    });

    if (!existingConversation) {
      await Conversation.create({
        participants: [
          { userId: senderId, joinedAt: new Date() },
          { userId: receiverId, joinedAt: new Date() }
        ],
        lastMessage: {
          text,
          image: imageUrl,
          senderId,
          timestamp: new Date()
        },
        updatedAt: new Date()
      });
    }

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId)
      io.to(receiverSocketId).emit("newMessage", newMessage);
    return newMessage;  
}
