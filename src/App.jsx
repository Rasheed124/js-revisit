import { useState } from "react";

import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";

function App() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      sender: "user",
      message: "Hello chatbot",
    },
    {
      id: "2",
      sender: "robot",
      message: "Hello! How can I help you?",
    },
    {
      id: "3",
      sender: "user",
      message: "Can you get me today's date?",
    },
    {
      id: "4",
      sender: "robot",
      message: "Today is July 12.",
    },
  ]);

  

  return (
    <div className="chat-container">
      <ChatMessages messages={messages} />

      <ChatInput messages={messages} setMessages={setMessages} />
    </div>
  );
}

export default App;
