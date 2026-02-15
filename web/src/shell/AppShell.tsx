import MobileNav from "./MobileNav";
import TopBar from "./TopBar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <TopBar />
      <div style={{ flex: 1, overflow: "hidden" }}>{children}</div>
      <MobileNav />
    </div>
  );
}