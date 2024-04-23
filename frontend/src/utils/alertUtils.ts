import { AlertMessageType } from "../types/AlertTypes";

export const displayAlert = (
  setShowAlert: React.Dispatch<React.SetStateAction<boolean>>,
  setCode: React.Dispatch<React.SetStateAction<number>>,
  setMsgType: React.Dispatch<React.SetStateAction<AlertMessageType>>,
  code: number,
  msgType: AlertMessageType,
  duration: number = 2000
) => {
  setCode(code);
  setMsgType(msgType);
  setShowAlert(true);
  setTimeout(() => {
    setShowAlert(false);
  }, duration);
};
