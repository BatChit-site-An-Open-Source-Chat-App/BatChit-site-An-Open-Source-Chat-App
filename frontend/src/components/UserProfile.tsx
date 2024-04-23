import {
  HiInformationCircle,
  HiOutlineInformationCircle,
} from "react-icons/hi";
import "../styles/userprofiletabs.css";
import {
  MdBlock,
  MdDelete,
  MdOutlineBlock,
  MdOutlineDelete,
} from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
export default function UserProfile() {
  const location = useLocation();
  const pathName = location.pathname;
  const navigate = useNavigate();
  return (
    <div className="user-profile-container">
      <div className="user-profile-mid-container">
        <div
          className={`${
            pathName.split("/").includes("user-information") && "active"
          } user-profiletab`}
          onClick={() => {
            navigate(`/profile/user-information`);
          }}
        >
          <div className="tab-icon">
            <p>
              {pathName.split("/").includes("user-information") ? (
                <HiInformationCircle />
              ) : (
                <HiOutlineInformationCircle />
              )}
            </p>
          </div>
          <div className="tab-title">
            <p>User Information</p>
          </div>
        </div>
        <div
          className={`${
            pathName.split("/").includes("blocked-accounts") && "active"
          } user-profiletab`}
          onClick={() => {
            navigate(`/profile/blocked-accounts`);
          }}
        >
          <div className="tab-icon">
            <p>
              {pathName.split("/").includes("blocked-accounts") ? (
                <MdBlock />
              ) : (
                <MdOutlineBlock />
              )}
            </p>
          </div>
          <div className="tab-title">
            <p>Blocked Account</p>
          </div>
        </div>
        <div
          className={`${
            pathName.split("/").includes("delete-account") && "active"
          } user-profiletab`}
          onClick={() => {
            navigate(`/profile/delete-account`);
          }}
        >
          <div className="tab-icon">
            <p>
              {pathName.split("/").includes("delete-account") ? (
                <MdDelete />
              ) : (
                <MdOutlineDelete />
              )}
            </p>
          </div>
          <div className="tab-title">
            <p>Delete Account</p>
          </div>
        </div>
      </div>
    </div>
  );
}
