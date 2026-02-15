import { useState } from "react";
import { socket } from "./events";
import { addMessage } from "./chatStore";

export default function ChatInput() {
  const [draft, setDraft] = useState("");

  const sendMessage = () => {
    if (!draft.trim()) return;

    // Add user message locally
    addMessage({ sender: "user", text: draft });

    // Send to backend
    socket.send(
      JSON.stringify({
        type: "chat_message",
        payload: { text: draft },
      })
    );

    setDraft("");
  };

  return (
    <div
      style={{
        padding: "12px",
        borderTop: "1px solid var(--color-border)",
        display: "flex",
        gap: "8px",
      }}
    >
      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Type a message…"
        style={{
          flex: 1,
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid var(--color-border)",
          background: "var(--color-bg)",
          color: "var(--color-text)",
        }}
      />
      <button
        style={{
          padding: "12px",
          borderRadius: "8px",
          background: "var(--color-accent)",
          color: "#fff",
        }}
        onClick={sendMessage}
      >
        Send
      </button>
    </div>
  );
}