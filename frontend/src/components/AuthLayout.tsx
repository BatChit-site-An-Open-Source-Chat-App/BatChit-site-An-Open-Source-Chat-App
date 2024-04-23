import { useEffect } from "react";
import { UserType } from "../types/Rootstate";
import Login from "./Login";
import Register from "./Register";
import { useNavigate } from "react-router-dom";

export default function AuthLayout({
  login,
  register,
  loggedInUser,
}: {
  login?: boolean;
  register?: boolean;
  loggedInUser: UserType;
}) {
  const navigate = useNavigate();
  useEffect(() => {
    if (loggedInUser?._id) {
      navigate("/");
    }
  }, [loggedInUser, loggedInUser?._id]);
  return (
    <>
      {login && <Login />}
      {register && <Register />}
    </>
  );
}
