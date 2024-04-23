import axios from "axios"
import { chatsBackendURL } from "../utils/usersBackendURL"

const default_code = 5000
const access_Token = document.cookie.match('accessToken=')
const Authorization = {
    headers: {
        Authorization: `Bearer ${access_Token}`,
    },
}

export const getAllChatCards = async () => {
    const response = await axios.get(`${chatsBackendURL}/individual/get-chats`, Authorization)
    const { statusCode, data, success, code } = response.data

    if (statusCode === 200 && success) {
        return { success, data, code }
    }

    return { success: false, default_code }

}

export const addChat = async (fullName: string, _id: string) => {
    try {
        const details = {
            chatName: fullName,
            isGroupChat: false,
            receiver: _id
        }
        const res = await axios.post(`${chatsBackendURL}/individual/create-chat`, details, Authorization)

        const { success, statusCode, data, code } = res.data

        if (success && statusCode === 200) return { success, data, code }

        return { success: false };
    } catch (err: any) {
        const { status }: { status: number } = err.response
        console.log(err);
        return { success: false, status }
    }
}

export const getAllMessagesWithId = async (chatId: string, pageNumber: Number) => {
    const allMessages = await axios.get(`${chatsBackendURL}/individual/get-sliced-messages/${chatId}/${pageNumber}`, Authorization)
    const { statusCode, success, code, } = allMessages.data
    const { messages, totalMessages } = allMessages?.data?.data
    if (success && statusCode === 200) {
        return { success, code, messages, totalMessages }
    }
    return { success: false, }
}

export const editMessage = async (messageId: string, content: string) => {
    try {
        const response = await axios.put(`${chatsBackendURL}/editMessage/${messageId}`, { content: content }, Authorization)
        const { statusCode, success, code, data } = response.data

        const { chat, getEditedMessage } = data
        if (statusCode === 200 && success) {
            return { success, chat, getEditedMessage, code }
        }
        else {
            return { success: false }
        }
    } catch (error) {
        return { success: false }
    }
}

export const deleteMessage = async (message_Id: string) => {
    const deleteMessage = await axios.delete(`${chatsBackendURL}/deleteMessage/${message_Id}`, Authorization);

    const { statusCode, success, data } = deleteMessage?.data

    const { chat } = data

    if (statusCode === 200 && success) {
        return { success, chat }
    }
    else {
        return { success: false }
    }
}

// Group Chat in process

export const createGroupChat = async (chatName: string, users: string[]) => {
    const response = await axios.post(`${chatsBackendURL}/group/create-chat`, {
        chatName, users
    }, Authorization);

    const { statusCode, success, data, code } = response?.data;
    if (statusCode === 200 && success) {
        return { success, data, code }
    }
    else {
        return { success: false }
    }
}

export const getGroupChats = async () => {
    const response = await axios.get(`${chatsBackendURL}/group/get-chats`, Authorization)
    const { success, statusCode, data, code } = response.data
    if (success && statusCode === 200) {
        return { success, code, data }
    }
    else {
        return { success: false }
    }
}

export const getGroupChatWithId = async (groupId: string) => {
    const response = await axios.get(`${chatsBackendURL}/group/get-chat/${groupId}`, Authorization);

    const { success, statusCode, data } = response.data

    if (success && statusCode === 200) {
        return { success, data }
    } else {
        return { success: false }
    }
}