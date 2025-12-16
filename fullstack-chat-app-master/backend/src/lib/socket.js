import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

// Helper function to find a specific user's socket
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

const userSocketMap = {}; // stores {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // Send the list of online users to everyone
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // --- VIDEO CALL EVENTS ---

  // 1. When User A calls User B
  socket.on("callUser", (data) => {
    const receiverSocketId = getReceiverSocketId(data.userToCall);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("callUser", { 
        signal: data.signalData, 
        from: data.from, 
        name: data.name 
      });
    }
  });

  // 2. When User B answers
  socket.on("answerCall", (data) => {
    const callerSocketId = getReceiverSocketId(data.to);
    if (callerSocketId) {
        io.to(callerSocketId).emit("callAccepted", data.signal);
    }
  });

  // ... existing callUser and answerCall ...

  // 3. HANG UP EVENT
  socket.on("endCall", (data) => {
    // data.to is the ID of the person we are hanging up on
    const receiverSocketId = getReceiverSocketId(data.to);
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("callEnded");
    }
  });

  // -------------------------

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };