import { createSlice } from "@reduxjs/toolkit";
import { IndividualChatDetails } from "../../types/Types";

export const chatCardsSlice = createSlice({
    name: "chatCards",
    initialState: {
        allChatCards: [],
        allGroupChatCards: []
    },
    reducers: {
        saveChatCards: (state, action) => {
            state.allChatCards = action.payload;
        },
        editChat: (state, action) => {
            const findChat = state.allChatCards.find((chat: IndividualChatDetails) => chat?._id === action.payload._id)
            if (findChat) {
                (findChat as IndividualChatDetails).latestMessageDetails.content = action.payload.latestMessageDetails.content;
            }
        },
        appendChat: (state: any, action) => {
            state.allChatCards = [...state.allChatCards, action.payload]
        },
        // Group Chat

        saveGroupChatCards: (state, action) => {
            state.allGroupChatCards = action.payload;
        },
        appendGroupChat: (state: any, action) => {
            state.allGroupChatCards = [...state.allGroupChatCards, action.payload];
        },
        updateSeenChat: (state: any, action) => {
            const { chatId } = action.payload
            const chatToUpdate = state.allChatCards.find((e: IndividualChatDetails) => e._id === chatId)
            chatToUpdate.isSeen = true;
        }
    },
});

export const { saveChatCards, editChat, appendChat, updateSeenChat, saveGroupChatCards, appendGroupChat } = chatCardsSlice.actions;

export default chatCardsSlice.reducer;
