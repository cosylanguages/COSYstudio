import React, { useState, useEffect } from 'react';
import { Search, Sparkles, X } from 'lucide-react';
import { MOCK_ULOS } from '../data/mockUlos';
import { ModuleId } from './Navigation';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModule: (mod: ModuleId) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectModule,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          /* Handled in parent */
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredUlos = MOCK_ULOS.filter(
    (u) =>
      u.metadata.title.toLowerCase().includes(query.toLowerCase()) ||
      u.cid.toLowerCase().includes(query.toLowerCase()) ||
      u.subtype.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Header */}
        <div className="p-3 border-b border-slate-800 flex items-center space-x-3 bg-slate-950/50">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ULOs, commands, or AI actions... (e.g. 'Coffee', 'cid_ulo', 'B1')"
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
          />
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          <div className="px-2 py-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Universal Learning Objects
          </div>
          {filteredUlos.length > 0 ? (
            filteredUlos.map((ulo) => (
              <div
                key={ulo.cid}
                onClick={() => {
                  onSelectModule('content_library');
                  onClose();
                }}
                className="px-3 py-2 rounded-lg hover:bg-slate-800 flex items-center justify-between cursor-pointer transition text-xs"
              >
                <div className="flex items-center space-x-3">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px]">
                    {ulo.subtype}
                  </span>
                  <span className="font-medium text-slate-200">{ulo.metadata.title}</span>
                </div>
                <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                  <span className="bg-slate-800 px-1.5 py-0.5 rounded">{ulo.metadata.cefrLevel}</span>
                  <span className="font-mono">{ulo.cid}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-xs text-slate-500">No matching ULOs found</div>
          )}

          <div className="px-2 pt-3 py-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Quick Navigation Actions
          </div>
          <div
            onClick={() => {
              onSelectModule('lesson_builder');
              onClose();
            }}
            className="px-3 py-2 rounded-lg hover:bg-slate-800 flex items-center justify-between cursor-pointer text-xs text-slate-300"
          >
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Create New Interactive Lesson</span>
            </div>
            <kbd className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">↵</kbd>
          </div>
        </div>
      </div>
    </div>
  );
};
