import React, { useState } from 'react';
import { AI_ACTIONS } from '../types/ai';
import { Sparkles, Check, X } from 'lucide-react';

export const AIAssistantView: React.FC = () => {
  const [selectedAction, setSelectedAction] = useState(AI_ACTIONS[1]); // Simplify

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Integrated AI Assistant Hub</h1>
          <p className="text-xs text-slate-400">21 Native Educational AI Actions with Knowledge Graph Awareness</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Action List */}
        <div className="col-span-1 bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-1 max-h-[500px] overflow-y-auto">
          {AI_ACTIONS.map((action) => (
            <button
              key={action.id}
              onClick={() => setSelectedAction(action)}
              className={`w-full text-left p-2.5 rounded-lg transition text-xs ${
                selectedAction.id === action.id
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="font-medium">{action.name}</div>
              <div className="text-[10px] text-slate-500">{action.description}</div>
            </button>
          ))}
        </div>

        {/* Action Execution Canvas & Diff Preview */}
        <div className="col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <div>
                <h2 className="text-sm font-bold text-slate-100">{selectedAction.name}</h2>
                <span className="text-[10px] text-slate-400">{selectedAction.description}</span>
              </div>
            </div>
            <button className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs">
              Execute Action
            </button>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Diff Preview (Original B1 vs. Simplified A2):</span>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs space-y-1">
              <div className="text-red-400 bg-red-500/10 p-1.5 rounded">
                - Original (B1): ¿Podría traerme un café con leche y una copa de agua?
              </div>
              <div className="text-emerald-400 bg-emerald-500/10 p-1.5 rounded">
                + Simplified (A2): Un café con leche y un vaso de agua, por favor.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
