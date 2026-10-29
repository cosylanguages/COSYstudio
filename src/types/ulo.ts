export type CEFRLevel = 'A0' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type LanguageCode =
  | 'en'
  | 'fr'
  | 'it'
  | 'ru'
  | 'el'
  | 'es'
  | 'de'
  | 'pt'
  | 'hy'
  | 'ka'
  | 'ba'
  | 'br'
  | 'cv'
  | 'tt';

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

export type SkillType =
  | 'READING'
  | 'WRITING'
  | 'LISTENING'
  | 'SPEAKING'
  | 'PRONUNCIATION'
  | 'GRAMMAR'
  | 'VOCABULARY';

export type AgeGroup = 'CHILDREN' | 'KIDS' | 'TEENS' | 'ADULTS' | 'BUSINESS';

export type TargetAudience =
  | 'GENERAL'
  | 'SPOKEN'
  | 'EXAM'
  | 'PROFESSIONAL'
  | 'TRAVEL'
  | 'RELOCATION';

export type ULOStatus =
  | 'DRAFT'
  | 'REVIEW'
  | 'STAGING'
  | 'PUBLISHED'
  | 'ARCHIVED'
  | 'DEPRECATED';

export type PublicationTarget =
  | 'COSYlanguages'
  | 'COSYworld'
  | 'COSYgames'
  | 'COSYmagazine'
  | 'COSYevents'
  | 'COSYmanuals'
  | 'COSYpractice'
  | 'COSYdata'
  | 'COSYtools'
  | 'COSYplatform'
  | 'PDF_WORKSHEET'
  | 'PRESENTATION'
  | 'MOBILE_APP'
  | 'REST_API';

export interface ULORelationships {
  containsCids: string[];
  dependsOnCids: string[];
  explainsCids: string[];
  exercisesCids: string[];
  transformsToCids: string[];
  referencesMediaCids: string[];
  evaluatesCids: string[];
  variantCids: string[];
}

export interface ULOMetadata {
  title: string;
  targetLanguage: LanguageCode;
  cefrLevel: CEFRLevel;
  theme: string;
  subTheme?: string;
  skills: SkillType[];
  ageGroups: AgeGroup[];
  targetAudiences: TargetAudience[];
  estimatedDurationSeconds: number;
  learningObjectives: string[];
  status: ULOStatus;
  tags: string[];
  difficultyScore: number; // 1-100
}

export interface UniversalLearningObject {
  cid: string; // e.g., "cid_ulo_01H8X..."
  subtype: ULOSubtype;
  metadata: ULOMetadata;
  relationships: ULORelationships;
  versioning: {
    version: number;
    semver: string; // e.g. "1.2.0"
    activeAliases: string[]; // ["@latest", "@production"]
    historyLog: Array<{
      version: string;
      updatedBy: string;
      timestamp: string;
      diffSummary: string;
    }>;
  };
  localization: {
    titleLocKey: string;
    translations: Record<string, Record<string, string>>; // locale -> field -> localized
  };
  payload: Record<string, unknown>;
  publicationTargets: PublicationTarget[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
