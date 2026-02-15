import React from "react";
import { useAgentStore } from "./AgentStore";
import { useRepoStore } from "../repo/RepoStore";

interface Props {
  ws: WebSocket | null;
}

export default function AgentPanel({ ws }: Props) {
  const { executionGranted, quota } = useAgentStore();
  const { activeFile } = useRepoStore();

  return (
    <div style={{
      borderTop: "1px solid #e0e0e0",
      padding: 12,
      background: "#ffffff"
    }}>
      <div style={{ fontWeight: 500, marginBottom: 6 }}>
        Agent Controls
      </div>

      <div style={{ fontSize: 14, marginBottom: 6 }}>
        Execution: {executionGranted ? "Granted" : "Not granted"}
      </div>

      <div style={{ fontSize: 14, marginBottom: 12 }}>
        Quota remaining: {quota}
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          onClick={() => ws?.send(JSON.stringify({ type: "grant_execution" }))}
        >
          Grant
        </button>

        <button
          onClick={() => ws?.send(JSON.stringify({ type: "revoke_execution" }))}
        >
          Revoke
        </button>

        <button
          disabled={!activeFile || !executionGranted}
          onClick={() =>
            ws?.send(JSON.stringify({
              type: "run_file",
              filePath: activeFile.path
            }))
          }
        >
          Run File
        </button>
      </div>
    </div>
  );
}
