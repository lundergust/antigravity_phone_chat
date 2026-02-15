import { create } from "zustand";

type AgentState = {
  permissions: Record<string, boolean>; // file path -> can execute
  quotas: number; // number of allowed executions remaining

  grantPermission: (filePath: string) => void;
  revokePermission: (filePath: string) => void;
  decrementQuota: () => void;
  canExecute: (filePath: string) => boolean;
};

export const useAgentStore = create<AgentState>((set, get) => ({
  permissions: {},
  quotas: 5, // e.g., 5 executions per session

  grantPermission: (filePath) =>
    set((state) => ({
      permissions: { ...state.permissions, [filePath]: true },
    })),

  revokePermission: (filePath) =>
    set((state) => ({
      permissions: { ...state.permissions, [filePath]: false },
    })),

  decrementQuota: () =>
    set((state) => ({
      quotas: Math.max(0, state.quotas - 1),
    })),

  canExecute: (filePath) =>
    get().permissions[filePath] === true && get().quotas > 0,
}));