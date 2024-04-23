import { useContext, useEffect, useState } from "react";
import { BiSolidLock } from "react-icons/bi";
import { ToggleProfile } from "../context/ToggleProfile";
import { GrGroup } from "react-icons/gr";
import { Link, useParams } from "react-router-dom";
import { GroupChatDetails } from "../types/Types";
import { getGroupChatWithId } from "../apis/chatActions";
import { useSelector } from "react-redux";
import { RootState } from "../types/Rootstate";
import { ImCross } from "react-icons/im";
import Spinner from "./Spinner";

export default function Profile() {
  const [group, setGroup] = useState<GroupChatDetails[0] | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const allValues = useContext(ToggleProfile);
  if (!allValues) return null;
  const { groupId } = useParams();
  const { showProfile, setShowProfile } = allValues;

  const loggedInUser = useSelector(
    (state: RootState) => state.auth.loggedInUser
  );

  useEffect(() => {
    const fetchGroup = async (groupId: string) => {
      setLoading(true);
      const res = await getGroupChatWithId(groupId);
      const { success, data } = res;
      if (success) {
        setGroup(data);
      }
      setLoading(false);
    };
    if (groupId) {
      fetchGroup(groupId);
    }
  }, [groupId]);

  return (
    <div className="rightbar-profile-container">
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div
            className="contact-info-header pt-pl-6"
            style={{
              top: "0",
              position: "sticky",
              backgroundColor: "var(--dark-theme-bg)",
            }}
          >
            <div onClick={() => setShowProfile(!showProfile)}>
              <div className="back-sign">
                <ImCross
                  style={{ padding: "8px" }}
                  onClick={() => setShowProfile(!showProfile)}
                />
                <div className="account-details">
                  <h4>Group Information</h4>
                </div>
              </div>
            </div>
          </div>
          <div>
            <img
              src="/bg.jpg"
              style={{ width: "100%", height: "200px", objectFit: "cover" }}
              alt=""
            />
          </div>
          <div className="profile_details" style={{ marginTop: "-150px" }}>
            <div className="profile_image" style={{ display: "flex" }}>
              <img
                src="https://cdn-icons-png.freepik.com/512/9073/9073174.png"
                alt=""
              />
            </div>
            <div className="profile_name_contacts">
              <p>{group?.chatName?.toUpperCase()}</p>
            </div>
          </div>
          {/* <div className="profile_about">
        <p>About</p>
        <p style={{ width: "70%" }}>Hello World</p>
      </div> */}
          <div className="msg_credentials">
            <p>
              <BiSolidLock />
            </p>
            <div className="msg_credentails_message">
              <p>Group Admin</p>
              <p>{group?.adminUserDetails?.fullName}</p>
            </div>
          </div>
          <div className="msg_credentials">
            <p>
              <BiSolidLock />
            </p>
            <div className="msg_credentails_message">
              <p>Credentials</p>
              <p>Messages are end-to-end encrypted.</p>
            </div>
          </div>
          <div className="msg_credentials">
            <div className="msg_credentails_message">
              <p style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <GrGroup />
                <span>All Members</span>
              </p>
              <div>
                {group?.receiverUsersDetails.map((e, index) => {
                  if (e._id === loggedInUser._id) {
                    return;
                  }
                  return (
                    <Link
                      to={`/search?query=${e._id}`}
                      key={index}
                      className="card-profile"
                      style={{ cursor: "pointer", color: "white" }}
                    >
                      <div>
                        <p
                          className="text-bg"
                          style={{
                            backgroundColor:
                              group?.adminUserDetails?.background,
                            color: "white",
                          }}
                        >
                          {group?.chatName?.slice(0, 1)?.toLocaleUpperCase()}
                        </p>
                      </div>
                      <div className="all-members">
                        <p>{e.fullName}</p>
                        <p>{e?.email}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
