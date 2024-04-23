import { useEffect, useState } from "react";
import { Messages } from "../types/Types";
import { messageDateFormat } from "../utils/messageDateFormat";

export default function OtherPersonMessagePart({
  message,
}: {
  message: Messages;
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
        <div className="user_msg_container">
          <div className="other_user_messages">
            {!message.isDeleted && message?.media ? (
              <div
                className="media-message"
                style={{ background: "#262626", borderTopLeftRadius: "20px" }}
              >
                {message.content && (
                  <p className="message-value-with-media">{message?.content}</p>
                )}
                <div className="message-bottom-border"></div>
                {message?.media && (
                  <div
                    style={{
                      cursor: "pointer",
                    }}
                    className="message-media"
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
                      <div>
                        <video src={message?.media} controls />
                      </div>
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
                      <div
                        style={{ padding: "10px" }}
                        onClick={() => {
                          window.open(message.media, "_active");
                        }}
                      >
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
                      </div>
                    )}

                    {message?.mediaType?.split("/")?.includes("msword") && (
                      <div
                        style={{ padding: "10px" }}
                        onClick={() => {
                          window.open(message.media, "_active");
                        }}
                      >
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
                      </div>
                    )}

                    {message?.mediaType
                      ?.split("/")
                      ?.includes("ms-powerpoint") && (
                      <div
                        style={{ padding: "10px" }}
                        onClick={() => {
                          window.open(message.media, "_active");
                        }}
                      >
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
                      </div>
                    )}

                    {message?.mediaType?.split("/")?.includes("plain") && (
                      <div
                        style={{ padding: "10px" }}
                        onClick={() => {
                          window.open(message.media, "_active");
                        }}
                      >
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
                      </div>
                    )}

                    {message?.mediaType?.split("/")?.includes("json") && (
                      <div
                        style={{ padding: "10px" }}
                        onClick={() => {
                          window.open(message.media, "_active");
                        }}
                      >
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
                      </div>
                    )}
                    {message?.mediaType?.split("/")?.includes("text") && (
                      <div
                        style={{ padding: "10px" }}
                        onClick={() => {
                          window.open(message.media, "_active");
                        }}
                      >
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
                      </div>
                    )}

                    {message?.mediaType?.split("/")?.includes("zip") && (
                      <div
                        style={{ padding: "10px" }}
                        onClick={() => {
                          window.open(message.media, "_active");
                        }}
                      >
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
                      </div>
                    )}

                    {message.mediaType?.split("/").includes("octet-stream") && (
                      <p style={{ fontSize: "11px", padding: "0 5px" }}>
                        {message.media.split("/").pop()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <p
                className="message-value"
                style={
                  message.isDeleted
                    ? {
                        background: "transparent",
                        border: "1px solid #333232",
                      }
                    : { maxWidth: "65%" }
                }
              >
                {message?.content}
              </p>
            )}
          </div>

          <span>{messageDateFormat(message?.createdAt)}</span>
          {!message.isDeleted && message.isEdited && (
            <span style={{ fontSize: "9px", marginLeft: "2px" }}>(Edited)</span>
          )}
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
