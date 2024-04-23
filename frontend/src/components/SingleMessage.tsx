import React, {
  useRef,
  useEffect,
  useContext,
  useState,
  ChangeEvent,
  useCallback,
} from "react";
import "../styles/singlemessage.css";
import { IoCall, IoVideocam } from "react-icons/io5";

import {
  MdCallEnd,
  MdModeEditOutline,
  MdOutlineAttachFile,
} from "react-icons/md";
import MyMessagePart from "../sub-components/MyMessagePart";
import OtherPersonMessagePart from "../sub-components/OtherPersonMessagePart";
import { ToggleProfile } from "../context/ToggleProfile";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdSend } from "react-icons/io";
import Spinner from "./Spinner";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../types/Rootstate";
import { formatDateForInitialChatCreationAlert } from "../utils/messageDateFormat";
import { Socket } from "socket.io-client";
import {
  deleteMessage,
  editMessage,
  getAllMessagesWithId,
} from "../apis/chatActions";
import {
  appendMessages,
  removeDeletedMessage,
  saveMessages,
} from "../features/messages/messageSlice";
import { sendFileToServer } from "../utils/sendFileToServer";
import { useDropzone } from "react-dropzone";
import InfiniteScroll from "react-infinite-scroll-component";
import SmallSpinner from "../sub-components/SmallSpinner";
import { editChat } from "../features/chat/chatSlice";
import { CgMenuGridR } from "react-icons/cg";
import { GoDotFill } from "react-icons/go";
import { customTimeFormat } from "../utils/timeFormatter";
import { VideoCallContext } from "../context/videoCallContext";
import Navbar from "./Navbar";
export default function SingleMessage({ socket }: { socket: Socket | null }) {
  const [file, setFile] = useState<File | null>(null);
  const [typingAlertText, setTypingAlertText] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [messageValue, setMessageValue] = useState("");
  const [showTyping, setShowTyping] = useState(false);
  const [messageIdToEdit, setMessageIdToEdit] = useState("");
  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const [loader, setLoader] = useState(true);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const showProfileOptions = useContext(ToggleProfile);
  if (!showProfileOptions) {
    return null;
  }
  const [pageNumber, setPageNumber] = useState(1);
  const [renderedMessagesCount, setRenderedMessagesCount] = useState(
    pageNumber * 20
  );
  const dispatch = useDispatch();
  const { setShowProfile, showProfile } = showProfileOptions;
  const [totalMessages, setTotalMessages] = useState(0);
  const { chatId } = useParams();
  const loggedInUser = useSelector(
    (state: RootState) => state.auth.loggedInUser
  );
  const chats = useSelector((state: RootState) => state.chats.allChatCards);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const values = useContext(VideoCallContext);

  if (!values) {
    return null;
  }
  const { isVideoCall, setIsVideoCall } = values;

  useEffect(() => {
    const getWebcam = async () => {
      if (isVideoCall) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          const video = videoRef.current;
          if (video) {
            video.srcObject = stream;
            video.onloadedmetadata = () => {
              video.play();
            };
          }
          streamRef.current = stream;
        } catch (error) {
          console.error("Error accessing the webcam: ", error);
        }
      } else {
        const video = videoRef.current;
        if (video) {
          video.srcObject = null;
        }
        // Stop tracks and revoke access
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      }
    };

    getWebcam();
  }, [isVideoCall]);

  const messages = useSelector(
    (state: RootState) => state.messages.allMessages
  );

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messageContainerRef.current) {
        messageContainerRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
      }
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatId]);

  useEffect(() => {
    const getAllMessages = async () => {
      setLoader(true);
      if (chatId) {
        const allMessages = await getAllMessagesWithId(chatId, pageNumber);
        const { success, messages, totalMessages } = allMessages;
        const reversedMessages = messages?.reverse();
        if (success) {
          dispatch(saveMessages(reversedMessages));
          setTotalMessages(totalMessages);
        }
      }
      setLoader(false);
    };
    getAllMessages();
  }, [chatId]);

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleTypingFunc = (message: string) => {
      setTypingAlertText(message);
      setShowTyping(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setShowTyping(false);
      }, 3000);
    };

    socket?.on("typing_notification", handleTypingFunc);

    return () => {
      socket?.off("typing_notification", handleTypingFunc);
      clearTimeout(timeoutId);
    };
  }, [socket]);

  useEffect(() => {
    if (showTyping) {
      // Scroll to the bottom when Niraj is typing
      messageContainerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [showTyping]);

  useEffect(() => {
    socket?.emit("update-seen-message", { chatId, userId: loggedInUser?._id });
  }, [socket, messages.length]);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (file) {
      const saveToServer = await sendFileToServer(file, (progress) => {
        setUploadProgress(progress);
      });
      const { success, url, mediaType } = saveToServer;
      if (success) {
        const data = {
          senderId: loggedInUser?._id,
          chatId: chatId,
          message: messageValue,
          media: url,
          mediaType: mediaType,
        };

        socket?.emit("send-individual-message", data);
      } else {
        alert("File uploading error");
      }

      setUploadProgress(0);
    } else {
      if (!messageValue) {
        return;
      }
      if (socket) {
        const data = {
          senderId: loggedInUser?._id,
          chatId: chatId,
          message: messageValue,
        };

        socket?.emit("send-individual-message", data);
      }
    }
    setFile(null);
    setMessageValue("");
    scrollToBottom();
  };

  const handleMessageInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const data = {
      message: `${loggedInUser?.fullName?.split(" ")[0]} is typing`,
      isTyping: true,
      receiver:
        loggedInUser._id ===
        chats.find((field) => field._id === chatId)?.adminUserDetails._id
          ? chats.find((field) => field._id === chatId)?.receiverUserDetails._id
          : chats.find((field) => field._id === chatId)?.adminUserDetails._id,
    };
    socket?.emit("typing", data);
    setMessageValue(e.target.value);
  };

  // Function to initiate audio call
  const handleAudioCall = async () => {};

  const handleVideoCall = async () => {
    const sender =
      loggedInUser._id ===
      chats.find((field) => field._id === chatId)?.adminUserDetails._id
        ? chats.find((field) => field._id === chatId)?.adminUserDetails._id
        : chats.find((field) => field._id === chatId)?.receiverUserDetails._id;

    const receiver =
      loggedInUser._id ===
      chats.find((field) => field._id === chatId)?.adminUserDetails._id
        ? chats.find((field) => field._id === chatId)?.receiverUserDetails._id
        : chats.find((field) => field._id === chatId)?.adminUserDetails._id;

    setIsVideoCall(true);
    socket?.emit("individual-video-call", { sender, receiver, chatId });
  };

  const handleEndCall = () => {
    setIsVideoCall(false);
  };

  const fetchMoreData = async () => {
    if (chatId) {
      const nextPageNumber = pageNumber + 1;
      setPageNumber(nextPageNumber);
      const remainingMessages = await getAllMessagesWithId(
        chatId,
        nextPageNumber
      );
      const { success, messages, totalMessages } = remainingMessages;
      const reversedMessages = messages?.reverse();
      if (success) {
        dispatch(appendMessages(reversedMessages));
        setTotalMessages(totalMessages);
        const renderedCount = renderedMessagesCount + messages?.length;
        setRenderedMessagesCount(renderedCount);
      }
    }
  };

  const handleEditMessage = (messageId: string) => {
    const findMessage = messages?.find((field) => field._id === messageId);
    if (findMessage && findMessage?.content) {
      setMessageValue(findMessage?.content);
      setMessageIdToEdit(findMessage?._id);
    }
  };

  const editMessageAction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await editMessage(messageIdToEdit, messageValue);
    const { success } = response;
    if (success) {
      // dispatch(saveEditedMessage(getEditedMessage));
      // dispatch(editChat(chat));
    }
    setMessageIdToEdit("");
    setMessageValue("");
  };

  const handleMessageDeletion = async (messageId: string) => {
    const findMessage = messages?.find((field) => field._id === messageId);
    if (findMessage && messageId) {
      const response = await deleteMessage(messageId);
      const { success, chat } = response;
      if (success) {
        dispatch(removeDeletedMessage(messageId));
        dispatch(editChat(chat));
      }
    }
  };

  const chat = chats?.find((field) => field._id === chatId);
  return loader ? (
    <Spinner />
  ) : (
    <>
      <div className="single-message-container">
        <div className="single-message-container-header">
          <div className="back-sign">
            <BiArrowBack onClick={() => goBack()} />
            <div
              className="account-details"
              onClick={() => setShowProfile(!showProfile)}
            >
              <p>
                {chat?.adminUserDetails?._id === loggedInUser?._id
                  ? chat?.receiverUserDetails?.fullName
                  : chat?.adminUserDetails?.fullName}
              </p>

              {chat?.adminUserDetails?._id === loggedInUser._id ? (
                chat?.receiverUserDetails?.isOnline ? (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <GoDotFill
                      style={{
                        padding: "0px",
                        height: "12px",
                        width: "12px",
                        marginRight: "5px",
                        color: "lightgreen",
                        marginBottom: "-3px",
                      }}
                      title="active"
                    />
                    <p>Active now</p>
                  </div>
                ) : (
                  <p>
                    Active:
                    {customTimeFormat(chat?.receiverUserDetails?.lastSeen)}
                  </p>
                )
              ) : chat?.adminUserDetails?.isOnline ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <GoDotFill
                    style={{
                      padding: "0px",
                      height: "12px",
                      width: "12px",
                      marginRight: "5px",
                      color: "lightgreen",
                      marginBottom: "-3px",
                    }}
                    title="active"
                  />
                  <p>Active now</p>
                </div>
              ) : (
                <p>
                  Active:
                  {customTimeFormat(chat?.receiverUserDetails?.lastSeen)}
                </p>
              )}
            </div>
          </div>
          <div className="call-icons">
            <IoCall onClick={handleAudioCall} />
            <IoVideocam onClick={handleVideoCall} />
            <CgMenuGridR />
          </div>
        </div>

        {/* All Messages */}
        <div className="user-msg-cntainer" id="scrollableDiv">
          <InfiniteScroll
            dataLength={totalMessages}
            next={fetchMoreData}
            style={{ display: "flex", flexDirection: "column-reverse" }} //To put endMessage and loader to the top.
            inverse={true} //
            hasMore={totalMessages > renderedMessagesCount}
            loader={
              <div>
                <br />
                <SmallSpinner />
              </div>
            }
            scrollableTarget="scrollableDiv"
            height={`80vh`}
          >
            <div ref={messageContainerRef}>
              <div className="alert_msg">
                <p>
                  Created this chat on{" "}
                  {formatDateForInitialChatCreationAlert(chat?.createdAt)}
                </p>
              </div>
              {/* Message Container */}
              {messages?.map((message) => {
                return (
                  <div key={message?._id} className="users_conversation">
                    {loggedInUser._id === message.senderDetails?._id ? (
                      <MyMessagePart
                        handleClickMessage={handleEditMessage}
                        message={message}
                        handleMessageDeletion={handleMessageDeletion}
                      />
                    ) : (
                      <OtherPersonMessagePart message={message} />
                    )}
                  </div>
                );
              })}
              {showTyping && (
                <div
                  style={{ margin: "10px" }}
                  className="user_conversation_container"
                >
                  <div className="user_msg_container">
                    <div className="other_user_messages">
                      {/* <p> */}
                      {typingAlertText && (
                        <div className="chat-bubble">
                          <div className="typing">
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                          </div>
                        </div>
                      )}
                      {/* </p> */}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </InfiniteScroll>
        </div>
        {/* Input Box */}
        <div className="selected-file">
          {file && (
            <div className="show-selected">
              <div
                className="progress-bar"
                style={{ width: `${uploadProgress}%` }}
              ></div>
              {uploadProgress === 0 && (
                <>
                  <p
                    onClick={() => {
                      setFile(null);
                    }}
                  >
                    X
                  </p>
                  {file.type.includes("image") ? (
                    <img src={URL?.createObjectURL(file)} alt="file" />
                  ) : (
                    <video controls src={URL.createObjectURL(file)} />
                  )}
                </>
              )}
            </div>
          )}
        </div>
        <form
          onSubmit={messageIdToEdit ? editMessageAction : handleSendMessage}
        >
          <div className="input-box">
            <div
              className="file-icon"
              title="Drag or click an icon to select a file"
            >
              <div {...getRootProps()}>
                <label htmlFor="send-file">
                  <MdOutlineAttachFile color={file ? "red" : "white"} />
                </label>
                <input {...getInputProps()} />
              </div>
            </div>

            <div className="send-message-form">
              <div className="message-input">
                <input
                  value={messageValue}
                  onChange={handleMessageInputChange}
                  type="text"
                  placeholder={
                    isDragActive ? "Drop your file" : "Enter message"
                  }
                />
              </div>
              <div className="send-btn">
                <button>
                  {messageIdToEdit ? <MdModeEditOutline /> : <IoMdSend />}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      {/* Video Call Component*/}
      {isVideoCall && (
        <div className="video-call-container">
          <Navbar title="End-to-end encrypted" />
          <div className="video-call-mid-container">
            <div className="profile">
              <img src="/user1.jpg" alt="" />
              <p>Niraj Bhaiya</p>
              <span>Ringing...</span>
              <video ref={videoRef} autoPlay />
              {/* Options To End The Call */}
              <div
                className="individual-video-call-options"
                onClick={handleEndCall}
              >
                <MdCallEnd />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
