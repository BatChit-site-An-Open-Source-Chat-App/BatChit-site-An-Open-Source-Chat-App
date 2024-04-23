import { AlertMessageType } from "../types/AlertTypes";
import { allAlertMessages, methodNotAllowed } from "../utils/alertMessages";
import ShowAlert from "./ShowAlert";

export const AlertMessages = ({
  type,
  code,
  setShowAlert,
}: {
  type: AlertMessageType;
  code: number;
  setShowAlert: Function;
}) => {
  let alertMsg =
    allAlertMessages
      .find((alert) => alert.type === type)
      ?.availableStatusAlerts.find(
        (availableCodes) => availableCodes.code === code
      ) || methodNotAllowed;

  return <ShowAlert alertObject={alertMsg} setShowAlert={setShowAlert} />;
};
