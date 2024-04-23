import mongoose from "mongoose";

const individualChatMessage = new mongoose.Schema(
   {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      content: { type: String, trim: true },
      chat: { type: mongoose.Schema.Types.ObjectId, ref: "Individualchat" },
      readBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      media: {
         type: String,
         default: "",
      },
      mediaType: {
         type: String,
      },
      isSeen: {
         type: Boolean,
         default: false,
      },
      isEdited: {
         type: Boolean,
         default: false,
      },
      isDeleted: {
         type: Boolean,
         default: false,
      },
   },
   { timestamps: true }
);

// image, audio, and video

export const IndividualChatMessage = mongoose.model(
   "Individualchatmessage",
   individualChatMessage
);
