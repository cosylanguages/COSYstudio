import React from 'react';
import { UniversalLearningObject } from '../types/ulo';
import { Volume2 } from 'lucide-react';

interface ModuleProps {
  ulos: UniversalLearningObject[];
}

export const VocabularyDBView: React.FC<ModuleProps> = ({ ulos }) => {
  const vocabSet = ulos.find((u) => u.subtype === 'VOCABULARY_SET');
  const items = (vocabSet?.payload.items as Array<{ headword: string; ipa: string; translation: string; pos: string }>) || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Vocabulary Database</h1>
          <p className="text-xs text-slate-400">Canonical Lexicon Manager with IPA Phonetics & Multi-Target Translation Matrix</p>
        </div>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-3 py-1.5 rounded-lg text-xs transition">
          + Add Lexical Term
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-semibold">
              <th className="p-3">Term (Lemma)</th>
              <th className="p-3">IPA Phonetic</th>
              <th className="p-3">Part of Speech</th>
              <th className="p-3">Translation (EN)</th>
              <th className="p-3">Audio Alignment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {items.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-800/50 transition text-slate-200">
                <td className="p-3 font-semibold text-emerald-400">{item.headword}</td>
                <td className="p-3 font-mono text-slate-400">{item.ipa}</td>
                <td className="p-3 text-slate-400">{item.pos}</td>
                <td className="p-3">{item.translation}</td>
                <td className="p-3">
                  <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded text-[10px] flex items-center space-x-1">
                    <Volume2 className="w-3 h-3 text-emerald-400" />
                    <span>Play Audio</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
