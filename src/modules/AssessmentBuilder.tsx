import React from 'react';
import { CheckSquare } from 'lucide-react';

export const AssessmentBuilderView: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Assessment & Quiz Builder</h1>
          <p className="text-xs text-slate-400">Item Response Theory (IRT) Calibrated Assessment Items & Placement Tests</p>
        </div>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-3 py-1.5 rounded-lg text-xs transition">
          + Create Assessment
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
        <div className="flex items-center space-x-2 text-slate-200 text-sm font-bold">
          <CheckSquare className="w-5 h-5 text-emerald-400" />
          <span>Spanish B1 Placement Diagnostic Test</span>
        </div>
        <div className="text-xs text-slate-400">
          Randomized pooling from 15 ULO Question Items • Estimated Time: 20 min • Passing Threshold: 75%
        </div>
      </div>
    </div>
  );
};
