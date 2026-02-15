import { ReactNode, useState } from "react";
import SideRail from "./SideRail";

export default function AppShell({ children }: { children: ReactNode }) {
  const [view, setView] = useState<"chat" | "repo">("chat");

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "var(--color-bg)",
      }}
    >
      <SideRail active={view} onSelect={setView} />

      <main style={{ flex: 1 }}>
        {view === "chat" && children}
        {view === "repo" && <div id="repo-root" />}
      </main>
    </div>
  );
}