import React from 'react';
import {
  LayoutDashboard,
  Library,
  GraduationCap,
  FileCode,
  BookOpen,
  Settings,
  Sparkles,
  Layers,
  Send,
  BarChart3,
  Video,
  CheckSquare,
  Search,
} from 'lucide-react';

export type ModuleId =
  | 'dashboard'
  | 'content_library'
  | 'curriculum'
  | 'lesson_builder'
  | 'vocabulary_db'
  | 'grammar_db'
  | 'media_library'
  | 'assessment_builder'
  | 'publishing'
  | 'analytics'
  | 'ai_assistant'
  | 'settings';

interface NavigationProps {
  activeModule: ModuleId;
  onSelectModule: (mod: ModuleId) => void;
  onOpenCommandPalette: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const MODULES: Array<{ id: ModuleId; label: string; icon: React.ElementType }> = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'content_library', label: 'Content Library', icon: Library },
  { id: 'curriculum', label: 'Curriculum', icon: GraduationCap },
  { id: 'lesson_builder', label: 'Lesson Builder', icon: FileCode },
  { id: 'vocabulary_db', label: 'Vocabulary DB', icon: BookOpen },
  { id: 'grammar_db', label: 'Grammar DB', icon: Layers },
  { id: 'media_library', label: 'Media Library', icon: Video },
  { id: 'assessment_builder', label: 'Assessment Builder', icon: CheckSquare },
  { id: 'publishing', label: 'Publishing', icon: Send },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'ai_assistant', label: 'AI Assistant', icon: Sparkles },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Navigation: React.FC<NavigationProps> = ({
  activeModule,
  onSelectModule,
  onOpenCommandPalette,
  collapsed,
  onToggleCollapse,
}) => {
  return (
    <aside
      className={`bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-200 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header / Logo */}
      <div className="h-14 border-b border-slate-800 flex items-center justify-between px-4">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-slate-950 text-sm">
              C
            </div>
            <span className="font-semibold text-slate-100 tracking-wide">
              COSY<span className="text-emerald-400 font-normal">studio</span>
            </span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="text-slate-400 hover:text-slate-200 text-xs p-1 rounded hover:bg-slate-800"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Quick Search Shortcut Button */}
      <div className="p-3 border-b border-slate-800/50">
        <button
          onClick={onOpenCommandPalette}
          className="w-full bg-slate-950/80 hover:bg-slate-800 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center justify-between text-slate-400 text-xs transition"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            {!collapsed && <span>Search ULOs...</span>}
          </div>
          {!collapsed && (
            <kbd className="bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded text-[10px]">
              ⌘K
            </kbd>
          )}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {MODULES.map((mod) => {
          const Icon = mod.icon;
          const isActive = activeModule === mod.id;
          return (
            <button
              key={mod.id}
              onClick={() => onSelectModule(mod.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              {!collapsed && <span>{mod.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-800 text-[11px] text-slate-500 flex justify-between items-center">
          <span>v2.4.0 (ULO COS)</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
      )}
    </aside>
  );
};
