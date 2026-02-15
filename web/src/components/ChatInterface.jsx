import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send, Paperclip, Sparkles, Play, Plus, Terminal } from 'lucide-react';
import { useSocket } from '../context/SocketContext';

export const ChatInterface = () => {
  const { send, subscribe, agentStatus } = useSocket();
  const [messages, setMessages] = useState([
    { id: 1, text: "Antigravity Agent initialized. Ready to deploy.", sender: 'agent', timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => scrollToBottom(), [messages, isTyping]);

  useEffect(() => {
    const unsubChat = subscribe('chat', (msg) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: msg.message,
        sender: 'agent',
        timestamp: new Date()
      }]);
      setIsTyping(false);
    });

    const unsubExec = subscribe('execution_result', (msg) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: `${msg.success ? '✅' : '❌'} ${msg.output}`,
        sender: 'system',
        isSystem: true
      }]);
    });

    return () => {
      unsubChat();
      unsubExec();
    };
  }, [subscribe]);

  const handleNewChat = () => {
    setMessages([{ id: Date.now(), text: "New session started. Context cleared.", sender: 'agent', timestamp: new Date() }]);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    // Optimistic UI
    const userMsg = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);

    send('chat', { message: inputText });

    setInputText('');
    setIsTyping(true);
    // Timeout to clear typing if no response, or rely on socket
  };

  return (
    <div className="chat-interface">
      <div className="chat-header-actions">
        <button className="new-chat-btn" onClick={handleNewChat}>
          <Plus size={16} /> New Chat
        </button>
      </div>

      <div className="messages-list">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-row ${msg.sender} ${msg.isSystem ? 'system' : ''}`}>
            {msg.sender === 'agent' && <div className="agent-avatar"><Sparkles size={16} /></div>}

            <div className={`message-bubble ${msg.sender} ${msg.isSystem ? 'system-bubble' : ''}`}>
              {msg.text && (msg.isSystem
                ? <div className="system-msg">{msg.text}</div>
                : <div>{msg.text}</div>
              )}

              {msg.artifacts && msg.artifacts.map(art => (
                <div key={art.id} className="artifact-card">
                  <div className="artifact-header">
                    <Terminal size={14} />
                    <span>{art.title}</span>
                  </div>
                  <pre className="artifact-preview">{art.preview}</pre>
                  {/* TODO: Implement real execution of artifacts if they are files */}
                  <button className="run-btn">
                    <Play size={14} /> Run
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="message-row agent typing">
            <div className="agent-avatar"><Sparkles size={16} /></div>
            <div className="typing-indicator"><span></span><span></span><span></span></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <button className="icon-btn"><Paperclip size={20} /></button>
        <div className="text-input-wrapper">
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Antigravity..."
          />
        </div>
        <button className="send-btn" onClick={handleSend}><Send size={20} /></button>
      </div>

      <style jsx>{`
        .chat-header-actions {
          position: absolute;
          top: 16px;
          right: 16px;
          z-index: 20;
        }
        .new-chat-btn {
          background: var(--md-sys-color-surface-variant);
          border: none;
          padding: 8px 12px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          cursor: pointer;
          color: var(--md-sys-color-on-surface);
        }
        .system-bubble {
          background: transparent !important;
          color: var(--md-sys-color-outline) !important;
          font-family: monospace;
          font-size: 12px;
          width: 100%;
          text-align: center;
          padding: 4px !important;
        }
        .artifact-card {
          margin-top: 8px;
          background: rgba(0,0,0,0.1);
          border-radius: 8px;
          overflow: hidden;
        }
        .artifact-header {
          padding: 6px 12px;
          background: rgba(0,0,0,0.1);
          font-size: 11px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
        }
        .artifact-preview {
          padding: 12px;
          margin: 0;
          font-family: monospace;
          font-size: 12px;
          opacity: 0.8;
          white-space: pre-wrap;
        }
        .run-btn {
          width: 100%;
          border: none;
          background: var(--md-sys-color-primary);
          color: white;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};
