import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import TerminalHeader from './TerminalHeader';
import TerminalStatus from './TerminalStatus';
import TerminalInput from './TerminalInput';
import TerminalNotes from './TerminalNotes';

interface Note {
  id: number;
  content: string;
  timestamp: string;
}

const TerminalApp = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock data for demo (replace with actual API calls)
  useEffect(() => {
    // Simulate loading notes from backend
    const mockNotes: Note[] = [
      {
        id: 3,
        content: "Remember to implement the Flask backend API endpoints:\n- GET / for fetching all notes\n- POST / for creating new notes\n- GET/POST /edit/<id> for editing notes",
        timestamp: new Date(Date.now() - 3600000).toLocaleString()
      },
      {
        id: 2,
        content: "Terminal styling is complete! The interface now looks like a real command-line application with proper monospace fonts and terminal colors.",
        timestamp: new Date(Date.now() - 7200000).toLocaleString()
      },
      {
        id: 1,
        content: "Started building the terminal-style note taking app. Need to focus on authentic CLI aesthetics.",
        timestamp: new Date(Date.now() - 10800000).toLocaleString()
      }
    ];
    
    setNotes(mockNotes);
  }, []);

  const addNote = async (content: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newNote: Note = {
        id: Math.max(...notes.map(n => n.id), 0) + 1,
        content,
        timestamp: new Date().toLocaleString()
      };
      
      setNotes(prev => [newNote, ...prev]);
      
      toast({
        title: "Note added successfully",
        description: `Note #${newNote.id} has been saved to the database.`,
        className: "bg-terminal-bg border-terminal-green text-terminal-text font-mono"
      });
    } catch (error) {
      toast({
        title: "Error adding note",
        description: "Failed to save note to database.",
        variant: "destructive",
        className: "bg-terminal-bg border-terminal-red text-terminal-text font-mono"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const editNote = async (id: number, content: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setNotes(prev => prev.map(note => 
        note.id === id 
          ? { ...note, content, timestamp: new Date().toLocaleString() }
          : note
      ));
      
      toast({
        title: "Note updated successfully",
        description: `Note #${id} has been modified.`,
        className: "bg-terminal-bg border-terminal-green text-terminal-text font-mono"
      });
    } catch (error) {
      toast({
        title: "Error updating note",
        description: "Failed to update note in database.",
        variant: "destructive",
        className: "bg-terminal-bg border-terminal-red text-terminal-text font-mono"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNote = async (id: number) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setNotes(prev => prev.filter(note => note.id !== id));
      
      toast({
        title: "Note deleted",
        description: `Note #${id} has been removed from database.`,
        className: "bg-terminal-bg border-terminal-red text-terminal-text font-mono"
      });
    } catch (error) {
      toast({
        title: "Error deleting note",
        description: "Failed to delete note from database.",
        variant: "destructive",
        className: "bg-terminal-bg border-terminal-red text-terminal-text font-mono"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-terminal-bg p-4">
      <div className="max-w-4xl mx-auto">
        <TerminalHeader />
        <TerminalStatus notesCount={notes.length} />
        
        {isLoading && (
          <div className="terminal-window p-4 mb-4">
            <div className="text-terminal-yellow text-sm">
              <span className="animate-pulse">&gt; Processing request...</span>
              <span className="animate-blink ml-2">█</span>
            </div>
          </div>
        )}
        
        <TerminalInput 
          onSubmit={addNote}
          placeholder="Type your note content here..."
        />
        
        <TerminalNotes 
          notes={notes}
          onEdit={editNote}
          onDelete={deleteNote}
        />
        
        <div className="terminal-window p-3 mt-4">
          <div className="text-terminal-text-dim text-xs text-center">
            Terminal Notes v1.0 │ Ready for Flask backend integration │ Press Ctrl+C to exit
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalApp;