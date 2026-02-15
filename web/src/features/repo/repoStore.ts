import { create } from "zustand";

export type RepoFile = {
  path: string;
  type: "file" | "dir";
  children?: RepoFile[];
};

type RepoState = {
  tree: RepoFile[];
  activeFile: string | null;
  fileContents: string;
  originalContents: string;
  dirty: boolean;

  setActiveFile: (path: string, contents: string) => void;
  updateFileContents: (contents: string) => void;
  saveFile: () => void;
};

export const useRepoStore = create<RepoState>((set, get) => ({
  tree: [
    {
      path: "src",
      type: "dir",
      children: [
        { path: "src/app.js", type: "file" },
        { path: "src/utils.js", type: "file" },
      ],
    },
    { path: "README.md", type: "file" },
  ],
  activeFile: null,
  fileContents: "",
  originalContents: "",
  dirty: false,

  setActiveFile: (path, contents) =>
    set({
      activeFile: path,
      fileContents: contents,
      originalContents: contents,
      dirty: false,
    }),

  updateFileContents: (contents) => {
    const original = get().originalContents;
    set({
      fileContents: contents,
      dirty: contents !== original,
    });
  },

  saveFile: () => {
    // For now, this is UI-only
    const current = get();
    console.log(`[repo] Saving ${current.activeFile}`);
    set({
      originalContents: current.fileContents,
      dirty: false,
    });
  },
}));