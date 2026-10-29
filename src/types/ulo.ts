export type CEFRLevel = 'A0' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type LanguageCode =
  | 'en' | 'fr' | 'it' | 'ru' | 'el' | 'es' | 'de' | 'pt' | 'hy' | 'ka' | 'ba' | 'br' | 'cv' | 'tt';

export type ULOSubtype =
  | 'LESSON'
  | 'EXERCISE'
  | 'DIALOGUE'
  | 'VOCABULARY_SET'
  | 'GRAMMAR_TOPIC'
  | 'ARTICLE'
  | 'CONVERSATION_CLUB'
  | 'QUEST'
  | 'GAME_LEVEL'
  | 'WORKSHEET'
  | 'ASSESSMENT'
  | 'AUDIO'
  | 'VIDEO'
  | 'IMAGE';

export type SkillCategory =
  | 'READING'
  | 'WRITING'
  | 'LISTENING'
  | 'SPEAKING'
  | 'PRONUNCIATION'
  | 'GRAMMAR'
  | 'VOCABULARY';

export type AgeGroup = 'CHILDREN' | 'KIDS' | 'TEENS' | 'ADULTS' | 'BUSINESS';

export type TargetAudience = 'GENERAL' | 'SPOKEN' | 'EXAM' | 'PROFESSIONAL' | 'TRAVEL' | 'RELOCATION';

export type ObjectStatus = 'DRAFT' | 'REVIEW' | 'STAGING' | 'PUBLISHED' | 'ARCHIVED' | 'DEPRECATED';

export type PublicationTarget =
  | 'COSYlanguages'
  | 'COSYworld'
  | 'COSYgames'
  | 'COSYmagazine'
  | 'COSYevents'
  | 'COSYmanuals'
  | 'PDF_WORKSHEET'
  | 'PRESENTATION'
  | 'MOBILE_APP'
  | 'REST_API';

export interface ULORelationships {
  containsCids?: string[];
  dependsOnCids?: string[];
  explainsCids?: string[];
  exercisesCids?: string[];
  transformsToCids?: string[];
  referencesMediaCids?: string[];
  evaluatesCids?: string[];
  variantCids?: string[];
}

export interface UniversalLearningObject {
  cid: string; // e.g. "cid_ulo_01H8X..."
  subtype: ULOSubtype;
  metadata: {
    targetLanguage: LanguageCode;
    cefrLevel: CEFRLevel;
    theme: string;
    subTheme?: string;
    grammarRuleCids?: string[];
    skills: SkillCategory[];
    ageGroups: AgeGroup[];
    targetAudiences: TargetAudience[];
    estimatedDurationSeconds: number;
    learningObjectives: string[];
    status: ObjectStatus;
    tags: string[];
    difficultyScore: number;
  };
  relationships: ULORelationships;
  versioning: {
    version: number;
    semver: string;
    activeAliases: string[];
    historyLog?: Array<{ version: string; updatedBy: string; timestamp: string; diffSummary: string }>;
  };
  localization: {
    titleLocKey: string;
    translations: Record<string, Record<string, string>>;
  };
  payload: Record<string, unknown>;
  publicationTargets: PublicationTarget[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type BlockType =
  | 'heading' | 'rich_text' | 'image' | 'gallery' | 'video' | 'audio'
  | 'dialogue' | 'vocabulary_table' | 'grammar_table' | 'timeline'
  | 'matching' | 'sorting' | 'gap_fill' | 'flashcards' | 'pronunciation'
  | 'speaking' | 'ai_discussion' | 'quiz' | 'poll' | 'reflection'
  | 'homework' | 'teacher_notes' | 'assessment' | 'custom_extension';

export interface LessonBlock {
  blockId: string; // "block_101"
  type: BlockType;
  properties?: Record<string, unknown>;
  payload?: Record<string, unknown>;
}
