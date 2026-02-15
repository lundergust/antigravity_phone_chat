import RepoTree from "./RepoTree";
import FileViewer from "./FileViewer";

export default function RepoView() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "160px 1fr",
        height: "100%",
      }}
    >
      <div
        style={{
          borderRight: "1px solid var(--color-border)",
          overflowY: "auto",
        }}
      >
        <RepoTree />
      </div>

      <div style={{ height: "100%" }}>
        <FileViewer />
      </div>
    </div>
  );
}