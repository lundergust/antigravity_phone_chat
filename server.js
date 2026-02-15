import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { WebSocketServer } from "ws";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Serve React build
app.use(express.static(path.join(__dirname, "web/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "web/dist/index.html"));
});

// Start HTTP server
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// WebSocket server for chat and execution
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("WebSocket client connected");

  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg.toString());

      if (data.type === "chat") {
        // Echo message for now
        ws.send(JSON.stringify({ type: "chat", message: `Agent: Received "${data.message}"` }));
      }

      if (data.type === "run") {
        // Mock execution response
        ws.send(JSON.stringify({ type: "run", output: `Executed ${data.file}` }));
      }

    } catch (err) {
      console.error(err);
    }
  });

  ws.on("close", () => console.log("WebSocket client disconnected"));
});