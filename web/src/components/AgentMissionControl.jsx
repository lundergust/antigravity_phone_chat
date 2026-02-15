import React from 'react';
import { Terminal, Play, Pause, AlertCircle, CheckCircle2 } from 'lucide-react';

export const AgentMissionControl = () => {
    const agents = [
        { id: 1, name: "Refactor Agent", status: "running", task: "Optimizing CSS Selectors" },
        { id: 2, name: "Test Runner", status: "paused", task: "Waiting for review" },
        { id: 3, name: "Deploy Bot", status: "completed", task: "Staged to prod" }
    ];

    return (
        <div className="mission-control">
            <div className="mc-header">
                <h2>Active Agents</h2>
                <span className="badge">3 Total</span>
            </div>

            <div className="agents-grid">
                {agents.map(agent => (
                    <div key={agent.id} className="agent-card">
                        <div className="card-header">
                            <div className="agent-icon">
                                <Terminal size={18} />
                            </div>
                            <span className="agent-name">{agent.name}</span>
                            <span className={`status-dot ${agent.status}`}></span>
                        </div>

                        <div className="card-body">
                            <p>{agent.task}</p>
                        </div>

                        <div className="card-actions">
                            {agent.status === 'running' && (
                                <button className="action-btn pause">
                                    <Pause size={16} /> Pause
                                </button>
                            )}
                            {agent.status === 'paused' && (
                                <button className="action-btn resume">
                                    <Play size={16} /> Resume
                                </button>
                            )}
                            {agent.status === 'completed' && (
                                <div className="completion-mark">
                                    <CheckCircle2 size={16} /> Done
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
        .mission-control { padding: 16px; }
        .mc-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .mc-header h2 { margin: 0; font-size: 22px; font-weight: 400; }
        .badge { background: var(--md-sys-color-secondary-container); padding: 4px 12px; border-radius: 16px; font-size: 12px; }
        
        .agents-grid { display: grid; gap: 16px; }
        .agent-card {
          background: var(--md-sys-color-surface-variant);
          padding: 16px;
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .card-header { display: flex; align-items: center; gap: 12px; }
        .agent-icon { background: rgba(0,0,0,0.05); padding: 8px; border-radius: 50%; }
        .agent-name { flex: 1; font-weight: 500; }
        .status-dot { width: 8px; height: 8px; border-radius: 50%; }
        .status-dot.running { background: #4caf50; box-shadow: 0 0 8px #4caf50; }
        .status-dot.paused { background: #ff9800; }
        .status-dot.completed { background: #2196f3; }
        
        .card-actions { border-top: 1px solid rgba(0,0,0,0.05); padding-top: 12px; display: flex; justify-content: flex-end; }
        .action-btn { 
          display: flex; align-items: center; gap: 6px; 
          background: var(--md-sys-color-surface); 
          border: none; padding: 8px 16px; border-radius: 100px;
          font-weight: 500; cursor: pointer;
        }
        .completion-mark { display: flex; align-items: center; gap: 6px; color: #2196f3; }
      `}</style>
        </div>
    );
};