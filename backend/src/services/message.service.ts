import status from "http-status";
import { Message } from "../models/message.model.ts";
import ApiError from "../utils/ApiError.ts";
import { uploadImage } from "../utils/helpers.ts";
import { getReceiverSocketId, io } from "../lib/socket.ts";

//TODO: make sure they are in a room
export const sendMessageService = async (senderId:string,receiverId:string,text:string,file:File) => {
    let imageUrl;
    if (file) {
      let result = await uploadImage(file);
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
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId)
      io.to(receiverSocketId).emit("newMessage", newMessage);
    return newMessage;  
}