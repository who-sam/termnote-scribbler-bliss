import { useState } from 'react';

interface TerminalInputProps {
  onSubmit: (content: string) => void;
  placeholder?: string;
}

const TerminalInput = ({ onSubmit, placeholder = "Enter your note..." }: TerminalInputProps) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content.trim());
      setContent('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="terminal-window p-4 mb-4">
      <div className="text-terminal-text-dim text-sm mb-2">
        ┌─ INPUT ──────────────────────────────────────────────────────┐
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="terminal-line">
          <span className="text-terminal-prompt">user@notes-app</span>
          <span className="text-terminal-text-dim">:</span>
          <span className="text-terminal-blue">~</span>
          <span className="text-terminal-text-dim">$ </span>
          <span className="text-terminal-text">note --add</span>
        </div>
        
        <div className="ml-4">
          <label className="text-terminal-yellow text-sm block mb-2">
            &gt; Enter your note below:
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="terminal-input w-full h-24 p-2 bg-terminal-bg-alt border border-terminal-border resize-none focus:ring-1 focus:ring-terminal-green focus:border-terminal-green"
            rows={3}
          />
          <div className="text-terminal-text-dim text-xs mt-1">
            Ctrl+Enter to submit
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <button
            type="submit"
            className="terminal-button px-4 py-1"
            disabled={!content.trim()}
          >
            [ Enter ]
          </button>
          <span className="text-terminal-text-dim text-sm">
            {content.length} characters
          </span>
        </div>
      </form>
      
      <div className="text-terminal-text-dim text-sm mt-2">
        └──────────────────────────────────────────────────────────────┘
      </div>
    </div>
  );
};

export default TerminalInput;