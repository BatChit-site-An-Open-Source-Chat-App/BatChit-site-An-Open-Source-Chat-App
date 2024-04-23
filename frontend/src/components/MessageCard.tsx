import { NavLink, useParams } from "react-router-dom";
import "../styles/card-message.css";
import { useContext } from "react";
import { ToggleProfile } from "../context/ToggleProfile";
import { MessageCardType } from "../types/Types";
import { customTimeFormat } from "../utils/timeFormatter";
import { useSelector } from "react-redux";
import { RootState } from "../types/Rootstate";

export default function MessageCard({ data }: MessageCardType) {
  const allValues = useContext(ToggleProfile);
  if (!allValues) return null;
  const { setShowProfile } = allValues;
  const { userId } = useParams();

  const loggedInUser = useSelector(
    (state: RootState) => state.auth.loggedInUser
  );
  return (
    <NavLink
      to={
        data?.isGroupChat
          ? `/group-messages/${data?._id}`
          : `/messages/${data?._id}`
      }
      onClick={() => {
        if (userId !== data?._id) setShowProfile(false);
      }}
    >
      <div className={`card-message`}>
        <div className="card-profile">
          <p
            className="text-bg"
            style={{ backgroundColor: data?.adminUserDetails?.background }}
          >
            {data?.chatName?.slice(0, 1)}
          </p>

          <div className="user-name-msg">
            <p>
              {data.adminUserDetails?._id === loggedInUser?._id
                ? data?.receiverUserDetails?.fullName
                : data?.adminUserDetails?.fullName}
            </p>
            <p>
              {data?.latestMessageDetails?._id
                ? `${
                    data?.latestMessageDetails?.senderDetails?._id ===
                    loggedInUser?._id
                      ? "You"
                      : data?.latestMessageDetails?.senderDetails?.fullName?.split(
                          " "
                        )[0]
                  }:  ${
                    data?.latestMessageDetails?.content
                      ? data?.latestMessageDetails.isDeleted
                        ? data.latestMessageDetails.senderDetails._id.toString() ===
                          loggedInUser._id.toString()
                          ? "You deleted this message"
                          : "This message was deleted"
                        : data?.latestMessageDetails?.content?.length > 25
                        ? data?.latestMessageDetails?.content?.slice(0, 30) +
                          "..."
                        : data?.latestMessageDetails?.content?.slice(0, 25)
                      : data?.latestMessageDetails?.media
                      ? data?.latestMessageDetails?.mediaType
                          ?.split("/")
                          ?.includes("image")
                        ? " sent a photo"
                        : " sent a video"
                      : " created this chat"
                  }`
                : `${
                    data?.adminUserDetails?.fullName?.split(" ")[0]
                  } created this chat`}
            </p>
          </div>
        </div>

        <div className="last-chat-time">
          <p>{customTimeFormat(data.updatedAt)}</p>
        </div>
      </div>
    </NavLink>
  );
}
