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

  setActiveFile: (path: string, contents: string) => void;
};

export const useRepoStore = create<RepoState>((set) => ({
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

  setActiveFile: (path, contents) =>
    set({
      activeFile: path,
      fileContents: contents,
    }),
}));