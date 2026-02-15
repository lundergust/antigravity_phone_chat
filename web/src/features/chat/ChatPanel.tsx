import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "./ChatStore";
import { useAgentStore } from "../agent/AgentStore";
import AgentPanel from "../agent/AgentPanel";

export default function ChatPanel() {
    const { messages, add } = useChatStore();
    const { setStatus } = useAgentStore();
    const [input, setInput] = useState("");
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`ws://${window.location.host}`);
        wsRef.current = ws;

        ws.onmessage = (e) => {
            const msg = JSON.parse(e.data);

            if (msg.type === "chat") {
                add({ id: crypto.randomUUID(), sender: "agent", text: msg.message });
            }

            if (msg.type === "execution_result") {
                add({
                    id: crypto.randomUUID(),
                    sender: "agent",
                    text: msg.output
                });
            }

            if (msg.type === "agent_status") {
                setStatus(msg.executionGranted, msg.quota);
            }
        };

        return () => ws.close();
    }, []);

    const send = () => {
        if (!input.trim()) return;
        add({ id: crypto.randomUUID(), sender: "user", text: input });
        wsRef.current?.send(JSON.stringify({ type: "chat", message: input }));
        setInput("");
    };

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            height: "100%"
        }}>
            <div style={{
                flex: 1,
                overflowY: "auto",
                padding: 12
            }}>
                {messages.map(m => (
                    <div
                        key={m.id}
                        style={{
                            textAlign: m.sender === "user" ? "right" : "left",
                            marginBottom: 8
                        }}
                    >
                        <span style={{
                            display: "inline-block",
                            padding: "8px 12px",
                            borderRadius: 12,
                            background: m.sender === "user" ? "#1a73e8" : "#e8f0fe",
                            color: m.sender === "user" ? "#fff" : "#202124",
                            maxWidth: "80%"
                        }}>
                            {m.text}
                        </span>
                    </div>
                ))}
            </div>

            <div style={{
                display: "flex",
                padding: 8,
                gap: 8
            }}>
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    style={{ flex: 1, padding: 8 }}
                    placeholder="Send a message"
                />
                <button onClick={send}>Send</button>
            </div>

            <AgentPanel ws={wsRef.current} />
        </div>
    );
}
