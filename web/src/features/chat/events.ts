import { w3cwebsocket as W3CWebSocket } from "websocket";
import { addMessage } from "./chatStore";

// Create a global singleton
export const socket = new W3CWebSocket(
  `${window.location.protocol.replace("http", "ws")}//${window.location.host}`
);

// When the socket opens
socket.onopen = () => {
  console.log("Connected to Antigravity backend");
};

// On message from backend
socket.onmessage = (msg) => {
  try {
    const data = JSON.parse(msg.data as string);

    if (data.type === "chat_message") {
      addMessage({
        text: data.payload.text,
        sender: data.payload.sender,
      });
    }
  } catch (e) {
    console.error("Invalid message from backend", e);
  }
};