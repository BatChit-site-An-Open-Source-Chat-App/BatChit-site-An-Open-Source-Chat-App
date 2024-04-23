import { io } from "../app.js";
import { user } from "../user.store.js";

export const typingHandler = () => async (data) => {
   const { message, isTyping, receiver } = data;
   if ([message, receiver].some((field) => field.trim() === "")) {
      console.log(`Fields can't be empty`);
      return;
   }

   const senderUserSocketId = user.find(
      (field) => field?.userId === receiver
   )?.socketId;

   if (senderUserSocketId) {
      io.to(senderUserSocketId).emit("typing_notification", message);
   }
};
