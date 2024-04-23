import React, { createContext, useState } from "react";
import { CallerUser, VideoCallContextType } from "../types/Types";

export const VideoCallContext = createContext<VideoCallContextType | null>(
  null
);

const VideoCallContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isVideoCall, setIsVideoCall] = useState<boolean | false>(false);
  const [isUserReceivingCall, setIsUserReceivingCall] = useState<
    boolean | false
  >(false);
  const [callerUserDetails, setCallerUserDetails] = useState<CallerUser | null>(
    null
  );
  const values = {
    isVideoCall,
    setIsVideoCall,
    isUserReceivingCall,
    setIsUserReceivingCall,
    callerUserDetails,
    setCallerUserDetails,
  };

  return (
    <VideoCallContext.Provider value={values}>
      {children}
    </VideoCallContext.Provider>
  );
};
export default VideoCallContextProvider;
