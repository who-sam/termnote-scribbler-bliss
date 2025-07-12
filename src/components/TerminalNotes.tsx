import { useState } from 'react';

interface Note {
  id: number;
  content: string;
  timestamp: string;
}

interface TerminalNotesProps {
  notes: Note[];
  onEdit: (id: number, content: string) => void;
  onDelete: (id: number) => void;
}

const TerminalNotes = ({ notes, onEdit, onDelete }: TerminalNotesProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  const saveEdit = () => {
    if (editingId && editContent.trim()) {
      onEdit(editingId, editContent.trim());
      setEditingId(null);
      setEditContent('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const confirmDelete = (id: number) => {
    if (window.confirm('Delete this note? [y/N]')) {
      onDelete(id);
    }
  };

  if (notes.length === 0) {
    return (
      <div className="terminal-window p-4">
        <div className="text-terminal-text-dim text-sm mb-2">
          ┌─ NOTES DATABASE ─────────────────────────────────────────────┐
        </div>
        <div className="text-terminal-text-dim text-center py-8">
          <div>No notes found in database.</div>
          <div className="mt-2">&gt; Add your first note above to get started.</div>
        </div>
        <div className="text-terminal-text-dim text-sm mt-2">
          └──────────────────────────────────────────────────────────────┘
        </div>
      </div>
    );
  }

  return (
    <div className="terminal-window p-4">
      <div className="text-terminal-text-dim text-sm mb-2">
        ┌─ NOTES DATABASE ─────────────────────────────────────────────┐
      </div>
      
      <div className="text-terminal-yellow text-sm mb-3">
        &gt; Found {notes.length} note{notes.length !== 1 ? 's' : ''} (newest first)
      </div>
      
      <div className="space-y-3">
        {notes.map((note) => (
          <div key={note.id} className="border-l-2 border-terminal-border pl-4">
            <div className="terminal-line">
              <span className="text-terminal-text-dim">[</span>
              <span className="text-terminal-cyan">{note.id.toString().padStart(3, '0')}</span>
              <span className="text-terminal-text-dim">] </span>
              <span className="text-terminal-amber">{note.timestamp}</span>
            </div>
            
            {editingId === note.id ? (
              <div className="mt-2 space-y-2">
                <div className="text-terminal-yellow text-sm">
                  &gt; Editing note #{note.id}:
                </div>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="terminal-input w-full h-20 p-2 bg-terminal-bg-alt border border-terminal-border resize-none focus:ring-1 focus:ring-terminal-green focus:border-terminal-green"
                  rows={3}
                />
                <div className="flex gap-2">
                  <button
                    onClick={saveEdit}
                    className="terminal-button px-3 py-1 text-terminal-green"
                  >
                    [ update ]
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="terminal-button px-3 py-1 text-terminal-red"
                  >
                    [ cancel ]
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-1">
                <div className="terminal-line">
                  <span className="text-terminal-text">&gt; </span>
                  <span className="text-terminal-text whitespace-pre-wrap">{note.content}</span>
                </div>
                <div className="mt-2 flex gap-2 text-xs">
                  <button
                    onClick={() => startEdit(note)}
                    className="text-terminal-cyan hover:text-terminal-yellow transition-colors"
                    title="Edit note"
                  >
                    [edit id={note.id}]
                  </button>
                  <button
                    onClick={() => confirmDelete(note.id)}
                    className="text-terminal-red hover:text-terminal-yellow transition-colors"
                    title="Delete note"
                  >
                    [delete id={note.id}]
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="text-terminal-text-dim text-sm mt-4">
        └──────────────────────────────────────────────────────────────┘
      </div>
    </div>
  );
};

export default TerminalNotes;