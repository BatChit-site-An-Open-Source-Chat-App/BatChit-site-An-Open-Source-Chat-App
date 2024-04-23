import { io } from "../app.js";
import { IndividualChat } from "../models/individualChat.model.js";
import { IndividualChatMessage } from "../models/individualChatMessage.model.js";
import { user } from "../user.store.js";
import mongoose from "mongoose";
export const sendIndividualMessageHandler = async (data) => {
   const { senderId, chatId, message, media, mediaType } = data;

   if (!media) {
      if (!message) {
         console.log(`File or message must be provided`);
      }
   }

   if ([senderId, chatId].some((field) => field.trim() === "")) {
      console.log(`Fields can't be empty`);
      return;
   }

   if (media) {
      if (!mediaType) {
         console.log(`Media is provided though media type is not provided`);
         return;
      }
   }

   const chat = await IndividualChat.findById(chatId);

   if (!chat) {
      console.log(`We couldn't find the chat`);
      return;
   }

   const createdMessage = await IndividualChatMessage.create({
      chat: chatId,
      content: message,
      readBy: chat?.receiver,
      sender: senderId,
      media: media,
      mediaType: mediaType,
   });

   const findMsg = await IndividualChatMessage.findById(createdMessage);

   if (!findMsg) {
      console.log(`Something went wrong while sending the message`);
   }

   await IndividualChat?.findByIdAndUpdate(
      chatId,
      {
         $set: {
            latestMessage: findMsg?._id,
         },
      },
      {
         new: true,
      }
   );

   const senderUserSocketId = user.find(
      (field) => field?.userId === chat?.admin?.toString()
   )?.socketId;
   const receiverUserSocketId = user.find(
      (field) => field?.userId === chat?.receiver?.toString()
   )?.socketId;

   const messages = await IndividualChatMessage.aggregate([
      {
         $match: {
            $and: [
               { _id: new mongoose.Types.ObjectId(createdMessage?._id) },
               { chat: new mongoose.Types.ObjectId(chatId) },
            ],
         },
      },
      {
         $lookup: {
            from: "users",
            foreignField: "_id",
            localField: "sender",
            as: "senderDetails",
            pipeline: [
               {
                  $project: {
                     _id: 1,
                     fullName: 1,
                     background: 1,
                     bio: 1,
                  },
               },
            ],
         },
      },
      {
         $addFields: {
            senderDetails: {
               $arrayElemAt: ["$senderDetails", 0],
            },
         },
      },
      {
         $lookup: {
            from: "individualchats",
            localField: "chat",
            foreignField: "_id",
            as: "chatDetails",
            pipeline: [
               {
                  $project: {
                     _id: 1,
                     chatName: 1,
                  },
               },
            ],
         },
      },
      {
         $addFields: {
            chatDetails: {
               $arrayElemAt: ["$chatDetails", 0],
            },
         },
      },
      {
         $unset: ["sender", "chat"],
      },
   ]);

   const senderChats = await IndividualChat.aggregate([
      {
         $match: {
            $or: [
               { receiver: new mongoose.Types.ObjectId(senderId) },
               { admin: new mongoose.Types.ObjectId(senderId) },
            ],
         },
      },
      {
         $lookup: {
            from: "users",
            localField: "admin",
            foreignField: "_id",
            as: "adminUserDetails",
            pipeline: [
               {
                  $project: {
                     _id: 1,
                     fullName: 1,
                     background: 1,
                     email: 1,
                     bio: 1,
                  },
               },
            ],
         },
      },
      {
         $addFields: {
            adminUserDetails: {
               $arrayElemAt: ["$adminUserDetails", 0],
            },
         },
      },
      {
         $lookup: {
            from: "users",
            localField: "receiver",
            foreignField: "_id",
            as: "receiverUserDetails",
            pipeline: [
               {
                  $project: {
                     _id: 1,
                     fullName: 1,
                     background: 1,
                     email: 1,
                     bio: 1,
                  },
               },
            ],
         },
      },
      {
         $addFields: {
            receiverUserDetails: {
               $arrayElemAt: ["$receiverUserDetails", 0],
            },
         },
      },
      {
         $lookup: {
            from: "individualchatmessages",
            foreignField: "_id",
            localField: "latestMessage",
            as: "latestMessageDetails",
            pipeline: [
               {
                  $project: {
                     _id: 1,
                     sender: 1,
                     content: 1,
                     media: 1,
                     mediaType: 1,
                  },
               },
            ],
         },
      },
      {
         $addFields: {
            latestMessageDetails: {
               $arrayElemAt: ["$latestMessageDetails", 0],
            },
         },
      },
      {
         $lookup: {
            from: "users",
            localField: "latestMessageDetails.sender",
            foreignField: "_id",
            as: "latestMessageDetails.senderDetails",
            pipeline: [
               {
                  $project: {
                     _id: 1,
                     fullName: 1,
                     background: 1,
                     email: 1,
                     bio: 1,
                  },
               },
            ],
         },
      },
      {
         $addFields: {
            "latestMessageDetails.senderDetails": {
               $arrayElemAt: ["$latestMessageDetails.senderDetails", 0],
            },
         },
      },
      {
         $unset: ["admin", "receiver", "latestMessage"],
      },
   ]);
   const receiverChats = await IndividualChat.aggregate([
      {
         $match: {
            $or: [
               { receiver: new mongoose.Types.ObjectId(chat?.receiver) },
               { admin: new mongoose.Types.ObjectId(chat?.receiver) },
            ],
         },
      },
      {
         $lookup: {
            from: "users",
            localField: "admin",
            foreignField: "_id",
            as: "adminUserDetails",
            pipeline: [
               {
                  $project: {
                     _id: 1,
                     fullName: 1,
                     background: 1,
                     email: 1,
                     bio: 1,
                  },
               },
            ],
         },
      },
      {
         $addFields: {
            adminUserDetails: {
               $arrayElemAt: ["$adminUserDetails", 0],
            },
         },
      },
      {
         $lookup: {
            from: "users",
            localField: "receiver",
            foreignField: "_id",
            as: "receiverUserDetails",
            pipeline: [
               {
                  $project: {
                     _id: 1,
                     fullName: 1,
                     background: 1,
                     email: 1,
                     bio: 1,
                  },
               },
            ],
         },
      },
      {
         $addFields: {
            receiverUserDetails: {
               $arrayElemAt: ["$receiverUserDetails", 0],
            },
         },
      },
      {
         $lookup: {
            from: "individualchatmessages",
            foreignField: "_id",
            localField: "latestMessage",
            as: "latestMessageDetails",
            pipeline: [
               {
                  $project: {
                     _id: 1,
                     sender: 1,
                     content: 1,
                     media: 1,
                     mediaType: 1,
                  },
               },
            ],
         },
      },
      {
         $addFields: {
            latestMessageDetails: {
               $arrayElemAt: ["$latestMessageDetails", 0],
            },
         },
      },
      {
         $lookup: {
            from: "users",
            localField: "latestMessageDetails.sender",
            foreignField: "_id",
            as: "latestMessageDetails.senderDetails",
            pipeline: [
               {
                  $project: {
                     _id: 1,
                     fullName: 1,
                     background: 1,
                     email: 1,
                     bio: 1,
                  },
               },
            ],
         },
      },
      {
         $addFields: {
            "latestMessageDetails.senderDetails": {
               $arrayElemAt: ["$latestMessageDetails.senderDetails", 0],
            },
         },
      },
      {
         $unset: ["admin", "receiver", "latestMessage"],
      },
   ]);
   if (senderUserSocketId) {
      io.to(senderUserSocketId).emit("update-individual-message", {
         messages,
         senderChats,
      });
   }
   if (receiverUserSocketId) {
      io.to(receiverUserSocketId).emit("update-individual-message", {
         messages,
         receiverChats,
      });
   }
};
