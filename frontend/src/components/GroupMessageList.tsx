import { NavLink, useParams } from "react-router-dom";
import "../styles/card-message.css";
import { useContext } from "react";
import { ToggleProfile } from "../context/ToggleProfile";
import { GroupMessageCardType } from "../types/Types";
import { customTimeFormat } from "../utils/timeFormatter";
import { useSelector } from "react-redux";
import { RootState } from "../types/Rootstate";

export default function GroupMessageList({ data }: GroupMessageCardType) {
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
          {data.isGroupChat ? (
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNLj_8pzpibGhDNjYNR_GccHZZ5ITc656d5g&usqp=CAU"
              alt="user-pic"
            />
          ) : (
            <p
              className="text-bg"
              style={{ backgroundColor: data?.adminUserDetails?.background }}
            >
              {data?.chatName?.slice(0, 1)}
            </p>
          )}
          <div className="user-name-msg">
            <p>{data?.chatName}</p>
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
                      ? data?.latestMessageDetails?.content?.length > 25
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
