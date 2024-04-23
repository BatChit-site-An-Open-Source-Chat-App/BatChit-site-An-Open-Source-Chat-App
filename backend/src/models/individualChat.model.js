import mongoose from "mongoose";

const individualChatSchema = new mongoose.Schema(
   {
      chatName: { type: String, trim: true },
      isGroupChat: {
         type: Boolean,
         default: false,
      },
      receiver: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
      },
      latestMessage: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Individualchatmessage",
      },
      admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      isSeen: {
         type: Boolean,
         default: false,
      },
   },
   { timestamps: true }
);

export const IndividualChat = mongoose.model(
   "Individualchat",
   individualChatSchema
);
