import AppShell from "./shell/AppShell";
import ChatView from "./features/chat/ChatView";

export default function App() {
  return (
    <AppShell>
      <ChatView />
    </AppShell>
  );
}