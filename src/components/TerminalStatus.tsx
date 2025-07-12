import { useEffect, useState } from 'react';

interface TerminalStatusProps {
  notesCount: number;
}

const TerminalStatus = ({ notesCount }: TerminalStatusProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="terminal-window p-3 mb-4">
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center space-x-4">
          <span className="text-terminal-text-dim">Status:</span>
          <span className="text-terminal-green">● ONLINE</span>
          <span className="text-terminal-text-dim">|</span>
          <span className="text-terminal-text-dim">Notes:</span>
          <span className="text-terminal-cyan">{notesCount}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-terminal-text-dim">Local Time:</span>
          <span className="text-terminal-yellow">
            {currentTime.toLocaleTimeString()}
          </span>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-terminal-text-dim">
        ─────────────────────────────────────────────────────────────────
      </div>
    </div>
  );
};

export default TerminalStatus;