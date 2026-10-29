import React from 'react';
import { UniversalLearningObject } from '../types/ulo';
import { Activity, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

interface ModuleProps {
  ulos: UniversalLearningObject[];
  onSelectUlo: (ulo: UniversalLearningObject) => void;
}

export const DashboardView: React.FC<ModuleProps> = ({ ulos, onSelectUlo }) => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Ecosystem Content Dashboard</h1>
          <p className="text-xs text-slate-400">Single Source of Truth (SSOT) Content Health & Velocity Metrics</p>
        </div>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-3 py-1.5 rounded-lg text-xs transition">
          + Quick Create ULO
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total ULOs</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-2">14,820</div>
          <div className="text-[10px] text-emerald-400 mt-1">94% Schema Validated</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Publishing Velocity</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-2">342 / wk</div>
          <div className="text-[10px] text-blue-400 mt-1">+18% vs last week</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active AI Jobs</span>
            <CheckCircle className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-2">1,204</div>
          <div className="text-[10px] text-purple-400 mt-1">99.4% Job Success Rate</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Pending Audit</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-2">25 ULOs</div>
          <div className="text-[10px] text-amber-400 mt-1">Missing Audio Alignment</div>
        </div>
      </div>

      {/* Recent ULO Activity Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <h2 className="text-xs font-semibold text-slate-200 mb-3">Recently Modified Universal Learning Objects</h2>
        <div className="space-y-2">
          {ulos.map((ulo) => (
            <div
              key={ulo.cid}
              onClick={() => onSelectUlo(ulo)}
              className="p-3 bg-slate-950/60 hover:bg-slate-800 border border-slate-800/80 rounded-lg flex items-center justify-between cursor-pointer transition text-xs"
            >
              <div className="flex items-center space-x-3">
                <span className="font-mono text-[10px] bg-slate-800 px-2 py-0.5 rounded text-emerald-400">
                  {ulo.cid}
                </span>
                <span className="font-medium text-slate-200">{ulo.metadata.title}</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-400 text-[11px]">
                <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px]">{ulo.metadata.cefrLevel}</span>
                <span className="uppercase">{ulo.metadata.targetLanguage}</span>
                <span className="text-emerald-400 font-medium">{ulo.metadata.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
