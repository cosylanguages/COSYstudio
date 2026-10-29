import React from 'react';
import { BarChart3, AlertCircle } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Analytics & Content Performance Index</h1>
          <p className="text-xs text-slate-400">Pedagogical Bottleneck Identification & Exercise Failure Telemetry</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400">Ecosystem Completion Rate</span>
          <div className="text-2xl font-bold text-slate-100 mt-1">87.4%</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400">Avg Exercise Failure Rate</span>
          <div className="text-2xl font-bold text-slate-100 mt-1">14.2%</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400">Flagged Bottlenecks</span>
          <div className="text-2xl font-bold text-amber-400 mt-1">2 Exercises</div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
        <h3 className="text-xs font-semibold text-slate-200">Pedagogical Bottleneck Items</h3>
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <div>
              <div className="font-semibold text-slate-200">cid_ulo_9931 — Fill-in: Cafe Dialogue</div>
              <div className="text-[10px] text-slate-500">Failure Rate: 48.2% (High) • Hint string reported confusing</div>
            </div>
          </div>
          <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded text-xs">
            Open in Lesson Builder
          </button>
        </div>
      </div>
    </div>
  );
};
