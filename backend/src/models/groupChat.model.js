import mongoose from "mongoose";

const groupChatSchema = new mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: {
      type: Boolean,
      default: true,
    },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Groupchatmessage",
      // default:mongoose.Types.ObjectId()
    },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const GroupChat = mongoose.model("Groupchat", groupChatSchema);
