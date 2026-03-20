import http from "http";
import { Server } from "socket.io";
import express from "express";
import { Message } from "../models/message.model.ts";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

io.on("connection", (socket) => {
  socket.on("joinRoom", (roomId) => socket.join(roomId));
  socket.on("sendMessage", async (data) => {
    const message = await Message.create(data);
    io.to(data.receiverId).emit("newMessage", message);
  });
});

export { io, app, server };
