import { io } from "../app.js";
import { IndividualChat } from "../models/individualChat.model.js";
import { user } from "../user.store.js";
import mongoose from "mongoose";
export const sendIndividualChatNotificationsHandler = async (data) => {
   try {
      const { receiver, admin, chatName } = data;
      if (!admin) {
         console.log(`Admin Id is undefined`);
         return;
      }
      if ([chatName, receiver].some((field) => field?.trim() === "")) {
         console.log(`Chatname or receiver is undefined`);
         return;
      }

      const isChatExistsForBothUsers = await IndividualChat.findOne({
         $or: [
            {
               $and: [
                  { admin: new mongoose.Types.ObjectId(admin) },
                  { receiver: new mongoose.Types.ObjectId(receiver) },
               ],
            },
            {
               $and: [
                  { admin: new mongoose.Types.ObjectId(receiver) },
                  { receiver: new mongoose.Types.ObjectId(admin) },
               ],
            },
         ],
      });

      if (isChatExistsForBothUsers) {
         console.log(`Chat already exists`);
         return;
      }

      const chat = await IndividualChat.create({
         chatName,
         receiver,
         admin,
         latestMessage: new mongoose.Types.ObjectId(),
      });

      const specific_chat = await IndividualChat.aggregate([
         {
            $match: {
               _id: new mongoose.Types.ObjectId(chat?._id),
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
      ]);

      const senderUserSocketId = user.find(
         (field) => field?.userId === admin
      )?.socketId;
      const receiverUserSocketId = user.find(
         (field) => field?.userId === receiver
      )?.socketId;
      console.log(`type of sockets`, senderUserSocketId, receiverUserSocketId);

      if (senderUserSocketId) {
         io.to(senderUserSocketId).emit("update-chat-for-individual", {
            specific_chat: specific_chat[0],
         });

         console.log(`sent1`);
      }
      if (receiverUserSocketId) {
         io.to(receiverUserSocketId).emit("update-chat-for-individual", {
            specific_chat: specific_chat[0],
         });
         console.log(`sent2`);
      }
   } catch (error) {
      console.log(error || `Something went wrong`);
      return;
   }
};
