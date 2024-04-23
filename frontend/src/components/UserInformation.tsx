import { useDispatch, useSelector } from "react-redux";
import "../styles/user-info.css";
import Top from "../sub-components/Top";
import { RootState } from "../types/Rootstate";
import { useState } from "react";
import { updateAccount } from "../apis/update-account";
import { saveLoggedInUser } from "../features/auth/authSlice";
import { AlertMessageType } from "../types/AlertTypes";
import { displayAlert } from "../utils/alertUtils";
import { AlertMessages } from "../AlertMsg/alertMsg";
import { MdVerified } from "react-icons/md";
import { GoUnverified } from "react-icons/go";
export default function UserInformation({
  widthOfWindow,
}: {
  widthOfWindow: number;
}) {
  const [showAlert, setShowAlert] = useState(false);
  const [code, setCode] = useState(3001);
  const [msgType, setMsgType] = useState<AlertMessageType>("updateAccount");
  const user = useSelector((user: RootState) => user.auth.loggedInUser);
  const [fullName, setFullName] = useState(user.fullName);
  // const [email, setEmail] = useState('')
  const [bio, setBio] = useState(user.bio);
  // const [avatar, setAvatar] = useState();
  const dispatch = useDispatch();
  const handleSaveChanges = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (!fullName || !bio) {
      displayAlert(
        setShowAlert,
        setCode,
        setMsgType,
        6003,
        "updateAccount",
        2000
      );
    } else {
      if (fullName === user.fullName && bio === user?.bio) {
        displayAlert(
          setShowAlert,
          setCode,
          setMsgType,
          6002,
          "updateAccount",
          2000
        );
      } else {
        const update = await updateAccount(fullName, bio);
        if (update.success) {
          dispatch(saveLoggedInUser(update.data));
          displayAlert(
            setShowAlert,
            setCode,
            setMsgType,
            6000,
            "updateAccount",
            2000
          );
        } else {
          displayAlert(
            setShowAlert,
            setCode,
            setMsgType,
            6001,
            "updateAccount",
            2000
          );
        }
      }
    }
  };

  return (
    <div className="user-info-container">
      <div className="top-header user-info-header">
        <Top widthOfWindow={widthOfWindow} title="User Information" isProfile />
      </div>
      <div className="user-profile-mid-container">
        <div className="user-cover-image">
          <img src="/bg.jpg" alt="" />
        </div>
        <div className="user-credentials">
          <div className="user-avatar-img">
            <div
              style={{
                textAlign: "center",
              }}
            >
              <img src="/user1.jpg" alt="" />
              <p style={{ fontWeight: "600", fontSize: "20px" }}>
                {user.fullName}
              </p>
              <p
                style={{
                  fontWeight: "500",
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                {user.email}
                {user.isActivated ? (
                  <MdVerified title="verified" />
                ) : (
                  <GoUnverified title="unverified" />
                )}
              </p>
            </div>
          </div>
          <form onSubmit={handleSaveChanges} className="user-name-and-bio">
            <div className="user-input">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={`${fullName}`}
                placeholder={`Current Name: ${fullName}`}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="user-input">
              <label htmlFor="bio">About</label>
              <textarea
                id="bio"
                placeholder={`Current bio: ${bio ? bio : "Add a bio"}`}
                value={`${bio ? bio : ""}`}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
            <div className="action-buttons">
              {/* <div className="action-button">
                <button type="reset">Reset</button>
              </div> */}
              <div className="action-button">
                <button type="submit">Save Changes</button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div>
        {showAlert && (
          <AlertMessages
            setShowAlert={setShowAlert}
            code={code}
            type={msgType}
          />
        )}
      </div>
    </div>
  );
}
