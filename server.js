import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { WebSocketServer } from "ws";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

/* ------------------ STATIC FRONTEND ------------------ */

app.use(express.static(path.join(__dirname, "web/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "web/dist/index.html"));
});

/* ------------------ SERVER ------------------ */

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

/* ------------------ WEBSOCKET ------------------ */

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("WS connected");

  let executionGranted = false;
  let quota = 10;

  ws.send(JSON.stringify({
    type: "agent_status",
    executionGranted,
    quota
  }));

  ws.on("message", (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return;
    }

    /* -------- CHAT -------- */
    if (msg.type === "chat") {
      ws.send(JSON.stringify({
        type: "chat",
        sender: "agent",
        message: `Agent received: "${msg.message}"`
      }));
    }

    /* -------- EXECUTION PERMISSION -------- */
    if (msg.type === "grant_execution") {
      executionGranted = true;
      ws.send(JSON.stringify({
        type: "agent_status",
        executionGranted,
        quota
      }));
    }

    if (msg.type === "revoke_execution") {
      executionGranted = false;
      ws.send(JSON.stringify({
        type: "agent_status",
        executionGranted,
        quota
      }));
    }

    /* -------- RUN FILE -------- */
    if (msg.type === "run_file") {
      if (!executionGranted) {
        ws.send(JSON.stringify({
          type: "execution_result",
          success: false,
          output: "Execution denied: permission not granted"
        }));
        return;
      }

      if (quota <= 0) {
        ws.send(JSON.stringify({
          type: "execution_result",
          success: false,
          output: "Quota exceeded"
        }));
        return;
      }

      quota--;

      ws.send(JSON.stringify({
        type: "execution_result",
        success: true,
        output: `Executed file: ${msg.filePath}`
      }));

      ws.send(JSON.stringify({
        type: "agent_status",
        executionGranted,
        quota
      }));
    }
  });

  ws.on("close", () => {
    console.log("WS disconnected");
  });
});
