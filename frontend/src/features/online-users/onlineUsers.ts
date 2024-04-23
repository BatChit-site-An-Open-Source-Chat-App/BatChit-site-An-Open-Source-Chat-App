import { createSlice } from "@reduxjs/toolkit";
import { OnlineUserType } from "../../types/Types";

export const onlineUsersSlice = createSlice({
    name: "messages",
    initialState: {
        onlineUsers: [],
    },
    reducers: {
        storeOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },

        appendNextOnlineUser: (state: any, action) => {
            state.onlineUsers = [...state.onlineUsers, ...action.payload]
        },

        removeAnOnlineUser: (state, action) => {
            state.onlineUsers = state.onlineUsers.filter((field: OnlineUserType) => field._id !== action.payload._id)
        }


    },
});

export const { appendNextOnlineUser, removeAnOnlineUser, storeOnlineUsers } = onlineUsersSlice.actions;

export default onlineUsersSlice.reducer;
