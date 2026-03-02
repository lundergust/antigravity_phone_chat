import React from 'react';
import { MessageSquare, FolderCode, Cpu } from 'lucide-react';

export const Navigation = ({ currentView, onViewChange }) => {
    return (
        <nav className="bottom-nav">
            <button
                className={`nav-item ${currentView === 'chat' ? 'active' : ''}`}
                onClick={() => onViewChange('chat')}
            >
                <div className="icon-container">
                    <MessageSquare size={24} strokeWidth={currentView === 'chat' ? 2.5 : 2} />
                </div>
                <span className="label">Chat</span>
            </button>

            <button
                className={`nav-item ${currentView === 'files' ? 'active' : ''}`}
                onClick={() => onViewChange('files')}
            >
                <div className="icon-container">
                    <FolderCode size={24} strokeWidth={currentView === 'files' ? 2.5 : 2} />
                </div>
                <span className="label">Repo</span>
            </button>

            <button
                className={`nav-item ${currentView === 'agents' ? 'active' : ''}`}
                onClick={() => onViewChange('agents')}
            >
                <div className="icon-container">
                    <Cpu size={24} strokeWidth={currentView === 'agents' ? 2.5 : 2} />
                </div>
                <span className="label">Agents</span>
            </button>

            <style jsx>{`
        .bottom-nav {
          display: flex;
          justify-content: space-around;
          padding: 12px 0 24px;
          background: var(--md-sys-color-surface);
          border-top: 1px solid var(--md-sys-color-outline-variant);
        }
        .nav-item {
          background: none;
          border: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          color: var(--md-sys-color-on-surface-variant);
          cursor: pointer;
          width: 64px;
        }
        .icon-container {
          padding: 4px 20px;
          border-radius: 16px;
          transition: all 0.2s ease;
        }
        .nav-item.active .icon-container {
          background-color: var(--md-sys-color-primary-container);
          color: var(--md-sys-color-on-primary-container);
        }
        .nav-item.active .label {
          color: var(--md-sys-color-on-surface);
          font-weight: 600;
        }
        .label {
          font-size: 12px;
          letter-spacing: 0.5px;
        }
      `}</style>
        </nav>
    );
};