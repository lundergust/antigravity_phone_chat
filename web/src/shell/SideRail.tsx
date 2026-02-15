type Props = {
  active: "chat" | "repo";
  onSelect: (view: "chat" | "repo") => void;
};

export default function SideRail({ active, onSelect }: Props) {
  const buttonStyle = (isActive: boolean) => ({
    padding: "12px",
    background: isActive
      ? "var(--color-accent)"
      : "transparent",
    color: isActive ? "#fff" : "inherit",
    border: "none",
    width: "100%",
  });

  return (
    <nav
      style={{
        width: "56px",
        borderRight: "1px solid var(--color-border)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <button
        style={buttonStyle(active === "chat")}
        onClick={() => onSelect("chat")}
      >
        💬
      </button>
      <button
        style={buttonStyle(active === "repo")}
        onClick={() => onSelect("repo")}
      >
        📁
      </button>
    </nav>
  );
}