import create from "zustand";

export interface FileNode {
  name: string;
  path: string;
  content: string;
}

interface RepoState {
  files: FileNode[];
  activeFile: FileNode | null;
  setFiles: (files: FileNode[]) => void;
  open: (file: FileNode) => void;
}

export const useRepoStore = create<RepoState>((set) => ({
  files: [
    { name: "example.js", path: "/example.js", content: "console.log('hello');" }
  ],
  activeFile: null,
  setFiles: (files) => set({ files }),
  open: (file) => set({ activeFile: file })
}));
