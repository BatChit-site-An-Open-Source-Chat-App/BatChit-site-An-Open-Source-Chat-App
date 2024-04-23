import { IndividualChatMessage } from "../models/individualChatMessage.model";
import { io } from "../app.js";
import { IndividualChat } from "../models/individualChat.model.js";
import { user } from "../user.store.js";
import mongoose from "mongoose";
export const socketEditIndividualMessage = async ({
   messageId,
   content,
   admin,
}) => {
   try {
      const { messageId } = req?.params;
      const { content } = req?.body;
      if ([messageId, content].some((field) => field.trim() === "")) {
         console.log(`Fields can't be empty`);
      }

      const message = await IndividualChatMessage?.findByIdAndUpdate(
         messageId,
         { $set: { content: content } },
         {
            new: true,
         }
      );

      const getEditedMessage = await IndividualChatMessage.aggregate([
         {
            $match: {
               $and: [{ _id: new mongoose.Types.ObjectId(messageId) }],
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

      const chats = await IndividualChat.aggregate([
         {
            $match: {
               _id: new mongoose.Types.ObjectId(message?.chat),
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
      const senderUserSocketId = user.find(
         (field) => field?.userId === admin
      )?.socketId;
      const receiverUserSocketId = user.find(
         (field) => field?.userId === receiver
      )?.socketId;
      console.log(`type of sockets`, senderUserSocketId, receiverUserSocketId);

      if (senderUserSocketId) {
         io.to(senderUserSocketId).emit("edit-individual-message", {
            chat: chats[0],
            getEditedMessage: getEditedMessage[0],
         });

         console.log(`sent1`);
      }
      if (receiverUserSocketId) {
         io.to(receiverUserSocketId).emit("edit-individual-message", {
            chat: chats[0],
            getEditedMessage: getEditedMessage[0],
         });
         console.log(`sent2`);
      }
   } catch (error) {
      throw new ApiError(500, error?.message || "Something went wrong");
   }
};
