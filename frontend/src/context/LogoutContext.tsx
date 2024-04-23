import React, { useState, createContext } from "react";

type LogoutContextType = {
  logout: boolean;
  setLogout: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LogoutContext = createContext<LogoutContextType | false>(false);

const LogoutContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [logout, setLogout] = useState(false);
  return (
    <LogoutContext.Provider value={{ logout, setLogout }}>
      {children}
    </LogoutContext.Provider>
  );
};

export default LogoutContextProvider;
