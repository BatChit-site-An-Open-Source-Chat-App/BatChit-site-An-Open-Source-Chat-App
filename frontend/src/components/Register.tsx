import { Link, useNavigate } from "react-router-dom";
import "../styles/register.css";
import axios from "axios";
import { AlertMessages } from "../AlertMsg/alertMsg";
import { useState } from "react";
import { AlertMessageType } from "../types/AlertTypes";
import { usersBackendURL } from "../utils/usersBackendURL";
import { getAlert } from "../utils/getAlertMsgWithType";
import { displayAlert } from "../utils/alertUtils";
export default function Register() {
  // All user form input field
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [code, setCode] = useState(3001);
  const navigate = useNavigate();
  const [msgType, setMsgType] = useState<AlertMessageType>("login");
  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (
      [email, password, fullName, gender].some((field) => field.trim() === "")
    ) {
      return displayAlert(
        setShowAlert,
        setCode,
        setMsgType,
        1006,
        "registration"
      );
    }
    try {
      let newGender = 0;
      if (gender.trim() === "m") {
        newGender = 1;
      } else if (gender.trim() === "f") {
        newGender = 2;
      } else {
        newGender = 0;
      }
      await axios
        .post(`${usersBackendURL}/register`, {
          fullName,
          email,
          password,
          gender: newGender,
        })
        .then((data) => {
          const { code, success } = data.data;
          if (success) {
            displayAlert(
              setShowAlert,
              setCode,
              setMsgType,
              code,
              "registration"
            );
            setTimeout(() => {
              navigate("/auth/login");
            }, 2000);
          } else {
            displayAlert(
              setShowAlert,
              setCode,
              setMsgType,
              1001,
              "registration"
            );
          }
        })
        .catch((err) => {
          const { status }: { status: number } = err.response;
          const alertMsgCode = getAlert(status, "registration");
          displayAlert(
            setShowAlert,
            setCode,
            setMsgType,
            alertMsgCode,
            "registration"
          );
        });
    } catch (error: any) {
      const { status }: { status: number } = error.response;
      const alertMsgCode = getAlert(status, "registration");
      displayAlert(
        setShowAlert,
        setCode,
        setMsgType,
        alertMsgCode,
        "registration"
      );
    }
  };
  return (
    <div className="register-container">
      <div className="register-mid-container">
        <form onSubmit={handleRegister} className="form-control">
          <div className="form-heading">
            <div className="logo-image">
              <img src="/logo2.png" alt="" />
            </div>
            <p>Join Now</p>
          </div>
          {/* Form input */}
          <div className="form-input">
            <div className="input">
              <label htmlFor="fullname">Fullname</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                }}
                id="fullname"
                placeholder="Enter Fullname"
                name="fullname"
              />
            </div>
            <div className="input">
              <label htmlFor="email">Email</label>
              <input
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                type="email"
                id="email"
                placeholder="Enter email"
                name="email"
              />
            </div>
            <div className="input">
              <label htmlFor="gender">Gender</label>
              {/* <input
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                type="text"
                id="gender"
                placeholder="Enter gender"
                name="gender"
              /> */}
              <select
                name="gender"
                id="gender"
                onChange={(e) => {
                  setGender(e.target.value);
                }}
              >
                <option value="o" defaultChecked>
                  Select gender
                </option>
                <option value="m">Male</option>
                <option value="f">Female</option>
                <option value="o">Prefer not to say</option>
              </select>
            </div>
            <div className="input">
              <label htmlFor="password">Password</label>
              <input
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type="password"
                id="password"
                placeholder="Enter password"
                name="password"
              />
            </div>
          </div>
          {/* Button */}
          <div className="btn-control">
            <button>Register</button>
          </div>
          <div
            style={{ display: "flex", gap: "5px", paddingTop: "15px" }}
            className="btn-control"
          >
            <p>Already have an account?</p>
            <Link to="/auth/login">Login Here</Link>
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
