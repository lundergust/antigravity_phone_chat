import React from "react";
import { useRepoStore } from "./RepoStore";
import FileViewer from "./FileViewer";

function renderTree(nodes: any, openFile: (file: any) => void) {
  return nodes.map((node: any) => (
    <div key={node.path} style={{ paddingLeft: 10 }}>
      <div onClick={() => node.children ? null : openFile(node)} style={{ cursor: "pointer", color: "#202124", padding: 2 }}>
        {node.name}
      </div>
      {node.children && renderTree(node.children, openFile)}
    </div>
  ));
}

export default function RepoExplorer() {
  const { files, activeFile, openFile } = useRepoStore();

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div style={{ width: 200, overflowY: "auto", borderRight: "1px solid #e0e0e0" }}>
        {renderTree(files, openFile)}
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {activeFile ? <FileViewer file={activeFile} /> : <div style={{ padding: 20 }}>Select a file</div>}
      </div>
    </div>
  );
}
