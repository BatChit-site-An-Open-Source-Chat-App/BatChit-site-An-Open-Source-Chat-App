import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.1.tsx";
import "./index.css";
import ToggleProfileProvider from "./context/ToggleProfile.tsx";
import SearchUserProvider from "./context/searchedContext.tsx";
import LogoutContextProvider from "./context/LogoutContext.tsx";
import { Provider } from "react-redux";
import { store } from "./app/store.ts";
import VideoCallContextProvider from "./context/videoCallContext.tsx";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SearchUserProvider>
      <ToggleProfileProvider>
        <LogoutContextProvider>
          <Provider store={store}>
            <VideoCallContextProvider>
              <App />
            </VideoCallContextProvider>
          </Provider>
        </LogoutContextProvider>
      </ToggleProfileProvider>
    </SearchUserProvider>
  </React.StrictMode>
);

// Uses

// import {  useDispatch } from "react-redux";
// import { removeTodo } from "./features/todo/todoSlice.ts";
// const dispatch =  useDispatch()
// const addTodoHandler = (e)=>{
//   e
//   dispatch(removeTodo('1'))
// }
