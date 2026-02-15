import MessageItem from "./MessageItem";
import { useChatStore } from "./chatStore";

export default function MessageList() {
  const messages = useChatStore((state) => state.messages);

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "16px",
      }}
    >
      {messages.map((message, idx) => (
        <MessageItem key={idx} text={message.text} sender={message.sender} />
      ))}
    </div>
  );
}