function ChatMessage({ message, sender }) {
  return (
    <div className={`message ${sender}`}>
      {sender === "robot" && (
        <img
          src="https://robohash.org/chatbot.png?size=80x80"
          alt="Robot"
          className="avatar"
        />
      )}
      <div className="bubble">{message}</div>
      {sender === "user" && (
        <img
          src="https://api.dicebear.com/9.x/adventurer/svg?seed=John"
          alt="User"
          className="avatar"
        />
      )}
    </div>
  );
}
export default ChatMessage;
