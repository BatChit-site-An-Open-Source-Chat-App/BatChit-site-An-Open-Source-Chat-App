import { Link } from "react-router-dom";
import "../styles/login.css";
import React, { useState } from "react";
import { displayAlert } from "../utils/alertUtils";
import { AlertMessageType } from "../types/AlertTypes";
import { AlertMessages } from "../AlertMsg/alertMsg";
import { getAlert } from "../utils/getAlertMsgWithType";
import axios from "axios";
import { usersBackendURL } from "../utils/usersBackendURL";
import { useDispatch } from "react-redux";
import { saveLoggedInUser } from "../features/auth/authSlice";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const [showAlert, setShowAlert] = useState(false);
  const [code, setCode] = useState(3001);
  const [msgType, setMsgType] = useState<AlertMessageType>("login");
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if ([email, password].some((field) => field.trim() === "")) {
      return displayAlert(setShowAlert, setCode, setMsgType, 2006, "login");
    }
    try {
      await axios
        .post(`${usersBackendURL}/login`, { email, password })
        .then(({ data }) => {
          if (data.success) {
            displayAlert(setShowAlert, setCode, setMsgType, 2005, "login");
            dispatch(saveLoggedInUser(data));
            window.location.href = "/";
          } else {
            displayAlert(setShowAlert, setCode, setMsgType, 2004, "login");
          }
        })
        .catch((err) => {
          const { status }: { status: number } = err.response;
          const alertMsgCode = getAlert(status, "login");
          displayAlert(
            setShowAlert,
            setCode,
            setMsgType,
            alertMsgCode,
            "login"
          );
        });
    } catch (error: any) {
      const { status }: { status: number } = error.response;
      const alertMsgCode = getAlert(status, "login");
      displayAlert(setShowAlert, setCode, setMsgType, alertMsgCode, "login");
    }
  };

  return (
    <div className="login-container">
      <div className="login-mid-container">
        <form onSubmit={handleLogin} className="form-control">
          <div className="form-heading">
            <div className="logo-image">
              <img src="/logo2.png" alt="" />
            </div>
            <p>Login Now</p>
          </div>
          {/* Form input */}
          <div className="form-input">
            <div className="input">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
              />
            </div>
            <div className="input">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {/* Button */}
          <div className="btn-control">
            <button>Login</button>
          </div>
          <div
            style={{ display: "flex", gap: "5px", paddingTop: "15px" }}
            className="btn-control"
          >
            <p>Don't have an account?</p>
            <Link to="/auth/register">Register Here</Link>
          </div>
          <br />
          <br />
        </form>
      </div>
      {showAlert && (
        <AlertMessages setShowAlert={setShowAlert} code={code} type={msgType} />
      )}
    </div>
  );
}
