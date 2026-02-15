import create from "zustand";

export interface Message {
  id: string;
  sender: "user" | "agent";
  text: string;
}

interface ChatState {
  messages: Message[];
  add: (msg: Message) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  add: (msg) =>
    set((s) => ({ messages: [...s.messages, msg] }))
}));
