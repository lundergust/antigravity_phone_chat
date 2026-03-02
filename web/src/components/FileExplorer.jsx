import React, { useState, useEffect } from 'react';
import { Folder, FileCode, ChevronRight, ChevronDown, Save, X, Edit3, File as FileIcon } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { useSocket } from '../context/SocketContext';
import { GitControl } from './GitControl';

const FileItem = ({ item, level, onFileClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isFolder = item.type === 'folder';

    const handleClick = () => {
        if (isFolder) setIsOpen(!isOpen);
        else onFileClick(item);
    };

    return (
        <div className="file-item-container">
            <div
                className="file-row"
                style={{ paddingLeft: `${level * 12 + 12}px` }}
                onClick={handleClick}
            >
                <span className="icon">
                    {isFolder ? (isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />) : <span style={{ width: 14 }} />}
                </span>
                <span className="type-icon">
                    {isFolder ? <Folder size={16} fill="#cae6ff" stroke="#006492" /> : <FileCode size={16} />}
                </span>
                <span className="filename">{item.name}</span>
            </div>
            {isOpen && item.children && item.children.map(child => (
                <FileItem key={child.path} item={child} level={level + 1} onFileClick={onFileClick} />
            ))}
        </div>
    );
};

export const FileExplorer = () => {
    const { send, subscribe } = useSocket();
    const [files, setFiles] = useState([]);
    const [activeFile, setActiveFile] = useState(null);
    const [editorContent, setEditorContent] = useState('');
    const [originalContent, setOriginalContent] = useState('');
    const [isDirty, setIsDirty] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Subscribe to FS events
        const unsubList = subscribe('fs:list:response', (msg) => {
            setFiles(msg.files);
            setIsLoading(false);
        });

        const unsubRead = subscribe('fs:read:response', (msg) => {
            setEditorContent(msg.content);
            setOriginalContent(msg.content);
            setActiveFile(prev => ({ ...prev, content: msg.content })); // Cache locally
            setIsDirty(false);
        });

        const unsubWrite = subscribe('fs:write:success', (msg) => {
            setOriginalContent(editorContent);
            setIsDirty(false);
            // Optional: show toast
        });

        // Initial fetch
        setIsLoading(true);
        send('fs:list', { path: '' });

        return () => {
            unsubList();
            unsubRead();
            unsubWrite();
        };
    }, [subscribe, send, editorContent]);

    const handleFileClick = (file) => {
        if (activeFile && isDirty) {
            if (!confirm("You have unsaved changes. Discard?")) return;
        }

        setActiveFile(file);
        setEditorContent('Loading...');
        setIsDirty(false);
        send('fs:read', { path: file.path });
    };

    const handleSave = () => {
        if (!activeFile) return;
        send('fs:write', { path: activeFile.path, content: editorContent });
    };

    const closeFile = () => {
        if (isDirty && !confirm("Discard changes?")) return;
        setActiveFile(null);
        setEditorContent('');
        setIsDirty(false);
    };

    return (
        <div className="file-explorer-layout">
            <div className="sidebar">
                <GitControl />

                <div className="explorer-header">
                    <span>Files</span>
                    <button onClick={() => send('fs:list', { path: '' })} className="refresh-icon-btn">
                        <RefreshIcon />
                    </button>
                </div>

                <div className="file-tree">
                    {files.map(item => (
                        <FileItem key={item.path} item={item} level={0} onFileClick={handleFileClick} />
                    ))}
                    {files.length === 0 && !isLoading && <div className="empty-state">No files found</div>}
                    {isLoading && <div className="loading-state">Loading...</div>}
                </div>
            </div>

            <div className="main-editor-area">
                {activeFile ? (
                    <div className="editor-container">
                        <div className="editor-tab-bar">
                            <div className="tab active">
                                <FileIcon size={14} className="tab-icon" />
                                <span className="tab-name">{activeFile.name}</span>
                                {isDirty && <span className="dirty-indicator">●</span>}
                                <button className="close-tab" onClick={closeFile}><X size={14} /></button>
                            </div>
                            <div className="editor-toolbar">
                                <button onClick={handleSave} disabled={!isDirty} className={`save-btn ${isDirty ? 'primary' : ''}`}>
                                    <Save size={16} /> Save
                                </button>
                            </div>
                        </div>
                        <div className="monaco-wrapper">
                            <Editor
                                height="100%"
                                defaultLanguage="javascript" // TODO: Detect language from extension
                                path={activeFile.name}
                                value={editorContent}
                                onChange={(value) => {
                                    setEditorContent(value);
                                    setIsDirty(value !== originalContent);
                                }}
                                theme="vs-dark"
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    wordWrap: 'on',
                                    scrollBeyondLastLine: false,
                                }}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="empty-editor">
                        <div className="empty-content">
                            <img src="https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg" alt="Logo" style={{ opacity: 0.3, marginBottom: 16 }} />
                            <h3>Select a file to edit</h3>
                            <p>Use the file explorer on the left to navigate the codebase.</p>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .file-explorer-layout { display: flex; height: 100%; overflow: hidden; }
                .sidebar { width: 250px; border-right: 1px solid var(--md-sys-color-outline-variant); display: flex; flex-direction: column; background: var(--md-sys-color-surface); }
                .explorer-header { padding: 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--md-sys-color-outline); letter-spacing: 0.5px; display: flex; justify-content: space-between; align-items: center; }
                .file-tree { flex: 1; overflow-y: auto; padding-bottom: 12px; }
                
                .file-row { display: flex; align-items: center; gap: 6px; padding: 6px 12px; cursor: pointer; color: var(--md-sys-color-on-surface); font-size: 13px; }
                .file-row:hover { background: rgba(0,0,0,0.04); }
                .file-row .icon { color: var(--md-sys-color-outline); display: flex; }
                
                .main-editor-area { flex: 1; background: #1e1e1e; display: flex; flex-direction: column; }
                .editor-container { display: flex; flex-direction: column; height: 100%; }
                
                .editor-tab-bar { display: flex; justify-content: space-between; background: #252526; height: 35px; }
                .tab { display: flex; align-items: center; gap: 8px; padding: 0 12px; background: #1e1e1e; color: #fff; border-top: 2px solid var(--md-sys-color-primary); font-size: 13px; min-width: 120px; }
                .tab-icon { opacity: 0.7; }
                .dirty-indicator { font-size: 10px; color: var(--md-sys-color-on-primary-container); }
                .close-tab { background: none; border: none; color: #ccc; cursor: pointer; margin-left: auto; display: flex; opacity: 0.7; }
                .close-tab:hover { opacity: 1; background: rgba(255,255,255,0.1); border-radius: 4px; }
                
                .editor-toolbar { display: flex; align-items: center; padding-right: 8px; }
                .save-btn { display: flex; align-items: center; gap: 6px; background: none; border: none; color: #ccc; cursor: pointer; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
                .save-btn.primary { color: var(--md-sys-color-primary); font-weight: 500; }
                .save-btn:hover { background: rgba(255,255,255,0.05); }
                
                .monaco-wrapper { flex: 1; overflow: hidden; }
                
                .empty-editor { display: flex; align-items: center; justify-content: center; height: 100%; color: var(--md-sys-color-outline); background: var(--md-sys-color-surface-variant); }
                .empty-content { text-align: center; }
                .refresh-icon-btn { background: none; border: none; cursor: pointer; color: inherit; padding: 0; }
            `}</style>
        </div>
    );
};

const RefreshIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 4v6h-6"></path>
        <path d="M1 20v-6h6"></path>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
    </svg>
);
