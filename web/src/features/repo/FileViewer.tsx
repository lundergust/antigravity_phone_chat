import { useRepoStore } from "./repoStore";

export default function FileViewer() {
  const activeFile = useRepoStore((s) => s.activeFile);
  const contents = useRepoStore((s) => s.fileContents);

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
    <pre
      style={{
        margin: 0,
        padding: "16px",
        fontFamily: "monospace",
        whiteSpace: "pre-wrap",
        overflowY: "auto",
      }}
    >
      {contents}
    </pre>
  );
}