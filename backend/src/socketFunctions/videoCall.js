import { io } from "../app.js";
import { IndividualChat } from "../models/individualChat.model.js";
import { IndividualChatMessage } from "../models/individualChatMessage.model.js";
import { User } from "../models/user.model.js";
import { user } from "../user.store.js";
import mongoose from "mongoose";

export const videoCall = async ({ sender, receiver, chatId }) => {
   if ([sender, receiver, chatId].some((field) => field?.trim() === "")) {
      console.log(`Field can't be empty.`);
      return;
   }
   const senderUser = await User.findById(sender);
   const receiverUser = await User.findById(receiver);

   if (!senderUser) {
      console.log(`sender doesn't exists`);
      return;
   }
   if (!receiverUser) {
      console.log(`receiver doesn't exists`);
      return;
   }
   const receiverUserSocketId = user.find(
      (field) => field?.userId === receiver
   )?.socketId;

   if (receiverUserSocketId) {
      console.log(`sent`);
      io.to(receiverUserSocketId).emit(
         "notify-individual-receiver-for-video-call",
         {
            senderUserName: senderUser.fullName,
            senderUserEmail: senderUser.email,
         }
      );
   }
};

export const endVideoCall = async ({ sender, receiver }) => {
     if([sender,receiver].some(e=>e?.trim()==="")){
        console.log(`Sender or receiver is undefined`)
        return
    }
};
