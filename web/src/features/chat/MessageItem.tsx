type Props = {
  sender: "user" | "agent";
  text: string;
};

export default function MessageItem({ sender, text }: Props) {
  const isUser = sender === "user";

  return (
    <div
      style={{
        alignSelf: isUser ? "flex-end" : "flex-start",
        background: isUser
          ? "var(--color-accent)"
          : "var(--color-surface)",
        color: isUser ? "#fff" : "inherit",
        padding: "10px 14px",
        borderRadius: "12px",
        maxWidth: "80%",
      }}
    >
      {text}
    </div>
  );
}