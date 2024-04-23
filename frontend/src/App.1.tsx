import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./types/Rootstate";
import { saveLoggedInUser } from "./features/auth/authSlice";
import { getCookie } from "./utils/getCookies";
import AuthLayout from "./components/AuthLayout";
import Spinner from "./components/Spinner";
import PageNotFound from "./components/PageNotFound";
import { Dispatch } from "@reduxjs/toolkit";
import { login } from "./apis/login";
import { appendNextMessage } from "./features/messages/messageSlice";
import { saveChatCards } from "./features/chat/chatSlice";
import Navbar from "./components/Navbar";

export default function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const REACT_APP_BACKEND_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;
  const [loader, setLoader] = useState(true);
  const loggedInUser = useSelector(
    (state: RootState) => state.auth.loggedInUser
  );
  const accessToken: string | null = getCookie("accessToken");
  const dispatch = useDispatch<Dispatch>();
  useEffect(() => {
    setSocket(
      io(REACT_APP_BACKEND_URL, {
        withCredentials: true,
      })
    );
  }, []);

  useEffect(() => {
    if (loggedInUser?._id) {
      socket?.emit("add-user", loggedInUser._id);
    }
  }, [socket, loggedInUser?._id]);

  useEffect(() => {
    const updateIndividualMessage = (data: any) => {
      const { messages, receiverChats, senderChats } = data;
      dispatch(appendNextMessage(messages));
      if (senderChats) {
        dispatch(saveChatCards(senderChats));
      } else dispatch(saveChatCards(receiverChats));
    };
    socket?.on("update-individual-message", updateIndividualMessage);

    return () => {
      socket?.off("update-individual-message", updateIndividualMessage);
    };
  }, [socket]);

  useEffect(() => {
    const fetchUser = async () => {
      const loginUser = await login();
      const { user, success } = loginUser;
      if (success) {
        dispatch(saveLoggedInUser(user));
      }
      setTimeout(() => {
        setLoader(false);
      }, 2000);
    };
    fetchUser();
  }, []);
  if (accessToken) {
    if (loader) return <Spinner />;
  }
  return (
    <BrowserRouter>
      <main>
        <Navbar />
        <Routes>
          {/*  Before Authentication */}
          <Route
            path="/auth/register"
            element={
              <section className="register">
                {loader ? (
                  <Spinner />
                ) : (
                  <AuthLayout loggedInUser={loggedInUser} register />
                )}
              </section>
            }
          />
          <Route
            path="/auth/login"
            element={
              <section className="register">
                {loader ? (
                  <Spinner />
                ) : (
                  <AuthLayout loggedInUser={loggedInUser} login />
                )}
              </section>
            }
          />

          {/* After authentication */}
          <Route
            path="/"
            element={
              <section className="layout">
                <Layout socket={socket} home={true} />
              </section>
            }
          />

          <Route
            path="/search"
            element={
              <section className="layout">
                <Layout socket={socket} search={true} />
              </section>
            }
          />

          <Route
            path="/group-messages"
            element={
              <section className="layout">
                <Layout socket={socket} groupMessages={true} />
              </section>
            }
          />

          <Route
            path="/group-messages/:groupId"
            element={
              <section className="layout">
                <Layout socket={socket} groupMessages={true} isGroup />
              </section>
            }
          />
          <Route
            path="/user-history"
            element={
              <section className="layout">
                <Layout socket={socket} history={true} />
              </section>
            }
          />
          <Route
            path="/profile"
            element={
              <section className="layout">
                <Layout socket={socket} profile={true} />
              </section>
            }
          />
          {/*  */}

          <Route
            path="/profile/user-information"
            element={
              <section className="layout">
                <Layout socket={socket} profile={true} userInformation />
              </section>
            }
          />

          <Route
            path="/profile/blocked-accounts"
            element={
              <section className="layout">
                <Layout socket={socket} profile={true} blockedAccounts />
              </section>
            }
          />

          <Route
            path="/profile/delete-account"
            element={
              <section className="layout">
                <Layout socket={socket} profile={true} deleteAccount />
              </section>
            }
          />

          {/*  */}
          <Route
            path="/logout"
            element={
              <section className="layout">
                <Layout socket={socket} logout={true} />
              </section>
            }
          />
          <Route
            path="/messages/:chatId"
            element={
              <section className="layout">
                <Layout socket={socket} message={true} />
              </section>
            }
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
