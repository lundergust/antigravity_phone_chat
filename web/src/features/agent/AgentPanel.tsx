import { useAgentStore } from "./agentStore";
import { useRepoStore } from "../repo/repoStore";
import { socket } from "../chat/events";

export default function AgentPanel() {
  const activeFile = useRepoStore((s) => s.activeFile);
  const canExecute = useAgentStore((s) =>
    activeFile ? s.canExecute(activeFile) : false
  );
  const quotas = useAgentStore((s) => s.quotas);
  const grantPermission = useAgentStore((s) => s.grantPermission);
  const revokePermission = useAgentStore((s) => s.revokePermission);
  const decrementQuota = useAgentStore((s) => s.decrementQuota);

  if (!activeFile) return null;

  const handleGrant = () => grantPermission(activeFile);
  const handleRevoke = () => revokePermission(activeFile);

  const handleRun = () => {
    if (!canExecute) return;
    // Send run request to backend via WebSocket
    socket.send(
      JSON.stringify({
        type: "execute_file",
        payload: { path: activeFile },
      })
    );
    decrementQuota();
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        padding: "8px 16px",
        borderTop: "1px solid var(--color-border)",
        background: "var(--color-surface)",
      }}
    >
      <button
        onClick={handleGrant}
        disabled={canExecute}
        style={{
          padding: "6px 12px",
          borderRadius: "6px",
          background: canExecute ? "var(--color-border)" : "var(--color-accent)",
          color: canExecute ? "#888" : "#fff",
          border: "none",
          flex: 1,
        }}
      >
        {canExecute ? "Granted" : "Grant Execute"}
      </button>

      <button
        onClick={handleRevoke}
        disabled={!canExecute}
        style={{
          padding: "6px 12px",
          borderRadius: "6px",
          background: !canExecute ? "var(--color-border)" : "var(--color-accent)",
          color: !canExecute ? "#888" : "#fff",
          border: "none",
          flex: 1,
        }}
      >
        Revoke
      </button>

      <button
        onClick={handleRun}
        disabled={!canExecute || quotas <= 0}
        style={{
          padding: "6px 12px",
          borderRadius: "6px",
          background: canExecute && quotas > 0 ? "var(--color-accent)" : "var(--color-border)",
          color: canExecute && quotas > 0 ? "#fff" : "#888",
          border: "none",
          flex: 1,
        }}
      >
        Run ({quotas})
      </button>
    </div>
  );
}