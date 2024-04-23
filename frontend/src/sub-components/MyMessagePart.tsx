import { useState, useEffect } from "react";
import { Messages } from "../types/Types";
import { messageDateFormat } from "../utils/messageDateFormat";
import { IoIosArrowDown, IoMdCheckmark } from "react-icons/io";
import { IoCheckmarkDone } from "react-icons/io5";

export default function MyMessagePart({
  message,
  handleClickMessage,
  handleMessageDeletion,
}: {
  message: Messages;
  handleClickMessage: (messageId: string) => void;
  handleMessageDeletion: (messageId: string) => void;
}) {
  const [media, setMedia] = useState<string | undefined>(undefined);
  const [scaleFactor, setScaleFactor] = useState<number>(1.0);
  const maxScale = 2.0;
  const minScale = 0.5;

  useEffect(() => {
    function handleScroll(event: WheelEvent) {
      const delta = event.deltaY;

      if (delta > 0) {
        // Zoom out
        if (scaleFactor > minScale) {
          setScaleFactor((prevScale) => prevScale - 0.1);
        }
      } else {
        // Zoom in
        if (scaleFactor < maxScale) {
          setScaleFactor((prevScale) => prevScale + 0.1);
        }
      }
    }

    // Attach event listener
    document.addEventListener("wheel", handleScroll, { passive: false });

    // Cleanup
    return () => {
      document.removeEventListener("wheel", handleScroll);
    };
  }, [scaleFactor]);

  return (
    <>
      <div className="user_conversation_container">
        <div className="my_msg_container">
          <div className="my_messages">
            {message?.media ? (
              <div className="media-message">
                <p className="message-value-with-media">{message?.content}</p>
                <div className="message-bottom-border"></div>
                {!message.isDeleted && message?.media && (
                  <div
                    className="message-media"
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    {message?.mediaType?.split("/")?.includes("image") && (
                      <div
                        onClick={() => {
                          setMedia(message?.media);
                        }}
                      >
                        <img src={message?.media} alt="media" />
                      </div>
                    )}

                    {message?.mediaType?.split("/")?.includes("video") && (
                      <video src={message?.media} controls />
                    )}

                    {message?.mediaType?.split("/")?.includes("audio") && (
                      <audio src={message?.media} controls />
                    )}

                    {message?.mediaType?.split("/")?.includes("pdf") && (
                      <object
                        data={message?.media}
                        type="application/pdf"
                        width="100%"
                      />
                    )}

                    {message?.mediaType?.split("/")?.includes("ms-excel") && (
                      <iframe src={message?.media} width="100%" />
                    )}

                    {message?.mediaType?.split("/")?.includes("msword") && (
                      <iframe src={message?.media} width="100%" />
                    )}

                    {message?.mediaType
                      ?.split("/")
                      ?.includes("ms-powerpoint") && (
                      <iframe src={message?.media} width="100%" />
                    )}

                    {message?.mediaType?.split("/")?.includes("plain") && (
                      <iframe src={message?.media} width="100%" />
                    )}

                    {message?.mediaType?.split("/")?.includes("json") && (
                      <p
                        style={{
                          fontSize: "11px",
                          padding: "0 6px",
                        }}
                      >
                        <span>{message.mediaType}</span>
                        <br />
                        {message.media.split("/").pop()}
                      </p>
                    )}
                    {message?.mediaType?.split("/")?.includes("text") && (
                      <p
                        style={{
                          fontSize: "11px",
                          padding: "0 6px",
                        }}
                      >
                        <span>{message.mediaType}</span>
                        <br />
                        {message.media.split("/").pop()}
                      </p>
                    )}

                    {message?.mediaType?.split("/")?.includes("zip") && (
                      <iframe src={message?.media} width="100%" />
                    )}

                    {message.mediaType?.split("/").includes("octet-stream") && (
                      <p style={{ fontSize: "11px", padding: "0 5px" }}>
                        {message.media.split("/").pop()}
                      </p>
                    )}

                    {!message.isDeleted && (
                      <div className="dropdown">
                        <button className="dropbtn">
                          <p>
                            <IoIosArrowDown />
                          </p>
                        </button>

                        <div className="dropdown-content">
                          {message?.createdAt ? (
                            new Date().getTime() -
                              new Date(message.createdAt).getTime() >
                            3600000 ? (
                              <p
                                onClick={() =>
                                  window.open(message.media, "_active")
                                }
                              >
                                Download
                              </p>
                            ) : (
                              <>
                                <p
                                  onClick={() =>
                                    handleMessageDeletion(message?._id)
                                  }
                                >
                                  Delete
                                </p>
                                <p
                                  onClick={() =>
                                    window.open(message.media, "_active")
                                  }
                                >
                                  Download
                                </p>
                              </>
                            )
                          ) : null}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <>
                {!message.isDeleted && (
                  <div className="dropdown">
                    <button className="dropbtn">
                      <p>
                        <IoIosArrowDown />
                      </p>
                    </button>

                    <div className="dropdown-content">
                      {message?.createdAt ? (
                        new Date().getTime() -
                          new Date(message.createdAt).getTime() >
                        3600000 ? (
                          <p
                            onClick={async () => {
                              await navigator.clipboard.writeText(
                                message?.content
                              );
                            }}
                          >
                            Copy
                          </p>
                        ) : (
                          <>
                            <p
                              onClick={() => {
                                handleClickMessage(message?._id);
                              }}
                            >
                              Edit
                            </p>
                            <p
                              onClick={() =>
                                handleMessageDeletion(message?._id)
                              }
                            >
                              Delete
                            </p>
                            <p
                              onClick={async () => {
                                await navigator.clipboard.writeText(
                                  message?.content
                                );
                              }}
                            >
                              Copy
                            </p>
                          </>
                        )
                      ) : null}
                    </div>
                  </div>
                )}
                <p
                  className="message-value"
                  style={
                    message.isDeleted
                      ? {
                          background: "transparent",
                          border: "1px solid #333232",
                        }
                      : {}
                  }
                >
                  {message.isDeleted ? "Deleted by you" : message?.content}
                </p>
              </>
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <span>{messageDateFormat(message?.createdAt)}</span>
            {message?.isSeen ? (
              <>
                {!message.isDeleted && message.isEdited && (
                  <span style={{ fontSize: "9px", marginLeft: "2px" }}>
                    (Edited)
                  </span>
                )}
                <span title="seen">
                  <IoCheckmarkDone
                    style={{
                      marginLeft: "5px",
                      color: "lightgreen",
                      fontSize: "15px",
                    }}
                  />
                </span>
              </>
            ) : (
              <span
                style={{ marginLeft: "5px", fontSize: "15px" }}
                title="sent"
              >
                <IoMdCheckmark />
              </span>
            )}
          </div>
        </div>
      </div>
      {media && (
        <div
          onClick={() => {
            setMedia(undefined);
          }}
          className="show-image-container"
        >
          <div className="show-image-side"></div>
          <div className="show-image-center">
            <img
              src={media}
              alt="image"
              style={{ transform: `scale(${scaleFactor})` }}
            />
          </div>
          <div className="show-image-side"></div>
        </div>
      )}
    </>
  );
}
