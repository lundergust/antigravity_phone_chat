import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { WebSocketServer } from "ws";
import { fsHandler } from "./server/fsHandler.js";
import { gitHandler } from "./server/gitHandler.js";

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

  const send = (data) => ws.send(JSON.stringify(data));

  send({
    type: "agent_status",
    executionGranted,
    quota
  });

  ws.on("message", async (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return;
    }

    try {
      /* -------- CHAT -------- */
      if (msg.type === "chat") {
        send({
          type: "chat",
          sender: "agent",
          message: `Agent received: "${msg.message}"`
        });
      }

      /* -------- EXECUTION PERMISSION -------- */
      if (msg.type === "grant_execution") {
        executionGranted = true;
        send({
          type: "agent_status",
          executionGranted,
          quota
        });
      }

      if (msg.type === "revoke_execution") {
        executionGranted = false;
        send({
          type: "agent_status",
          executionGranted,
          quota
        });
      }

      /* -------- FILE SYSTEM -------- */
      if (msg.type === "fs:list") {
        try {
          const files = await fsHandler.list(msg.path);
          send({ type: "fs:list:response", path: msg.path, files });
        } catch (err) {
          send({ type: "error", message: err.message });
        }
      }

      if (msg.type === "fs:read") {
        try {
          const content = await fsHandler.read(msg.path);
          send({ type: "fs:read:response", path: msg.path, content });
        } catch (err) {
          send({ type: "error", message: err.message });
        }
      }

      if (msg.type === "fs:write") {
        try {
          await fsHandler.write(msg.path, msg.content);
          send({ type: "fs:write:success", path: msg.path });
        } catch (err) {
          send({ type: "error", message: err.message });
        }
      }

      /* -------- GIT -------- */
      if (msg.type === "git:status") {
        try {
          const status = await gitHandler.status();
          send({ type: "git:status:response", status });
        } catch (err) {
          send({ type: "error", message: err.message });
        }
      }

      if (msg.type === "git:branches") {
        try {
          const branches = await gitHandler.branches();
          send({ type: "git:branches:response", branches });
        } catch (err) {
          send({ type: "error", message: err.message });
        }
      }

      if (msg.type === "git:checkout") {
        try {
          await gitHandler.checkout(msg.branch);
          send({ type: "git:checkout:success", branch: msg.branch });
          // Send updated status/branches
          const status = await gitHandler.status();
          send({ type: "git:status:response", status });
        } catch (err) {
          send({ type: "error", message: err.message });
        }
      }

      /* -------- RUN FILE -------- */
      if (msg.type === "run_file") {
        if (!executionGranted) {
          send({
            type: "execution_result",
            success: false,
            output: "Execution denied: permission not granted"
          });
          return;
        }

        if (quota <= 0) {
          send({
            type: "execution_result",
            success: false,
            output: "Quota exceeded"
          });
          return;
        }

        quota--;

        send({
          type: "execution_result",
          success: true,
          output: `Executed file: ${msg.filePath}`
        });

        send({
          type: "agent_status",
          executionGranted,
          quota
        });
      }
    } catch (error) {
      console.error("WS Message Error:", error);
      send({ type: "error", message: "Internal Server Error" });
    }
  });

  ws.on("close", () => {
    console.log("WS disconnected");
  });
});
