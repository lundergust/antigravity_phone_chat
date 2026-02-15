import create from "zustand";

export interface ChatMessage {
  sender: "user" | "agent";
  text: string;
}

interface ChatState {
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg],
    })),
}));

// Helpers for events.ts
export const addMessage = (msg: ChatMessage) =>
  useChatStore.getState().addMessage(msg);