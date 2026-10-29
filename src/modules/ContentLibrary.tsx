import React, { useState } from 'react';
import { UniversalLearningObject } from '../types/ulo';
import { Filter, Search } from 'lucide-react';

interface ModuleProps {
  ulos: UniversalLearningObject[];
  onSelectUlo: (ulo: UniversalLearningObject) => void;
}

export const ContentLibraryView: React.FC<ModuleProps> = ({ ulos, onSelectUlo }) => {
  const [filterQuery, setFilterQuery] = useState('');

  const filteredUlos = ulos.filter(
    (u) =>
      u.metadata.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      u.cid.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Content Library</h1>
          <p className="text-xs text-slate-400">Database-First Repository for 10,000+ Universal Learning Objects</p>
        </div>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-3 py-1.5 rounded-lg text-xs transition">
          + New ULO Primitive
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between gap-3">
        <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 flex-1 max-w-md text-xs">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter ULOs by title, CID, tag, or CEFR level..."
            className="bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none w-full"
          />
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400 flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Linear Multi-Filters:</span>
          </span>
          <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-[11px]">CEFR: B1</span>
          <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-[11px]">Status: Published</span>
        </div>
      </div>

      {/* ULO Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
              <th className="p-3">CID</th>
              <th className="p-3">Subtype</th>
              <th className="p-3">Title / Primitive Name</th>
              <th className="p-3">CEFR</th>
              <th className="p-3">Language</th>
              <th className="p-3">Status</th>
              <th className="p-3">Targets</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredUlos.map((ulo) => (
              <tr
                key={ulo.cid}
                onClick={() => onSelectUlo(ulo)}
                className="hover:bg-slate-800/60 cursor-pointer transition text-slate-300"
              >
                <td className="p-3 font-mono text-[10px] text-emerald-400">{ulo.cid}</td>
                <td className="p-3">
                  <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] font-mono">{ulo.subtype}</span>
                </td>
                <td className="p-3 font-medium text-slate-100">{ulo.metadata.title}</td>
                <td className="p-3">{ulo.metadata.cefrLevel}</td>
                <td className="p-3 uppercase">{ulo.metadata.targetLanguage}</td>
                <td className="p-3">
                  <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 text-[10px]">
                    {ulo.metadata.status}
                  </span>
                </td>
                <td className="p-3 text-[10px] text-slate-400">
                  {ulo.publicationTargets.length} Apps
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
