import { ShowAlertType } from "../types/AlertTypes";
import "../styles/toast-msg.css";
import { ImCross } from "react-icons/im";
export default function ShowAlert({
  alertObject,
  setShowAlert,
}: {
  alertObject: ShowAlertType;
  setShowAlert: Function;
}) {
  return (
    <div className="toast-msg">
      <p>
        <span>Code: {alertObject.code}</span>
        {" ("}
        <span>{alertObject.msg}</span>
        {")"}
      </p>
      <ImCross
        onClick={() => {
          setShowAlert(false);
        }}
      />
    </div>
  );
}
