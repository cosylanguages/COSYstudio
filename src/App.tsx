import React, { useState } from 'react';
import { Navigation, ModuleId } from './components/Navigation';
import { CommandPalette } from './components/CommandPalette';
import { InspectorPanel } from './components/InspectorPanel';
import { MOCK_ULOS } from './data/mockUlos';
import { UniversalLearningObject } from './types/ulo';

import { DashboardView } from './modules/Dashboard';
import { ContentLibraryView } from './modules/ContentLibrary';
import { CurriculumView } from './modules/Curriculum';
import { LessonBuilderView } from './modules/LessonBuilder';
import { VocabularyDBView } from './modules/VocabularyDB';
import { GrammarDBView } from './modules/GrammarDB';
import { MediaLibraryView } from './modules/MediaLibrary';
import { AssessmentBuilderView } from './modules/AssessmentBuilder';
import { PublishingView } from './modules/Publishing';
import { AnalyticsView } from './modules/Analytics';
import { AIAssistantView } from './modules/AIAssistant';
import { SettingsView } from './modules/Settings';

export const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ModuleId>('dashboard');
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [selectedUlo, setSelectedUlo] = useState<UniversalLearningObject | null>(MOCK_ULOS[0]);

  const renderModuleView = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardView ulos={MOCK_ULOS} onSelectUlo={setSelectedUlo} />;
      case 'content_library':
        return <ContentLibraryView ulos={MOCK_ULOS} onSelectUlo={setSelectedUlo} />;
      case 'curriculum':
        return <CurriculumView ulos={MOCK_ULOS} />;
      case 'lesson_builder':
        return <LessonBuilderView ulos={MOCK_ULOS} />;
      case 'vocabulary_db':
        return <VocabularyDBView ulos={MOCK_ULOS} />;
      case 'grammar_db':
        return <GrammarDBView ulos={MOCK_ULOS} />;
      case 'media_library':
        return <MediaLibraryView />;
      case 'assessment_builder':
        return <AssessmentBuilderView />;
      case 'publishing':
        return <PublishingView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'ai_assistant':
        return <AIAssistantView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView ulos={MOCK_ULOS} onSelectUlo={setSelectedUlo} />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Collapsible Left Navigation */}
      <Navigation
        activeModule={activeModule}
        onSelectModule={setActiveModule}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        collapsed={navCollapsed}
        onToggleCollapse={() => setNavCollapsed(!navCollapsed)}
      />

      {/* Main Module Content Canvas */}
      <main className="flex-1 overflow-y-auto bg-slate-950">
        {renderModuleView()}
      </main>

      {/* Slide-over Properties Inspector / AI Panel */}
      <InspectorPanel selectedUlo={selectedUlo} onClose={() => setSelectedUlo(null)} />

      {/* Universal Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectModule={setActiveModule}
      />
    </div>
  );
};

export default App;
