import React from 'react';
import { Terminal, Play, Pause, CheckCircle2, Database, Zap, HardDrive, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useSocket } from '../context/SocketContext';

export const AgentMissionControl = () => {
    const { agentStatus, send } = useSocket();

    const toggleExecution = () => {
        if (agentStatus.executionGranted) {
            send('revoke_execution');
        } else {
            send('grant_execution');
        }
    };

    const quotas = [
        { id: 'quota', label: 'Remaining Actions', used: 10 - agentStatus.quota, total: 10, icon: <Zap size={16} /> },
        // Placeholder for other non-implemented quotas
        { id: 'storage', label: 'Repo Storage', used: 120, total: 500, unit: 'MB', icon: <HardDrive size={16} /> },
    ];

    return (
        <div className="mission-control">
            {/* Permission Section */}
            <div className="permission-section">
                <h3>Safety Protocols</h3>
                <div className={`permission-card ${agentStatus.executionGranted ? 'granted' : 'revoked'}`}>
                    <div className="perm-icon">
                        {agentStatus.executionGranted ? <ShieldCheck size={24} /> : <ShieldAlert size={24} />}
                    </div>
                    <div className="perm-info">
                        <div className="perm-title">Autonomous Execution</div>
                        <div className="perm-desc">
                            {agentStatus.executionGranted
                                ? "Agent is AUTHORIZED to execute code."
                                : "Agent is BLOCKED from executing code."}
                        </div>
                    </div>
                    <button className="perm-toggle-btn" onClick={toggleExecution}>
                        {agentStatus.executionGranted ? "REVOKE" : "AUTHORIZE"}
                    </button>
                </div>
            </div>

            <div className="section-divider"></div>

            {/* Quota Section */}
            <div className="quota-section">
                <h3>Resource Quotas</h3>
                <div className="quota-grid">
                    {quotas.map(q => {
                        const pct = (q.used / q.total) * 100;
                        return (
                            <div key={q.id} className="quota-card">
                                <div className="quota-header">
                                    <div className="quota-icon">{q.icon}</div>
                                    <span className="quota-label">{q.label}</span>
                                </div>
                                <div className="progress-bar-bg">
                                    <div className={`progress-bar-fill ${pct > 80 ? 'warning' : ''}`} style={{ width: `${pct}%` }}></div>
                                </div>
                                <div className="quota-stats">
                                    {q.total - q.used} remaining
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <style jsx>{`
                .mission-control { padding: 16px; padding-bottom: 80px; }
                h3 { margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; color: var(--md-sys-color-outline); font-weight: 700; letter-spacing: 0.5px; }
                
                .permission-section { margin-bottom: 24px; }
                .permission-card { display: flex; align-items: center; gap: 16px; padding: 16px; border-radius: 12px; border: 1px solid; transition: all 0.2s; }
                .permission-card.granted { background: rgba(76, 175, 80, 0.1); border-color: rgba(76, 175, 80, 0.3); }
                .permission-card.revoked { background: rgba(244, 67, 54, 0.1); border-color: rgba(244, 67, 54, 0.3); }
                
                .perm-icon { padding: 10px; border-radius: 50%; }
                .granted .perm-icon { background: rgba(76, 175, 80, 0.2); color: #4caf50; }
                .revoked .perm-icon { background: rgba(244, 67, 54, 0.2); color: #f44336; }
                
                .perm-info { flex: 1; }
                .perm-title { font-weight: 600; font-size: 16px; margin-bottom: 4px; }
                .perm-desc { font-size: 13px; opacity: 0.8; }
                
                .perm-toggle-btn { padding: 8px 16px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; font-size: 13px; }
                .granted .perm-toggle-btn { background: #f44336; color: white; }
                .revoked .perm-toggle-btn { background: #4caf50; color: white; }

                /* Quotas */
                .quota-grid { display: grid; grid-template-columns: 1fr; gap: 12px; margin-bottom: 24px; }
                .quota-card { background: var(--md-sys-color-surface-variant); padding: 12px; border-radius: 12px; }
                .quota-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; color: var(--md-sys-color-on-surface-variant); font-size: 13px; font-weight: 500; }
                .progress-bar-bg { height: 6px; background: rgba(0,0,0,0.1); border-radius: 3px; overflow: hidden; margin-bottom: 6px; }
                .progress-bar-fill { height: 100%; background: var(--md-sys-color-primary); border-radius: 3px; }
                .progress-bar-fill.warning { background: #d93025; }
                .quota-stats { font-size: 11px; color: var(--md-sys-color-outline); text-align: right; font-family: monospace; }
        
                .section-divider { height: 1px; background: var(--md-sys-color-outline-variant); margin: 0 -16px 24px -16px; }
            `}</style>
        </div>
    );
};
