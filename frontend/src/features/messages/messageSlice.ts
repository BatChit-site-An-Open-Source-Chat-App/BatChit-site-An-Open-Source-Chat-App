import { createSlice } from "@reduxjs/toolkit";
import { Messages } from "../../types/Types";

export const messagesSlice = createSlice({
    name: "messages",
    initialState: {
        allMessages: [],
    },
    reducers: {
        // To concatenate previous messages coming from the infinte scrolling
        appendMessages: (state: any, action) => {
            state.allMessages = [...action.payload, ...state.allMessages];
        },
        // Initially save all the messages when the page loads
        saveMessages: (state, action) => {
            state.allMessages = action.payload;
        },
        // For appending next messages user communicate
        appendNextMessage: (state: any, action) => {
            state.allMessages = [...state.allMessages, ...action.payload]
        },
        saveEditedMessage: (state, action) => {
            const messageToUpdate = state.allMessages.find(field => (field as Messages)._id === action.payload._id);
            if (messageToUpdate) {
                (messageToUpdate as Messages).content = action.payload.content;
                (messageToUpdate as Messages).isEdited = true;
            }
        },
        removeDeletedMessage: (state, action) => {
            const message = state.allMessages.find((message: Messages) => message._id === action.payload)
            if (message) {
                (message as Messages).content = 'This message was deleted';
                (message as Messages).isDeleted = true
            }
        },

        updatedSeenMessages: (state: any, action) => {
            const { messagesIds, chatId } = action.payload;

            // Filter messages based on chatId
            const updatedMessages = state.allMessages.map((message: Messages) => {
                if (message.chatDetails._id === chatId && messagesIds?.includes(message._id)) {
                    // Update isSeen property of matchedMessages to true
                    return { ...message, isSeen: true };
                }
                return message;
            });

            // Update state with the new array of messages
            return { ...state, allMessages: updatedMessages };
        }

    },
});

export const { saveMessages, appendMessages, appendNextMessage, saveEditedMessage, removeDeletedMessage, updatedSeenMessages } = messagesSlice.actions;

export default messagesSlice.reducer;
