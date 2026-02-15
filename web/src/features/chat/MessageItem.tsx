export default function MessageItem({
  text,
  sender,
}: {
  text: string;
  sender: "user" | "agent";
}) {
  return (
    <div
      style={{
        marginBottom: "8px",
        padding: "12px",
        borderRadius: "8px",
        background:
          sender === "user" ? "var(--color-accent)" : "var(--color-surface)",
        color: "var(--color-text)",
      }}
    >
      {text}
    </div>
  );
}