import React, { useState } from 'react';
import { UniversalLearningObject } from '../types/ulo';
import { AI_ACTIONS } from '../types/ai';

interface InspectorPanelProps {
  selectedUlo: UniversalLearningObject | null;
  onClose: () => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({ selectedUlo, onClose }) => {
  const [activeTab, setActiveTab] = useState<'properties' | 'ai'>('properties');

  if (!selectedUlo) return null;

  return (
    <aside className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full text-xs">
      {/* Header Tabs */}
      <div className="h-12 border-b border-slate-800 flex items-center justify-between px-3 bg-slate-950/40">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('properties')}
            className={`px-3 py-1 rounded text-xs font-medium transition ${
              activeTab === 'properties'
                ? 'bg-slate-800 text-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Properties
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-3 py-1 rounded text-xs font-medium transition ${
              activeTab === 'ai'
                ? 'bg-slate-800 text-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            AI Co-Pilot
          </button>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
          ✕
        </button>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'properties' ? (
          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-slate-500 font-semibold uppercase">Content Identifier (CID)</label>
              <div className="font-mono text-slate-200 bg-slate-950 px-2 py-1 rounded border border-slate-800 mt-1">
                {selectedUlo.cid}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 font-semibold uppercase">CEFR Level</label>
                <div className="text-slate-200 bg-slate-950 px-2 py-1 rounded border border-slate-800 mt-1">
                  {selectedUlo.metadata.cefrLevel}
                </div>
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-semibold uppercase">Language</label>
                <div className="text-slate-200 bg-slate-950 px-2 py-1 rounded border border-slate-800 mt-1 uppercase">
                  {selectedUlo.metadata.targetLanguage}
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 font-semibold uppercase">Publication Targets</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedUlo.publicationTargets.map((target) => (
                  <span key={target} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">
                    {target}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 font-semibold uppercase">Graph Relationships</label>
              <div className="bg-slate-950 p-2 rounded border border-slate-800 mt-1 space-y-1 text-[11px]">
                <div className="text-slate-400">
                  <span className="text-emerald-400 font-medium">CONTAINS:</span>{' '}
                  {selectedUlo.relationships.containsCids.length} ULOs
                </div>
                <div className="text-slate-400">
                  <span className="text-emerald-400 font-medium">EXERCISES:</span>{' '}
                  {selectedUlo.relationships.exercisesCids.length} ULOs
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 text-[11px]">
              21 Native Educational AI Actions ready for <span className="font-mono">{selectedUlo.cid}</span>
            </div>

            {AI_ACTIONS.slice(0, 8).map((action) => (
              <button
                key={action.id}
                className="w-full text-left p-2 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 transition"
              >
                <div className="font-medium text-slate-200">{action.name}</div>
                <div className="text-[10px] text-slate-400">{action.description}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};
