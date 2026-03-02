export default function MobileNav() {
  return (
    <nav
      style={{
        height: "56px",
        display: "flex",
        justifyContent: "space-around",
        borderTop: "1px solid var(--color-border)",
        background: "var(--color-surface)",
      }}
    >
      {["chat", "files", "agent"].map((item) => (
        <span
          key={item}
          className="material-symbols-outlined"
          style={{ fontSize: "24px" }}
        >
          {item === "chat" ? "chat" : item === "files" ? "folder" : "smart_toy"}
        </span>
      ))}
    </nav>
  );
}