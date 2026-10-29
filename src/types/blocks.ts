export type BlockType =
  | 'heading'
  | 'rich_text'
  | 'image'
  | 'gallery'
  | 'video'
  | 'audio'
  | 'dialogue'
  | 'vocabulary_table'
  | 'grammar_table'
  | 'timeline'
  | 'matching'
  | 'sorting'
  | 'gap_fill'
  | 'flashcards'
  | 'pronunciation'
  | 'speaking'
  | 'ai_discussion'
  | 'quiz'
  | 'poll'
  | 'reflection'
  | 'homework'
  | 'teacher_notes'
  | 'assessment'
  | 'custom_extension';

export interface LessonBlock {
  id: string;
  type: BlockType;
  order: number;
  content: Record<string, unknown>;
  settings?: Record<string, unknown>;
}

export interface GapFillBlockContent {
  prompt: string;
  correctAnswers: string[];
  distractors: string[];
  explanation?: string;
}

export interface DialogueSpeakerLine {
  speaker: string;
  text: string;
  translation?: string;
  audioCid?: string;
  ipa?: string;
}

export interface DialogueBlockContent {
  title?: string;
  scenario?: string;
  lines: DialogueSpeakerLine[];
}

export interface VocabularyTableItem {
  headword: string;
  ipa: string;
  partOfSpeech: string;
  translation: string;
  exampleSentence?: string;
  audioCid?: string;
}
