import React from 'react';
import { UniversalLearningObject } from '../types/ulo';

interface ModuleProps {
  ulos: UniversalLearningObject[];
}

export const GrammarDBView: React.FC<ModuleProps> = ({ ulos }) => {
  const grammar = ulos.find((u) => u.subtype === 'GRAMMAR_TOPIC') || ulos[0];
  const fmu = (grammar.payload.fmu as { form: string; meaning: string; use: string }) || {
    form: 'Subject + Indirect Object Pronoun + Verb',
    meaning: 'Identifies to/for whom an action is performed.',
    use: 'Used with verbs like gustar, dar, decir.',
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Grammar Database</h1>
          <p className="text-xs text-slate-400">Canonical Linguistic Rules, Formula Visualizers & Concept Check Questions (CCQ)</p>
        </div>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-3 py-1.5 rounded-lg text-xs transition">
          + Add Grammar Rule
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {grammar.cid}
            </span>
            <h2 className="text-lg font-bold text-slate-100 mt-1">{grammar.metadata.title}</h2>
          </div>
          <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded text-xs font-semibold">
            CEFR: {grammar.metadata.cefrLevel}
          </span>
        </div>

        {/* Pattern Formula Box */}
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">Visual Pattern Formula:</span>
          <span className="font-mono text-emerald-400 font-semibold">{grammar.payload.formula as string || '[Pattern Formula]'}</span>
        </div>

        {/* Form Meaning Use Breakdown */}
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-emerald-400 uppercase font-bold block mb-1">FORM</span>
            <p className="text-slate-300">{fmu.form}</p>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-emerald-400 uppercase font-bold block mb-1">MEANING</span>
            <p className="text-slate-300">{fmu.meaning}</p>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-emerald-400 uppercase font-bold block mb-1">USE</span>
            <p className="text-slate-300">{fmu.use}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
