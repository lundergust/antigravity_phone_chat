import { useEffect } from "react";
import { useRepoStore } from "./repoStore";
import Editor from "@monaco-editor/react";
import AgentPanel from "../agent/AgentPanel";

export default function FileViewer() {
  const activeFile = useRepoStore((s) => s.activeFile);
  const contents = useRepoStore((s) => s.fileContents);
  const dirty = useRepoStore((s) => s.dirty);
  const updateFileContents = useRepoStore((s) => s.updateFileContents);
  const saveFile = useRepoStore((s) => s.saveFile);

  if (!activeFile) {
    return (
      <div
        style={{
          padding: "16px",
          color: "var(--color-muted)",
        }}
      >
        Select a file to view its contents
      </div>
    );
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          padding: "8px 16px",
          borderBottom: "1px solid var(--color-border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "var(--color-surface)",
        }}
      >
        <span>{activeFile}</span>
        <button
          onClick={saveFile}
          disabled={!dirty}
          style={{
            padding: "6px 12px",
            background: dirty ? "var(--color-accent)" : "var(--color-border)",
            color: dirty ? "#fff" : "#888",
            borderRadius: "6px",
            border: "none",
            cursor: dirty ? "pointer" : "default",
          }}
        >
          {dirty ? "Save" : "Saved"}
        </button>
      </div>

      <div style={{ flex: 1, overflow: "hidden" }}>
        <Editor
          height="100%"
          defaultLanguage={activeFile?.endsWith(".js") ? "javascript" : "text"}
          value={contents}
          onChange={(value) => updateFileContents(value || "")}
          options={{
            automaticLayout: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            lineNumbers: "on",
          }}
        />
      </div>

      <AgentPanel />
    </div>
  );
}