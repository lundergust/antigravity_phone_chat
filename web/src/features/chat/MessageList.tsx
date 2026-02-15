import MessageItem from "./MessageItem";

export default function MessageList() {
  const messages = []; // will connect to real state later

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "16px",
      }}
    >
      {messages.map((message, idx) => (
        <MessageItem
          key={idx}
          text={message.text}
          sender={message.sender}
        />
      ))}
    </div>
  );
}