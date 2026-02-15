export default function TopBar() {
  return (
    <header
      style={{
        height: "48px",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        background: "var(--color-surface)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <strong>Antigravity</strong>
    </header>
  );
}