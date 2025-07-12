import { useEffect, useState } from 'react';

const TerminalHeader = () => {
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="terminal-window p-4 mb-4">
      <div className="text-terminal-text-dim text-sm mb-2">
        ╭─────────────────────────────────────────────────────────────╮
      </div>
      <div className="text-terminal-text-dim text-sm mb-2">
        │                     NOTES TERMINAL v1.0                     │
      </div>
      <div className="text-terminal-text-dim text-sm mb-4">
        ╰─────────────────────────────────────────────────────────────╯
      </div>
      
      <div className="terminal-line">
        <span className="text-terminal-prompt">user@notes-app</span>
        <span className="text-terminal-text-dim">:</span>
        <span className="text-terminal-blue">~</span>
        <span className="text-terminal-text-dim">$ </span>
        <span className="text-terminal-text">Welcome to your personal note terminal</span>
        {showCursor && <span className="text-terminal-cursor">█</span>}
      </div>
      
      <div className="terminal-line mt-2">
        <span className="text-terminal-text-dim"># Available commands: add, edit, list, help</span>
      </div>
      
      <div className="terminal-line">
        <span className="text-terminal-text-dim"># Type your notes below and press [Enter] to save</span>
      </div>
      
      <div className="mt-4 border-t border-terminal-border pt-2">
        <span className="text-terminal-text-dim">Last login: </span>
        <span className="text-terminal-yellow">{new Date().toLocaleString()}</span>
      </div>
    </div>
  );
};

export default TerminalHeader;