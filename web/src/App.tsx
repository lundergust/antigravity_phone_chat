import React, { useState } from "react";
import Layout from "./shell/Layout";
import ChatPanel from "./features/chat/ChatPanel";
import RepoExplorer from "./features/repo/RepoExplorer";

export default function App() {
  const [activeTab, setActiveTab] = useState<"chat" | "repo">("chat");

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === "chat" ? <ChatPanel /> : <RepoExplorer />}
    </Layout>
  );
}