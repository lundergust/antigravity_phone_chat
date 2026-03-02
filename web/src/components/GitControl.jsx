import React, { useState, useEffect } from 'react';
import { GitBranch, RefreshCw, Check, ArrowRight } from 'lucide-react';
import { useSocket } from '../context/SocketContext';

export const GitControl = () => {
    const { send, subscribe } = useSocket();
    const [branches, setBranches] = useState({ all: [], current: '' });
    const [status, setStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const unsubBranches = subscribe('git:branches:response', (msg) => {
            setBranches(msg.branches);
            setIsLoading(false);
        });

        const unsubStatus = subscribe('git:status:response', (msg) => {
            setStatus(msg.status);
            setIsLoading(false);
        });

        // Initial fetch
        refresh();

        return () => {
            unsubBranches();
            unsubStatus();
        };
    }, [subscribe]);

    const refresh = () => {
        setIsLoading(true);
        send('git:branches');
        send('git:status');
    };

    const handleCheckout = (branchName) => {
        if (confirm(`Switch to branch '${branchName}'? Unsaved changes might be lost.`)) {
            setIsLoading(true);
            send('git:checkout', { branch: branchName });
        }
    };

    return (
        <div className="git-control">
            <div className="git-header">
                <div className="header-title">
                    <GitBranch size={16} />
                    <span>Source Control</span>
                </div>
                <button onClick={refresh} className="refresh-btn" disabled={isLoading}>
                    <RefreshCw size={14} className={isLoading ? 'spin' : ''} />
                </button>
            </div>

            <div className="current-branch">
                <span className="label">Current:</span>
                <span className="value">{branches.current || 'Unknown'}</span>
            </div>

            <div className="branch-list">
                <div className="list-header">Branches</div>
                {branches.all.map(branch => (
                    <div key={branch} className={`branch-item ${branch === branches.current ? 'active' : ''}`}>
                        <span className="branch-name">{branch}</span>
                        {branch === branches.current ? (
                            <Check size={14} className="current-icon" />
                        ) : (
                            <button className="checkout-btn" onClick={() => handleCheckout(branch)}>
                                <ArrowRight size={14} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <style jsx>{`
                .git-control {
                    background: var(--md-sys-color-surface);
                    border-bottom: 1px solid var(--md-sys-color-outline-variant);
                    padding: 12px;
                }
                .git-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                }
                .header-title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 600;
                    font-size: 14px;
                }
                .refresh-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: var(--md-sys-color-on-surface-variant);
                    padding: 4px;
                }
                .spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin { 100% { transform: rotate(360deg); } }
                
                .current-branch {
                    display: flex;
                    gap: 8px;
                    font-size: 12px;
                    margin-bottom: 12px;
                    padding: 8px;
                    background: var(--md-sys-color-secondary-container);
                    color: var(--md-sys-color-on-secondary-container);
                    border-radius: 6px;
                }
                .label { font-weight: 600; }
                
                .branch-list {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    max-height: 150px;
                    overflow-y: auto;
                }
                .list-header {
                    font-size: 11px;
                    text-transform: uppercase;
                    color: var(--md-sys-color-outline);
                    margin-bottom: 4px;
                }
                .branch-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 6px 8px;
                    border-radius: 4px;
                    font-size: 13px;
                }
                .branch-item:hover {
                    background: rgba(0,0,0,0.05);
                }
                .branch-item.active {
                    background: rgba(0,0,0,0.05);
                    font-weight: 500;
                }
                .checkout-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: var(--md-sys-color-primary);
                    padding: 2px;
                }
            `}</style>
        </div>
    );
};
