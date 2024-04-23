import { Router } from "express";
import {
   createGroupChat,
   createIndividualChat,
   deleteMessage,
   editMessage,
   getGroupChats,
   getGroupChatWithId,
   getIndividualChat,
   getIndividualMessages,
   getSlicedMessages,
   sendIndividualMessage,
} from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/individual/create-chat").post(verifyJWT, createIndividualChat);

router.route("/individual/get-chats").get(verifyJWT, getIndividualChat);

router
   .route("/individual/send-message/:chatId")
   .post(verifyJWT, sendIndividualMessage);

router
   .route("/individual/get-messages/:chatId")
   .get(verifyJWT, getIndividualMessages);

router
   .route("/individual/get-sliced-messages/:chatId/:page")
   .get(verifyJWT, getSlicedMessages);

// Common routes

router.route("/editMessage/:messageId").put(verifyJWT, editMessage);

router.route("/deleteMessage/:messageId").delete(verifyJWT, deleteMessage);

// Group chat

router.route("/group/create-chat").post(verifyJWT, createGroupChat);

router.route("/group/get-chats").get(verifyJWT, getGroupChats);

router.route("/group/get-chat/:chatId").get(verifyJWT, getGroupChatWithId);

export default router;
