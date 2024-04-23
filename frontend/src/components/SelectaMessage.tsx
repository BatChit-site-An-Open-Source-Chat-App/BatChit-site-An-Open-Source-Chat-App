import { BiSolidLock } from "react-icons/bi";
import "../styles/selectamsg.css";
// import { useEffect, useState } from "react";
export default function SelectaMessage({
  widthOfWindow,
}: {
  widthOfWindow: number;
}) {
  return (
    <div className={`select-container ${widthOfWindow < 575 && " dis-none"}`}>
      <p>Send and receive messages with your email only</p>
      <div className="encryption-msg-select">
        <p>
          <BiSolidLock />
        </p>
        <span>End-to-end encrypted</span>
      </div>
    </div>
  );
}
