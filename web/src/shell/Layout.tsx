import React, { ReactNode } from "react";
import SideRail from "./SideRail";

interface LayoutProps {
  children: ReactNode;
  activeTab: "chat" | "repo";
  setActiveTab: (tab: "chat" | "repo") => void;
}

export default function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <SideRail activeTab={activeTab} setActiveTab={setActiveTab} />
      <main style={{ flex: 1, overflowY: "auto" }}>{children}</main>
    </div>
  );
}