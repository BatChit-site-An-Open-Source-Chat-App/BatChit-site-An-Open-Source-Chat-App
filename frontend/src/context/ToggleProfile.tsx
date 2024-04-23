import React, { createContext, useState } from "react";

type ToggleProfileType = {
  showProfile: boolean;
  setShowProfile: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ToggleProfile = createContext<ToggleProfileType | false>(false);
const ToggleProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <ToggleProfile.Provider value={{ showProfile, setShowProfile }}>
      {children}
    </ToggleProfile.Provider>
  );
};
export default ToggleProfileProvider;
