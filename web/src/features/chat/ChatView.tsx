import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

/**
 * Vertical chat layout
 */
export default function ChatView() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <MessageList />
      <ChatInput />
    </div>
  );
}