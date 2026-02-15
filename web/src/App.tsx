import AppShell from "./shell/AppShell";
import ChatView from "./features/chat/ChatView";
import RepoView from "./features/repo/RepoView";

export default function App() {
  return (
    <AppShell>
      <ChatView />
      <RepoView />
    </AppShell>
  );
}