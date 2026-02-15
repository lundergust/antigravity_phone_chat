import { RepoFile, useRepoStore } from "./repoStore";

function TreeNode({ node }: { node: RepoFile }) {
  const setActiveFile = useRepoStore((s) => s.setActiveFile);

  if (node.type === "file") {
    return (
      <div
        style={{ padding: "6px 12px", cursor: "pointer" }}
        onClick={() =>
          setActiveFile(
            node.path,
            `// Contents of ${node.path}\n\n(console output placeholder)`
          )
        }
      >
        📄 {node.path.split("/").pop()}
      </div>
    );
  }

  return (
    <div>
      <div style={{ padding: "6px 12px", fontWeight: 600 }}>
        📁 {node.path.split("/").pop()}
      </div>
      <div style={{ paddingLeft: "12px" }}>
        {node.children?.map((child) => (
          <TreeNode key={child.path} node={child} />
        ))}
      </div>
    </div>
  );
}

export default function RepoTree() {
  const tree = useRepoStore((s) => s.tree);

  return (
    <div style={{ overflowY: "auto" }}>
      {tree.map((node) => (
        <TreeNode key={node.path} node={node} />
      ))}
    </div>
  );
}