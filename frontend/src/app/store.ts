import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import chatReducer from "../features/chat/chatSlice";
import messagesReducer from "../features/messages/messageSlice";
import onlineUsersReducer from "../features/online-users/onlineUsers";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chats: chatReducer,
    messages: messagesReducer,
    onlineUsers: onlineUsersReducer
  }
});
