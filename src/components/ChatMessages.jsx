import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";

function ChatMessages({ messages }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const conainerRefElemet = containerRef.current;

    if (conainerRefElemet) {
      conainerRefElemet.scrollTop = conainerRefElemet.scrollHeight;
    }
  }, [messages]);
  return (
    <>
      <div ref={containerRef} className="messages">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg.message} sender={msg.sender} />
        ))}
      </div>
    </>
  );
}

export default ChatMessages;
