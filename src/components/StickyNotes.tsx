import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StickyNote, Plus, X, Edit2, Save } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';

interface Note {
  id: string;
  content: string;
  color: string;
  createdAt: string;
}

const COLORS = [
  'bg-yellow-100 dark:bg-yellow-900/50',
  'bg-pink-100 dark:bg-pink-900/50',
  'bg-blue-100 dark:bg-blue-900/50',
  'bg-green-100 dark:bg-green-900/50',
  'bg-purple-100 dark:bg-purple-900/50',
];

const StickyNotes: React.FC = () => {
  const [notes, setNotes] = useLocalStorage<Note[]>('stickyNotes', []);
  const [isAdding, setIsAdding] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const addNote = () => {
    if (!newNoteContent.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(),
      content: newNoteContent.trim(),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      createdAt: new Date().toISOString(),
    };

    setNotes(prev => [newNote, ...prev]);
    setNewNoteContent('');
    setIsAdding(false);
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const startEditing = (note: Note) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  const saveEdit = (id: string) => {
    if (!editContent.trim()) return;
    
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, content: editContent.trim() } : note
    ));
    setEditingId(null);
  };

  return (
    <div className="w-full space-y-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsAdding(true)}
        className="w-full flex items-center justify-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:text-white"
      >
        <Plus size={20} className="mr-2" />
        Add Note
      </motion.button>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg shadow-lg p-4 dark:bg-gray-800"
          >
            <textarea
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Write your note..."
              className="w-full h-24 p-2 mb-2 border rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsAdding(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={addNote}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </motion.div>
        )}

        {notes.map((note) => (
          <motion.div
            key={note.id}
            layout
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className={`${note.color} p-4 rounded-lg shadow-md relative`}
          >
            {editingId === note.id ? (
              <div>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full h-24 p-2 mb-2 border rounded-md resize-none bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  autoFocus
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => saveEdit(note.id)}
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="whitespace-pre-wrap mb-2 dark:text-gray-200">
                  {note.content}
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                  <div className="space-x-1">
                    <button
                      onClick={() => startEditing(note)}
                      className="p-1 hover:text-gray-800 dark:hover:text-gray-200"
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="p-1 hover:text-red-600 dark:hover:text-red-400"
                      title="Delete"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default StickyNotes;
