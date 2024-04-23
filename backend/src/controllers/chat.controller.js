import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { IndividualChat } from "../models/individualChat.model.js";
import mongoose from "mongoose";
import { IndividualChatMessage } from "../models/individualChatMessage.model.js";
import { GroupChat } from "../models/groupChat.model.js";
import { io } from "../app.js";
import { user } from "../user.store.js";

const createIndividualChat = asyncHandler(async (req, res) => {
   try {
      const { receiver } = req?.body;

      const admin = req?.user?._id;

      const chatName = req?.user?.fullName;
      if (!admin) {
         throw new ApiError(400, "User Id is undefined");
      }
      if ([chatName, receiver].some((field) => field?.trim() === "")) {
         throw new ApiError(404, "Fields are necessary");
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
         return res
            .status(200)
            .json(new ApiResponse(200, [], "Chats created successfully", 7005));
      }

      await IndividualChat.create({
         chatName,
         receiver,
         admin,
         latestMessage: new mongoose.Types.ObjectId(),
      });

      const chats = await IndividualChat.aggregate([
         {
            $match: {
               $or: [
                  {
                     admin: new mongoose.Types.ObjectId(admin),
                  },
                  {
                     receiver: new mongoose.Types.ObjectId(admin),
                  },
               ],
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

      return res
         .status(200)
         .json(new ApiResponse(200, chats, "Chats created successfully", 7003));
   } catch (error) {
      throw new ApiError(500, error.message || "Something went wrong");
   }
});

const getIndividualChat = asyncHandler(async (req, res) => {
   const admin = req?.user?._id;

   if (!admin) {
      throw new ApiError(404, "Unauthorized request");
   }

   const chats = await IndividualChat.aggregate([
      {
         $match: {
            $or: [
               { receiver: new mongoose.Types.ObjectId(admin) },
               { admin: new mongoose.Types.ObjectId(admin) },
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
                     isOnline: 1,
                     lastSeen: 1,
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
                     isOnline: 1,
                     lastSeen: 1,
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
                     isDeleted: 1,
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

   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            chats,
            "Individuals chats retrieved success",
            7000
         )
      );
});

const sendIndividualMessage = asyncHandler(async (req, res) => {
   const { content } = req?.body;

   if (!content) {
      throw new ApiError(401, "Please type a message");
   }

   const admin = req?.user?._id;

   if (!admin) {
      throw new ApiError(404, "Unauthorized request");
   }

   const { chatId } = req?.params;

   if (!chatId) {
      throw new ApiError(405, "ChatId is empty");
   }

   const isChatExist = await IndividualChat.findById(chatId);

   if (!isChatExist) {
      throw new ApiError(400, "Chat doesn't exists");
   }

   const createMsg = await IndividualChatMessage.create({
      chat: chatId,
      content: content,
      sender: admin,
      readBy: isChatExist?.receiver,
   });

   const createdMessage = await IndividualChatMessage.findById(createMsg?._id);

   if (!createdMessage) {
      throw new ApiError(406, "An erorr occured while sending the message");
   }

   isChatExist.latestMessage = createdMessage?._id;

   await isChatExist.save();

   const messages = await IndividualChatMessage.aggregate([
      {
         $match: {
            chat: new mongoose.Types.ObjectId(chatId),
         },
      },
      {
         $lookup: {
            from: "users",
            localField: "sender",
            foreignField: "_id",
            as: "senderUserDetails",
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
            senderUserDetails: {
               $arrayElemAt: ["$senderUserDetails", 0],
            },
         },
      },
      {
         $unset: ["sender", "chat", "readBy"],
      },
   ]);

   return res
      .status(200)
      .json(new ApiResponse(200, messages, "Message sent", 7008));
});

const getIndividualMessages = asyncHandler(async (req, res) => {
   const { chatId } = req?.params;

   if (!chatId) {
      throw new ApiError(400, "Please provide a chatID");
   }

   const messages = await IndividualChatMessage.aggregate([
      {
         $match: {
            chat: new mongoose.Types.ObjectId(chatId),
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

   return res
      .status(200)
      .json(new ApiResponse(200, messages, "Messages retrieved success", 8000));
});

const getSlicedMessages = asyncHandler(async (req, res) => {
   const { page = 1, chatId } = req.params;

   if (!chatId) {
      throw new ApiError(404, "Chat id is empty");
   }

   const resultPerPage = 20;

   const skip = (page - 1) * resultPerPage;

   const totalMessages = await IndividualChatMessage?.find({ chat: chatId });

   const messages = await IndividualChatMessage.aggregate([
      {
         $match: { chat: new mongoose.Types.ObjectId(chatId) },
      },
      {
         $sort: { createdAt: -1 },
      },
      {
         $skip: skip,
      },
      {
         $limit: resultPerPage,
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

   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            { messages, totalMessages: totalMessages?.length },
            "Messages retrieved",
            80001
         )
      );
});

const editMessage = asyncHandler(async (req, res) => {
   try {
      const { messageId } = req?.params;
      const { content } = req?.body;
      if ([messageId, content].some((field) => field.trim() === "")) {
         throw new ApiError(404, "Fields can't be empty");
      }

      const message = await IndividualChatMessage?.findByIdAndUpdate(
         messageId,
         { $set: { content: content, isEdited: true } },
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

      const chat = await IndividualChat.findById(message.chat);

      if (!chat) {
         throw new ApiError(405, `We couldn't find the chat`);
      }
      console.log(chat.admin, chat.receiver);
      const senderUserSocketId = user.find(
         (field) => field?.userId === chat.admin.toString()
      )?.socketId;
      const receiverUserSocketId = user.find(
         (field) => field?.userId === chat.receiver.toString()
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

      return res
         .status(200)
         .json(new ApiResponse(200, [], "Message edited success", 10001));
   } catch (error) {
      throw new ApiError(500, error?.message || "Something went wrong");
   }
});

const deleteMessage = asyncHandler(async (req, res) => {
   try {
      const { messageId } = req?.params;
      if (!messageId) {
         throw new ApiError(
            404,
            "How are you suppose to delete a message without a message ID?"
         );
      }

      const message = await IndividualChatMessage.findById(messageId);

      if (!message) {
         throw new ApiError(404, "Message doesn't exists");
      }

      await IndividualChatMessage.findByIdAndUpdate(
         messageId,
         {
            $set: {
               media: "",
               mediaType: "",
               content: "This message was deleted",
               isDeleted: true,
            },
         },
         { $new: true }
      );

      // To update the latest message details

      const chat = await IndividualChat.findById(message?.chat);

      // console.log(chat);

      if (!chat) {
         throw new ApiError(400, "chat doesn't exists");
      }

      const senderUserSocketId = user.find(
         (field) => field?.userId === chat.admin.toString()
      )?.socketId;
      const receiverUserSocketId = user.find(
         (field) => field?.userId === chat.receiver.toString()
      )?.socketId;
      console.log(`type of sockets`, senderUserSocketId, receiverUserSocketId);

      if (senderUserSocketId) {
         io.to(senderUserSocketId).emit("delete-individual-message", {
            messageId: messageId,
         });

         console.log(`sent1`);
      }
      if (receiverUserSocketId) {
         io.to(receiverUserSocketId).emit("delete-individual-message", {
            messageId: messageId,
         });
         console.log(`sent2`);
      }

      // return res
      //    .status(200)
      //    .json(
      //       new ApiResponse(
      //          200,
      //          { chat: chats[0] },
      //          "Message deleted successfully",
      //          10002
      //       )
      //    );
   } catch (error) {
      throw new ApiError(500, error?.message || "Something went wrong");
   }
});

// Group chat in process

const createGroupChat = asyncHandler(async (req, res) => {
   try {
      const { chatName, users } = req.body;

      const adminId = req?.user?._id;

      if (!chatName) throw new ApiError(404, "Chatname is empty");

      if (!adminId) throw new ApiError(400, "Unauthorized request");

      if (Array.isArray(users).length > 0)
         throw new ApiError(405, "There must be a receiver");

      const created_chat = await GroupChat.create({
         admin: adminId,
         chatName: chatName,
         latestMessage: new mongoose.Types.ObjectId(),
         users: [...users, adminId],
      });

      // To check if it is created successfully

      const check_chat = await GroupChat.findById(created_chat?._id);

      if (!check_chat)
         throw new ApiError(
            409,
            "Something went wrong while creating the group chat"
         );
      const chat = await GroupChat.aggregate([
         {
            $match: {
               _id: new mongoose.Types.ObjectId(created_chat?._id),
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
               from: "users",
               localField: "users",
               foreignField: "_id",
               as: "receiverUsersDetails",
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
            $lookup: {
               from: "groupchatmessages",
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
            $unset: ["admin", "users", "latestMessage"],
         },
      ]);

      return res
         .status(200)
         .json(new ApiResponse(200, chat[0], "Group created", 7006));
   } catch (error) {
      throw new ApiError(500, "Something went wrong");
   }
});

const getGroupChats = asyncHandler(async (req, res) => {
   const adminId = req?.user?._id;

   if (!adminId) throw new ApiError(404, "Unatuhorized request");

   const chats = await GroupChat.aggregate([
      {
         $match: {
            $or: [
               {
                  admin: new mongoose.Types.ObjectId(adminId),
               },
               {
                  users: new mongoose.Types.ObjectId(adminId),
               },
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
            localField: "users",
            foreignField: "_id",
            as: "receiverUsersDetails",
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
         $lookup: {
            from: "groupchatmessages",
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
         $unset: ["admin", "users", "latestMessage"],
      },
   ]);

   return res
      .status(200)
      .json(new ApiResponse(200, chats, "Group chats fetched success", 7007));
});

const getGroupChatWithId = asyncHandler(async (req, res) => {
   const { chatId } = req?.params;

   if (!chatId) {
      throw new ApiError(404, "How can you suppose to get chat without an Id?");
   }

   const chat = await GroupChat.aggregate([
      {
         $match: {
            _id: new mongoose.Types.ObjectId(chatId),
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
                     bio: 1,
                     email: 1,
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
            localField: "users",
            foreignField: "_id",
            as: "receiverUsersDetails",
            pipeline: [
               {
                  $project: {
                     _id: 1,
                     fullName: 1,
                     background: 1,
                     bio: 1,
                     email: 1,
                  },
               },
            ],
         },
      },

      {
         $lookup: {
            from: "groupchatmessages",
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
         $unset: ["admin", "users", "latestMessage"],
      },
   ]);

   return res
      .status(200)
      .json(new ApiResponse(200, chat[0], "chat fetched success", 8001));
});

export {
   createIndividualChat,
   getIndividualChat,
   sendIndividualMessage,
   getIndividualMessages,
   getSlicedMessages,
   editMessage,
   deleteMessage,
   // Group chat
   createGroupChat,
   getGroupChats,
   getGroupChatWithId,
};
