import { useState } from "react";
import { Chatbot } from "supersimpledev";

function ChatInput({ messages, setMessages }) {
  const [inputText, setInputText] = useState("");

  function saveInputText(event) {
    setInputText(event.target.value);
  }

  function sendMessages() {
    const newChatMessages = [
      ...messages,
      {
        id: crypto.randomUUID(),
        sender: "user",
        message: inputText,
      },
    ];

    setMessages(newChatMessages);

    const response = Chatbot.getResponse(inputText);

    setMessages([
      ...newChatMessages,
      {
        id: crypto.randomUUID(),
        sender: "robot",
        message: response,
      },
    ]);

    setInputText("");

    console.log(messages);
  }
  return (
    <div className="chat-input">
      <input
        type="text"
        onChange={saveInputText}
        value={inputText}
        placeholder="Send a message to Chatbot"
      />
      <button onClick={sendMessages}>Send</button>
    </div>
  );
}

export default ChatInput;
