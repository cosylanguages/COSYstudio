import React from 'react';
import { Send, CheckCircle, RefreshCw } from 'lucide-react';

export const PublishingView: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Publishing & Target Transformation Engine</h1>
          <p className="text-xs text-slate-400">Multi-Environment Deployment Pipeline with Instant Global Edge CDN Cache Invalidation</p>
        </div>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-3 py-1.5 rounded-lg text-xs transition">
          Deploy Staging → Production
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
          <div className="text-xs font-semibold text-slate-200 border-b border-slate-800 pb-2">
            Target Transformation Summary
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 bg-slate-950 rounded border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-200">COSYlanguages</div>
                <div className="text-[10px] text-slate-500">Interactive Content Cards</div>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">Synced</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-200">COSYworld</div>
                <div className="text-[10px] text-slate-500">3D NPC Dialogue Trees</div>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">Synced</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-200">PDF Worksheets</div>
                <div className="text-[10px] text-slate-500">Vector Printable A4</div>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">Synced</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
          <div className="text-xs font-semibold text-slate-200 border-b border-slate-800 pb-2 flex items-center justify-between">
            <span>Deployment Stream Logs</span>
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="font-mono text-[11px] text-slate-400 bg-slate-950 p-3 rounded-lg space-y-1 h-44 overflow-y-auto border border-slate-800">
            <div className="text-emerald-400">[10:14:02] Event 'content.published' emitted for cid_ulo_8019</div>
            <div>[10:14:03] Global Edge CDN cache invalidated</div>
            <div>[10:14:04] Transformed for 10 target channels (0 errors)</div>
            <div className="text-slate-500">[10:14:05] Ready for edge consumption.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
