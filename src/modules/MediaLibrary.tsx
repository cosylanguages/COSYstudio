import React from 'react';
import { Video, Music, Image as ImageIcon, Box } from 'lucide-react';

export const MediaLibraryView: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Media Assets Pipeline</h1>
          <p className="text-xs text-slate-400">Automated Audio-Text Force Alignment, Video Transcoding & 3D Ingestion</p>
        </div>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-3 py-1.5 rounded-lg text-xs transition">
          + Upload Media Asset
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center space-x-3">
          <Music className="w-8 h-8 text-emerald-400" />
          <div>
            <div className="text-sm font-bold text-slate-100">1,420 Audio Clips</div>
            <div className="text-[10px] text-emerald-400">100% Force Aligned</div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center space-x-3">
          <Video className="w-8 h-8 text-blue-400" />
          <div>
            <div className="text-sm font-bold text-slate-100">320 Video Tracks</div>
            <div className="text-[10px] text-blue-400">Adaptive HLS Ready</div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center space-x-3">
          <ImageIcon className="w-8 h-8 text-purple-400" />
          <div>
            <div className="text-sm font-bold text-slate-100">890 WebP Images</div>
            <div className="text-[10px] text-purple-400">Hotspots Defined</div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center space-x-3">
          <Box className="w-8 h-8 text-amber-400" />
          <div>
            <div className="text-sm font-bold text-slate-100">142 3D GLTF Assets</div>
            <div className="text-[10px] text-amber-400">COSYworld Ready</div>
          </div>
        </div>
      </div>
    </div>
  );
};
