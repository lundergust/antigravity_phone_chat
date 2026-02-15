import { useChatStore } from "./chatStore";
import MessageItem from "./MessageItem";

export default function MessageList() {
  const messages = useChatStore((state) => state.messages);
  const typing = useChatStore((state) => state.typing);

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {messages.map((msg, index) => (
        <MessageItem
          key={index}
          sender={msg.sender}
          text={msg.text}
        />
      ))}

      {typing && (
        <div
          style={{
            fontStyle: "italic",
            color: "var(--color-muted)",
          }}
        >
          Agent is typing…
        </div>
      )}
    </div>
  );
}