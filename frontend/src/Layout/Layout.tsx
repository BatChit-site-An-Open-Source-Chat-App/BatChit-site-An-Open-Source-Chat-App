import { useContext, useEffect, useState } from "react";
import BlockedAccount from "../components/BlockedAccount";
import DeleteAccount from "../components/DeleteAccount";
import Home from "../components/Home";
import SelectaMessage from "../components/SelectaMessage";
import SingleMessage from "../components/SingleMessage";
import UserInformation from "../components/UserInformation";
import ViewSearchedPerson from "../components/ViewSearchedPerson";
import { LayoutParamsType } from "../types/Types";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../types/Rootstate";
import { getAllChatCards } from "../apis/chatActions";
import { displayAlert } from "../utils/alertUtils";
import { AlertMessages } from "../AlertMsg/alertMsg";
import { AlertMessageType } from "../types/AlertTypes";
import {
  appendChat,
  editChat,
  saveChatCards,
  updateSeenChat,
} from "../features/chat/chatSlice";
import GroupSingleMessage from "../components/GroupSingleMessage";
import {
  removeDeletedMessage,
  saveEditedMessage,
  updatedSeenMessages,
} from "../features/messages/messageSlice";
import { storeOnlineUsers } from "../features/online-users/onlineUsers";
import { VideoCallContext } from "../context/videoCallContext";

export default function Layout({
  home,
  groupMessages,
  history,
  profile,
  search,
  logout,
  message,
  isGroup,
  blockedAccounts,
  userInformation,
  deleteAccount,
  socket,
}: LayoutParamsType) {
  const [widthOfWindow, setWidthOfWindow] = useState(0);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("query");
  const [showAlert, setShowAlert] = useState(false);
  const [code, setCode] = useState(3001);
  const [msgType, setMsgType] = useState<AlertMessageType>("chatCards");

  const loggedInUser = useSelector(
    (state: RootState) => state.auth.loggedInUser
  );
  const navigate = useNavigate();

  const chatsData = useSelector(
    (state: RootState) => state?.chats?.allChatCards
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.outerWidth;
      setWidthOfWindow(windowWidth);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const values = useContext(VideoCallContext);

  if (!values) {
    return null;
  }
  const {
    isUserReceivingCall,
    setIsUserReceivingCall,
    setCallerUserDetails,
    callerUserDetails,
  } = values;

  useEffect(() => {
    const updateIndividualChat = (data: any) => {
      const { specific_chat } = data;
      dispatch(appendChat(specific_chat));
    };
    socket?.on("update-chat-for-individual", updateIndividualChat);

    return () => {
      socket?.off("update-chat-for-individual", updateIndividualChat);
    };
  }, [socket]);

  useEffect(() => {
    const updateMessagesSeen = (data: any) => {
      dispatch(updatedSeenMessages(data));
      dispatch(updateSeenChat(data));
    };

    socket?.on("update-seen-messages", updateMessagesSeen);

    return () => {
      socket?.off("update-seen-messages", updateMessagesSeen);
    };
  }, [socket]);

  useEffect(() => {
    const updateMessagesSeen = (data: any) => {
      const { getEditedMessage, chat } = data;
      if (chat && getEditedMessage) {
        dispatch(saveEditedMessage(getEditedMessage));
        dispatch(editChat(chat));
      }
    };

    socket?.on("edit-individual-message", updateMessagesSeen);

    return () => {
      socket?.off("edit-individual-message", updateMessagesSeen);
    };
  }, [socket]);

  useEffect(() => {
    if (loggedInUser && loggedInUser?._id) {
      socket?.emit("get-online-users", loggedInUser._id);
    }
  }, [socket, loggedInUser?._id]);

  useEffect(() => {
    const updateOnlineUsers = (data: any) => {
      if (data?.length > 0) {
        dispatch(storeOnlineUsers(data));
      }
    };

    socket?.on("update-online-users", updateOnlineUsers);

    return () => {
      socket?.off("update-online-users", updateOnlineUsers);
    };
  }, [socket]);

  useEffect(() => {
    const updateMessagesSeen = (data: any) => {
      const { messageId } = data;
      if (messageId) {
        dispatch(removeDeletedMessage(messageId));
      }
    };

    socket?.on("delete-individual-message", updateMessagesSeen);

    return () => {
      socket?.off("delete-individual-message", updateMessagesSeen);
    };
  }, [socket]);

  useEffect(() => {
    const notifyUserForVideoCall = (data: any) => {
      setCallerUserDetails(data);
      setIsUserReceivingCall(true);
    };
    socket?.on(
      "notify-individual-receiver-for-video-call",
      notifyUserForVideoCall
    );

    return () => {
      socket?.off(
        "notify-individual-receiver-for-video-call",
        notifyUserForVideoCall
      );
    };
  }, [socket]);

  useEffect(() => {
    const getChats = async () => {
      const chats = await getAllChatCards();
      if (chats.success) {
        const { code, data } = chats;
        displayAlert(
          setShowAlert,
          setCode,
          setMsgType,
          code,
          "chatCards",
          2000
        );
        dispatch(saveChatCards(data));
      }
    };
    getChats();
  }, []);

  useEffect(() => {
    if (!loggedInUser) {
      navigate("/auth/login");
    }
  }, []);
  if (!loggedInUser) {
    return null;
  }
  return (
    <>
      <Home
        home={home}
        groupMessages={groupMessages}
        history={history}
        profile={profile}
        search={search}
        logout={logout}
        message={message}
        isGroup={isGroup}
        deleteAccount={deleteAccount}
        userInformation={userInformation}
        blockedAccounts={blockedAccounts}
        widthOfWindow={widthOfWindow}
        chatsCard={chatsData}
        socket={socket}
      >
        {home && <SelectaMessage widthOfWindow={widthOfWindow} />}
        {message && <SingleMessage socket={socket} />}
        {search && searchQuery && (
          <ViewSearchedPerson socket={socket} widthOfWindow={widthOfWindow} />
        )}
        {search && widthOfWindow > 575 && !searchQuery && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              marginTop: "30vh",
              fontSize: "17px",
              fontWeight: "700",
            }}
          >
            <p>Search an user to view</p>
          </div>
        )}
        {groupMessages && isGroup && <GroupSingleMessage socket={socket} />}
        {groupMessages && widthOfWindow > 575 && !isGroup && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              marginTop: "30vh",
              fontSize: "17px",
              fontWeight: "700",
            }}
          >
            <p>Select a group to view</p>
          </div>
        )}
        {profile &&
          widthOfWindow > 575 &&
          !userInformation &&
          !blockedAccounts &&
          !deleteAccount && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                marginTop: "30vh",
                fontSize: "17px",
                fontWeight: "700",
              }}
            >
              <p>Tab on left options to view</p>
            </div>
          )}
        {deleteAccount && <DeleteAccount />}
        {userInformation && <UserInformation widthOfWindow={widthOfWindow} />}
        {blockedAccounts && <BlockedAccount />}
      </Home>
      {showAlert && (
        <AlertMessages setShowAlert={setShowAlert} code={code} type={msgType} />
      )}
      {isUserReceivingCall && (
        <div className="user-receiving-call-notification">
          <div className="user-receiving-call-notification-mid-container">
            <div className="profile">
              <p>Niraj Chaurasiya</p>
              <span>nirajkumarchaurasiya6@gmail.com</span>
            </div>
            <div className="user-receiving-call-notification-mid-container-buttons">
              <button className="accept-button">Accept (Video Call)</button>
              <button className="end-button">End Call</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
