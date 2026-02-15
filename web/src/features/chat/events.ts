import { addMessage, useChatStore } from "./chatStore";

/**
 * Determine WebSocket URL from current origin
 */
const protocol =
  window.location.protocol === "https:" ? "wss://" : "ws://";

const socketUrl = protocol + window.location.host;

/**
 * Open WebSocket connection
 */
export const socket = new WebSocket(socketUrl);

/**
 * Connection opened
 */
socket.onopen = () => {
  console.log("[chat] WebSocket connected");
};

/**
 * Incoming messages from Antigravity
 */
socket.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);

    /**
     * Agent sent a message
     */
    if (data.type === "chat_message") {
      addMessage({
        sender: "agent",
        text: data.payload.text,
      });
    }

    /**
     * Agent typing indicator
     */
    if (data.type === "typing") {
      useChatStore.getState().setTyping(true);
    }

    if (data.type === "stop_typing") {
      useChatStore.getState().setTyping(false);
    }
  } catch (err) {
    console.error("[chat] Invalid message", err);
  }
};

/**
 * Connection closed
 */
socket.onclose = () => {
  console.warn("[chat] WebSocket disconnected");
};