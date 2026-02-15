import { useState, useRef } from "react";
import { socket } from "./events";
import { addMessage } from "./chatStore";

export default function ChatInput() {
  const [text, setText] = useState("");
  const typingTimeout = useRef<number | null>(null);

  /**
   * Send message to backend
   */
  const sendMessage = () => {
    if (!text.trim()) return;

    // Add user message locally
    addMessage({
      sender: "user",
      text,
    });

    // Send to backend
    socket.send(
      JSON.stringify({
        type: "chat_message",
        payload: { text },
      })
    );

    setText("");
  };

  /**
   * Handle typing events
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);

    socket.send(JSON.stringify({ type: "typing" }));

    if (typingTimeout.current) {
      window.clearTimeout(typingTimeout.current);
    }

    typingTimeout.current = window.setTimeout(() => {
      socket.send(JSON.stringify({ type: "stop_typing" }));
    }, 1200);
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        padding: "12px",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      <input
        value={text}
        onChange={handleChange}
        placeholder="Type a message"
        style={{
          flex: 1,
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid var(--color-border)",
        }}
      />
      <button
        onClick={sendMessage}
        style={{
          padding: "12px 16px",
          borderRadius: "8px",
          background: "var(--color-accent)",
          color: "#fff",
          border: "none",
        }}
      >
        Send
      </button>
    </div>
  );
}