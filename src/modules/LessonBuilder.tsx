import React, { useState } from 'react';
import { UniversalLearningObject } from '../types/ulo';
import { Plus, Play, Sparkles } from 'lucide-react';

interface ModuleProps {
  ulos: UniversalLearningObject[];
}

export const LessonBuilderView: React.FC<ModuleProps> = ({ ulos }) => {
  const lesson = ulos.find((u) => u.subtype === 'LESSON') || ulos[0];
  const [blocks, setBlocks] = useState<Array<{ id: string; type: string; title: string; content: string }>>([
    { id: 'b1', type: 'heading', title: 'H1', content: 'Ordering Coffee in Madrid' },
    { id: 'b2', type: 'dialogue', title: 'Dialogue Block', content: 'Camarero: ¿Qué le pongo? \nCliente: Un café con leche, por favor.' },
    { id: 'b3', type: 'gap_fill', title: 'Gap Fill Exercise', content: 'El cliente pide un ___ (café) con leche.' },
  ]);

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Top Controls */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            {lesson.cid}
          </span>
          <h1 className="text-2xl font-bold text-slate-100 mt-1">{lesson.metadata.title}</h1>
          <p className="text-xs text-slate-400">100% JSON Block Engine • Notion-style Slash Command Editor</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1">
            <Play className="w-3.5 h-3.5" />
            <span>Preview Mode</span>
          </button>
          <button className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-3 py-1.5 rounded-lg text-xs">
            Publish ULO
          </button>
        </div>
      </div>

      {/* Editor Canvas */}
      <div className="space-y-4">
        {blocks.map((block) => (
          <div
            key={block.id}
            className="group relative p-4 bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 rounded-xl transition space-y-2"
          >
            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <span className="font-mono uppercase font-semibold">{block.title}</span>
              <span className="opacity-0 group-hover:opacity-100 transition cursor-grab">⋮⋮ Drag</span>
            </div>
            <textarea
              value={block.content}
              onChange={(e) => {
                const next = [...blocks];
                const found = next.find((b) => b.id === block.id);
                if (found) found.content = e.target.value;
                setBlocks(next);
              }}
              rows={2}
              className="w-full bg-slate-950/60 border border-slate-800/60 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
        ))}

        {/* Slash Menu Hint */}
        <div className="p-3 border border-dashed border-slate-800 rounded-xl text-center text-xs text-slate-500 hover:border-slate-700 transition cursor-pointer flex items-center justify-center space-x-2">
          <Plus className="w-4 h-4 text-slate-400" />
          <span>Type <kbd className="bg-slate-800 text-slate-300 px-1 py-0.5 rounded text-[10px]">/</kbd> for 24 educational blocks (Gap Fill, IPA, Dialogue, Minimal Pairs)</span>
        </div>
      </div>
    </div>
  );
};
