import { create } from "zustand";

/**
 * One chat message
 */
export type ChatMessage = {
  sender: "user" | "agent";
  text: string;
};

/**
 * Central chat state
 */
type ChatState = {
  messages: ChatMessage[];
  typing: boolean;

  addMessage: (message: ChatMessage) => void;
  setTyping: (value: boolean) => void;
};

/**
 * Zustand store
 */
export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  typing: false,

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setTyping: (value) =>
    set({
      typing: value,
    }),
}));

/**
 * Convenience helper for non-React files
 */
export const addMessage = (message: ChatMessage) => {
  useChatStore.getState().addMessage(message);
};