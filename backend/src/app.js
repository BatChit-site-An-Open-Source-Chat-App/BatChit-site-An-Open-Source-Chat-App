import express from "express";
import { addUser, removeUser, user } from "./user.store.js";
import cookieParser from "cookie-parser";
import http from "http"; // Import http module for Socket.IO
import { Server } from "socket.io"; // Import Server class from Socket.IO
//routes import
import userRouter from "./routes/user.routes.js";
import chatRouter from "./routes/chat.routes.js";

import { typingHandler } from "./socketFunctions/typingHandler.js";
import { sendIndividualMessageHandler } from "./socketFunctions/sendIndividualMessageHandler.js";
import { sendIndividualChatNotificationsHandler } from "./socketFunctions/sendIndividualChatNotificationsHandler.js";
import { seenUpdation } from "./socketFunctions/seenUpdation.js";
import { User } from "./models/user.model.js";
import { endVideoCall, videoCall } from "./socketFunctions/videoCall.js";

// Making backend app

const app = express();

const server = http.createServer(app); // Create HTTP server using Express app
const io = new Server(server, {
   cors: {
      origin: process.env.CORS_ORIGIN,
      credentials: true,
   },
}); // Create Socket.IO server instance

// Modifying app

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes declaration
app.use("/api/v1/users", userRouter);

app.use("/api/v1/chat", chatRouter);

const addUserToBeOnline = async (userId) => {
   if (userId) {
      await User.findByIdAndUpdate(
         userId,
         {
            $set: {
               lastSeen: Date.now(),
               isOnline: true,
            },
         },
         { new: true }
      );

      // io.emit("user_is_online", { userId: userId });
   }
};

const removeUserToBeOnline = async (socketId) => {
   if (socketId) {
      const findUser = user.find((e) => e.socketId === socketId);
      if (findUser) {
         await User.findByIdAndUpdate(
            findUser.userId,
            {
               $set: {
                  lastSeen: Date.now(),
                  isOnline: false,
               },
            },
            { new: true }
         );
      }
   }
};

// Socket.IO event handling
io.on("connection", async (socket) => {
   const socketId = socket.id;

   socket.on("add-user", (user_Id) => {
      addUser(socketId, user_Id);
      addUserToBeOnline(user_Id);
      if (socketId) {
         io.to(socketId).emit("add-an-online-user", user);
      }
   });

   socket.on("get-online-users", (userId) => {
      console.log(userId);
      const socketId = user.find((e) => e.userId === userId)?.socketId;
      if (socketId) {
         io.to(socketId).emit("update-online-users", user);
      }
   });

   socket.on("send-individual-message", sendIndividualMessageHandler);

   socket.on("typing", typingHandler());

   // update seen messages

   socket.on("update-seen-message", seenUpdation);

   // send notifications to all user when a chat is created

   socket.on("making-individual-chat", sendIndividualChatNotificationsHandler);

   // Store Online Users

   // Individual Video Chat

   socket.on("individual-video-call", videoCall);

   socket.on("individual-on-end-video-call", endVideoCall);

   socket.on("individual-on-answer-video-call", videoCall);

   socket.on("disconnect", () => {
      console.log("User disconnected");
      removeUserToBeOnline(socketId);
      removeUser(socketId);
   });
});

export { app, server, io };
