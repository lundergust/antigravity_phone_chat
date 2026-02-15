import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [agentStatus, setAgentStatus] = useState({ executionGranted: false, quota: 0 });

    const messageHandlers = useRef(new Map());

    useEffect(() => {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const hostname = window.location.hostname;
        const port = window.location.port ? `:${window.location.port}` : '';

        // We use relative path /ws which is proxied by Vite to the backend in dev,
        // or handled by the server directly in production.
        const wsUrl = `${protocol}//${hostname}${port}/ws`;

        console.log(`Attempting to connect to: ${wsUrl}`);
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log("Connected to WebSocket");
            setIsConnected(true);
            setSocket(ws);
        };

        ws.onclose = () => {
            console.log("Disconnected from WebSocket");
            setIsConnected(false);
            setSocket(null);
        };

        ws.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);
                if (msg.type === 'agent_status') {
                    setAgentStatus(msg);
                }
                const handlers = messageHandlers.current.get(msg.type) || new Set();
                handlers.forEach(callback => callback(msg));
                const catchAll = messageHandlers.current.get('*');
                if (catchAll) catchAll.forEach(callback => callback(msg));
            } catch (e) {
                console.error("Error parsing WS message", e);
            }
        };

        return () => {
            ws.close();
        };
    }, []);

    const send = (type, payload = {}) => {
        if (socket && isConnected) {
            socket.send(JSON.stringify({ type, ...payload }));
        }
    };

    const subscribe = (type, callback) => {
        if (!messageHandlers.current.has(type)) {
            messageHandlers.current.set(type, new Set());
        }
        messageHandlers.current.get(type).add(callback);

        return () => {
            const handlers = messageHandlers.current.get(type);
            if (handlers) {
                handlers.delete(callback);
                if (handlers.size === 0) {
                    messageHandlers.current.delete(type);
                }
            }
        };
    };

    return (
        <SocketContext.Provider value={{ isConnected, send, subscribe, agentStatus }}>
            {children}
        </SocketContext.Provider>
    );
};
