import React from "react";
import Editor from "@monaco-editor/react";
import { useRepoStore } from "./RepoStore";

interface Props { file: any }

export default function FileViewer({ file }: Props) {
  const { updateContent } = useRepoStore();

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Editor
        height="100%"
        defaultLanguage="javascript"
        value={file.content || ""}
        onChange={(v) => updateContent(v || "")}
      />
    </div>
  );
}
