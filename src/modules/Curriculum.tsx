import React from 'react';
import { UniversalLearningObject } from '../types/ulo';
import { GraduationCap, ArrowRight } from 'lucide-react';

interface ModuleProps {
  ulos: UniversalLearningObject[];
}

export const CurriculumView: React.FC<ModuleProps> = ({ ulos }) => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Curriculum & Learning Path Matrix</h1>
          <p className="text-xs text-slate-400">Scope & Sequence Tree Mapping Universal Learning Objects into CEFR Paths</p>
        </div>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-3 py-1.5 rounded-lg text-xs transition">
          + Create Pathway
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Tree Column */}
        <div className="col-span-1 bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
          <div className="text-xs font-semibold text-slate-200 border-b border-slate-800 pb-2">
            Spanish B1 General Track
          </div>
          <div className="space-y-2 text-xs">
            <div className="font-medium text-slate-300">Module 1: Travel & Dining</div>
            <div className="pl-3 space-y-1 text-slate-400">
              <div className="flex items-center space-x-1">
                <span>› Unit 1: At the Airport</span>
              </div>
              <div className="flex items-center space-x-1 text-emerald-400 font-medium">
                <span>v Unit 2: Cafe Culture</span>
              </div>
              <div className="pl-3 space-y-1 text-[11px] text-slate-300">
                <div className="flex items-center justify-between">
                  <span>* Lesson 1: Ordering Drinks</span>
                  <span className="font-mono text-[9px] text-emerald-400">cid_ulo_8019</span>
                </div>
                <div>* Lesson 2: Paying the Bill</div>
              </div>
            </div>
          </div>
        </div>

        {/* Node Path Details */}
        <div className="col-span-2 bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-sm font-bold text-slate-100">Unit 2: Cafe Culture</h3>
                <span className="text-[10px] text-slate-400">Target CEFR: B1.1 | Duration: 45 min</span>
              </div>
            </div>
            <button className="bg-slate-800 text-slate-200 px-3 py-1 rounded text-xs">Run Skill Balance Audit</button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="font-semibold text-slate-300">Contained Universal Learning Objects:</div>
            {ulos.map((u) => (
              <div key={u.cid} className="p-3 bg-slate-950 rounded border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-200">{u.metadata.title}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{u.cid} • {u.subtype}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
