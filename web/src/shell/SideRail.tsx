import React from "react";

interface SideRailProps {
  activeTab: "chat" | "repo";
  setActiveTab: (tab: "chat" | "repo") => void;
}

export default function SideRail({ activeTab, setActiveTab }: SideRailProps) {
  return (
    <nav style={{
      width: 60,
      background: "#ffffff",
      borderRight: "1px solid #e0e0e0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: 10
    }}>
      <button
        style={{ margin: 10, background: "none", border: "none", fontSize: 24, color: activeTab === "chat" ? "#1a73e8" : "#5f6368" }}
        onClick={() => setActiveTab("chat")}
      >
        💬
      </button>
      <button
        style={{ margin: 10, background: "none", border: "none", fontSize: 24, color: activeTab === "repo" ? "#1a73e8" : "#5f6368" }}
        onClick={() => setActiveTab("repo")}
      >
        📁
      </button>
    </nav>
  );
}