import { useState, useEffect, useRef } from 'react';

interface Note {
  id: number;
  content: string;
  timestamp: string;
}

interface TerminalLine {
  id: number;
  type: 'command' | 'output' | 'error';
  content: string;
  timestamp?: string;
}

export default function TerminalApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<TerminalLine[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock data for development
  useEffect(() => {
    const mockNotes: Note[] = [
      {
        id: 1,
        content: "First note - testing the terminal interface",
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 2,
        content: "Second note with some longer content to test how it displays in the terminal",
        timestamp: new Date(Date.now() - 1800000).toISOString()
      },
      {
        id: 3,
        content: "Latest note",
        timestamp: new Date().toISOString()
      }
    ];
    setNotes(mockNotes);
    
    // Welcome message
    addToHistory('Welcome to Notes Terminal v1.0.0', 'output');
    addToHistory('Type "help" for available commands', 'output');
    addToHistory('', 'output');
  }, []);

  const addToHistory = (content: string, type: TerminalLine['type'] = 'output') => {
    setTerminalHistory(prev => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        type,
        content,
        timestamp: new Date().toISOString()
      }
    ]);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const executeCommand = (input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return;

    // Add command to history
    addToHistory(`user@notes-app:~$ ${trimmed}`, 'command');
    setCommandHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    const [command, ...args] = trimmed.split(' ');
    
    switch (command.toLowerCase()) {
      case 'help':
        addToHistory('Available commands:', 'output');
        addToHistory('  ls              - list all notes', 'output');
        addToHistory('  cat <id>        - display note content', 'output');
        addToHistory('  nano [content]  - create a new note', 'output');
        addToHistory('  rm <id>         - delete a note', 'output');
        addToHistory('  clear           - clear terminal screen', 'output');
        addToHistory('  date            - show current date/time', 'output');
        addToHistory('  whoami          - display current user', 'output');
        addToHistory('  pwd             - print working directory', 'output');
        addToHistory('  echo <text>     - display text', 'output');
        break;

      case 'ls':
        if (notes.length === 0) {
          addToHistory('No notes found.', 'output');
        } else {
          addToHistory(`total ${notes.length} notes`, 'output');
          addToHistory('', 'output');
          addToHistory('ID   SIZE  MODIFIED         CONTENT', 'output');
          addToHistory('────────────────────────────────────────────────────────────', 'output');
          notes.forEach(note => {
            const size = note.content.length.toString().padStart(4);
            const modified = formatTimestamp(note.timestamp).padEnd(16);
            const preview = note.content.length > 40 
              ? note.content.substring(0, 37) + '...'
              : note.content;
            addToHistory(`${note.id.toString().padEnd(4)} ${size}  ${modified} ${preview}`, 'output');
          });
        }
        break;

      case 'cat':
        const catId = parseInt(args[0]);
        if (!catId) {
          addToHistory('Usage: cat <note_id>', 'error');
        } else {
          const note = notes.find(n => n.id === catId);
          if (!note) {
            addToHistory(`cat: note ${catId}: No such note`, 'error');
          } else {
            addToHistory(`────── Note ${note.id} ──────`, 'output');
            addToHistory(`Created: ${formatTimestamp(note.timestamp)}`, 'output');
            addToHistory('', 'output');
            addToHistory(note.content, 'output');
            addToHistory('', 'output');
            addToHistory('──────────────────', 'output');
          }
        }
        break;

      case 'nano':
        if (args.length === 0) {
          addToHistory('Usage: nano <content>', 'error');
          addToHistory('Example: nano "This is my new note"', 'error');
        } else {
          const content = args.join(' ').replace(/^["']|["']$/g, '');
          const newNote: Note = {
            id: Date.now(),
            content,
            timestamp: new Date().toISOString()
          };
          setNotes(prev => [newNote, ...prev]);
          addToHistory(`Note created with ID: ${newNote.id}`, 'output');
        }
        break;

      case 'rm':
        const rmId = parseInt(args[0]);
        if (!rmId) {
          addToHistory('Usage: rm <note_id>', 'error');
        } else {
          const noteIndex = notes.findIndex(n => n.id === rmId);
          if (noteIndex === -1) {
            addToHistory(`rm: note ${rmId}: No such note`, 'error');
          } else {
            setNotes(prev => prev.filter(n => n.id !== rmId));
            addToHistory(`Note ${rmId} deleted`, 'output');
          }
        }
        break;

      case 'clear':
        setTerminalHistory([]);
        break;

      case 'date':
        addToHistory(new Date().toString(), 'output');
        break;

      case 'whoami':
        addToHistory('user', 'output');
        break;

      case 'pwd':
        addToHistory('/home/user/notes', 'output');
        break;

      case 'echo':
        addToHistory(args.join(' '), 'output');
        break;

      default:
        addToHistory(`${command}: command not found`, 'error');
        addToHistory('Type "help" for available commands', 'output');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput);
      setCurrentInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  // Focus input on mount and clicks
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div 
      className="min-h-screen bg-terminal-bg text-terminal-text font-mono cursor-text"
      onClick={handleTerminalClick}
    >
      <div className="terminal-window max-w-6xl mx-auto">
        {/* Terminal Header */}
        <div className="bg-terminal-bg-alt border-b border-terminal-border p-3">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-3 h-3 rounded-full bg-terminal-red"></div>
              <div className="w-3 h-3 rounded-full bg-terminal-yellow"></div>
              <div className="w-3 h-3 rounded-full bg-terminal-green"></div>
            </div>
            <span className="text-terminal-text-dim text-sm">notes-app — terminal</span>
          </div>
        </div>
        
        {/* Terminal Content */}
        <div 
          ref={terminalRef}
          className="p-4 h-[calc(100vh-100px)] overflow-y-auto"
        >
          {/* Terminal History */}
          <div className="space-y-1">
            {terminalHistory.map((line) => (
              <div key={line.id} className="terminal-line">
                <span className={`
                  ${line.type === 'command' ? 'text-terminal-prompt' : ''}
                  ${line.type === 'error' ? 'text-terminal-red' : ''}
                  ${line.type === 'output' ? 'text-terminal-text' : ''}
                `}>
                  {line.content}
                </span>
              </div>
            ))}
          </div>
          
          {/* Current Input Line */}
          <div className="flex items-center terminal-line">
            <span className="text-terminal-prompt mr-2">user@notes-app:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-terminal-text font-mono"
              spellCheck={false}
              autoComplete="off"
            />
            <span className="animate-blink text-terminal-cursor">█</span>
          </div>
        </div>
        
        {/* Status Bar */}
        <div className="bg-terminal-bg-alt border-t border-terminal-border px-4 py-1">
          <div className="flex items-center justify-between text-xs text-terminal-text-dim">
            <span>Notes Terminal v1.0.0</span>
            <span>{notes.length} notes • Type 'help' for commands</span>
          </div>
        </div>
      </div>
    </div>
  );
}