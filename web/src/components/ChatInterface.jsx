import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { simulateAntigravityResponse } from '../services/mockApi'; // Connected to service
import { Mic, Send, Paperclip, Sparkles } from 'lucide-react';

export const ChatInterface = () => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState([
    { id: 1, text: "Antigravity Agent initialized. How can I help you build today?", sender: 'agent', timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Fix: Proper error handling and async flow
    try {
      const response = await simulateAntigravityResponse(inputText);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: response.text,
        sender: 'agent',
        timestamp: new Date(),
        artifacts: response.artifacts // New Feature: Agent Artifacts
      }]);
    } catch (error) {
      console.error("Antigravity connection failed", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-interface">
      <div className="messages-list">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-row ${msg.sender}`}>
            {msg.sender === 'agent' && (
              <div className="agent-avatar">
                <Sparkles size={16} />
              </div>
            )}
            <div className={`message-bubble ${msg.sender}`}>
              {msg.text}
              {msg.artifacts && (
                <div className="artifact-chip">
                  <span>Draft: {msg.artifacts[0].title}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="message-row agent typing">
            <div className="agent-avatar"><Sparkles size={16} /></div>
            <div className="typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <button className="icon-btn" aria-label="Attach file">
          <Paperclip size={20} />
        </button>
        <div className="text-input-wrapper">
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Antigravity..."
            rows={1}
          />
        </div>
        {inputText ? (
          <button className="send-btn" onClick={handleSend} aria-label="Send">
            <Send size={20} />
          </button>
        ) : (
          <button className="icon-btn" aria-label="Voice input">
            <Mic size={20} />
          </button>
        )}
      </div>
    </div>
  );
};