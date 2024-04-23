import "../styles/linkscontainer.css";
import {
  BiGroup,
  BiHome,
  BiSearch,
  BiSolidGroup,
  BiSolidHome,
  BiSolidSearch,
  BiSolidUserCircle,
  BiUserCircle,
} from "react-icons/bi";
import { NavLink, useNavigate } from "react-router-dom";
import { getLocation } from "../utils/getLocation";
import { IoLogOut } from "react-icons/io5";
import { MdOutlineLogout } from "react-icons/md";
import { useContext } from "react";
import { LogoutContext } from "../context/LogoutContext";
import { ImCross } from "react-icons/im";
import { useDispatch } from "react-redux";
import { clearLoggedInUser } from "../features/auth/authSlice";
import axios from "axios";
import { usersBackendURL } from "../utils/usersBackendURL";

export default function Linkscontainer() {
  const allValues = useContext(LogoutContext);
  if (!allValues) return null;

  const { logout, setLogout } = allValues;

  let newPathName = getLocation();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    const access_Token = document.cookie.match("accessToken=");
    const logoutUser = await axios.post(`${usersBackendURL}/logout`, {
      headers: {
        Authorization: `Bearer ${access_Token}`,
      },
    });
    const { success, statusCode } = logoutUser.data;

    if (success && statusCode === 200) {
      dispatch(clearLoggedInUser());
      navigate("/auth/login");
    } else {
      alert("Something went wrong!");
    }
  };
  return (
    <div className="links">
      <div className="tab-icons">
        <div
          className={`icon ${
            (newPathName === "" || newPathName?.split("/")[0] === "messages") &&
            "active"
          }`}
        >
          <NavLink to="/">
            <div>
              {newPathName === "" ||
              newPathName?.split("/")[0] === "messages" ? (
                <BiSolidHome />
              ) : (
                <BiHome />
              )}
            </div>
          </NavLink>
        </div>
        <div
          className={`icon ${
            (newPathName === "/search" ||
              newPathName?.split("/")[0] === "search") &&
            "active"
          }`}
        >
          <NavLink to="/search">
            <div>
              {newPathName === "search" ? <BiSolidSearch /> : <BiSearch />}
            </div>
          </NavLink>
        </div>
        <div
          className={`icon ${
            (newPathName === "group-messages" ||
              newPathName?.split("/")[0] === "group-messages") &&
            "active"
          }`}
        >
          <NavLink to="/group-messages">
            <div>
              {newPathName?.split("/")[0] === "group-messages" ? (
                <BiSolidGroup />
              ) : (
                <BiGroup />
              )}
            </div>
          </NavLink>
        </div>
        <div
          className={`icon ${
            (newPathName === "profile" ||
              newPathName?.split("/")[0] === "profile") &&
            "active"
          }`}
        >
          <NavLink to={"/profile/user-information"}>
            <div>
              {newPathName === "profile" ||
              newPathName?.split("/")[0] === "profile" ? (
                <BiSolidUserCircle />
              ) : (
                <BiUserCircle />
              )}
            </div>
          </NavLink>
        </div>
        <div>
          <div
            className="icon"
            onClick={() => {
              setLogout(!logout);
            }}
          >
            {newPathName === "logout" ? <IoLogOut /> : <MdOutlineLogout />}
          </div>
        </div>
      </div>
      {logout && (
        <div className="logout-container">
          <div className="logout-mid-container">
            <div className="logout-cross">
              <ImCross
                onClick={() => {
                  setLogout(!logout);
                }}
              />
            </div>
            <div className="logout-alert">
              <p>Are you sure, you want to logout?</p>
            </div>
            <div className="logout-button">
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
