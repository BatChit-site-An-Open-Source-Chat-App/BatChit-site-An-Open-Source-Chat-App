import { io } from "../app.js";
import { IndividualChat } from "../models/individualChat.model.js";
import { IndividualChatMessage } from "../models/individualChatMessage.model.js";
import { user } from "../user.store.js";
import mongoose from "mongoose";

export const seenUpdation = async (data) => {
   try {
      const { chatId, userId } = data;
      if (!chatId || !userId) {
         console.log(`ChatID or UserId is empty`);
         return;
      }

      const loggedInUser = userId?.toString();

      const chat = await IndividualChat.findById(chatId);

      if (!chat) {
         console.log(`We couldn't find the chat`);
         return;
      }

      const latestMessages = await IndividualChatMessage.aggregate([
         { $match: { chat: new mongoose.Types.ObjectId(chatId) } },
         { $sort: { createdAt: -1 } },
         { $match: { isSeen: false } },
      ]);

      if (!latestMessages || latestMessages.length === 0) {
         console.log(`No messages found for chat ID: ${chatId}`);
         return;
      }

      // To find latestMessages

      latestMessages.forEach(async (messageData) => {
         try {
            // To find the receiver;
            const receiver =
               messageData.sender.toString() === chat.admin.toString()
                  ? chat.receiver.toString()
                  : chat.admin.toString();
            if (receiver === loggedInUser) {
               // Update existing document by its _id
               await IndividualChatMessage.updateOne(
                  { _id: messageData._id },
                  { $set: { isSeen: true } }
               );
               await IndividualChat.findByIdAndUpdate(chatId, {
                  $set: { isSeen: true },
               });
               console.log("Message updated successfully:", messageData._id);
            }
         } catch (error) {
            console.error("Error updating message:", error);
         }
      });
      latestMessages.forEach(async (messageData) => {
         const sender =
            messageData.sender.toString() === chat.admin.toString()
               ? chat.admin.toString()
               : chat.receiver.toString();
         const receiver =
            messageData.sender.toString() === chat.admin.toString()
               ? chat.receiver.toString()
               : chat.admin.toString();
         const senderUserSocketId = user.find(
            (field) => field?.userId === sender
         )?.socketId;

         if (senderUserSocketId && receiver === loggedInUser) {
            io.to(senderUserSocketId).emit("update-seen-messages", {
               messagesIds: latestMessages.map((e) => e._id),
               chatId: chatId,
            });

            console.log(`sent1`);
         }
      });
   } catch (error) {
      console.log(error || "Messages seen error");
   }
};
