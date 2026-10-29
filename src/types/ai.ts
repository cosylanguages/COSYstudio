export type AIActionId =
  | 'generate_lesson'
  | 'improve_lesson'
  | 'simplify'
  | 'increase_cefr'
  | 'translate'
  | 'generate_vocabulary'
  | 'generate_examples'
  | 'generate_ipa'
  | 'generate_pronunciation'
  | 'generate_quiz'
  | 'generate_discussion'
  | 'generate_homework'
  | 'generate_article'
  | 'generate_worksheet'
  | 'generate_listening'
  | 'generate_tts'
  | 'generate_images'
  | 'generate_dialogue'
  | 'generate_roleplay'
  | 'generate_cultural_notes'
  | 'generate_metadata';

export interface AIActionDescriptor {
  id: AIActionId;
  name: string;
  description: string;
  category: 'CONTENT' | 'TRANSFORMATION' | 'AUDIO_VISUAL' | 'ASSESSMENT' | 'METADATA';
  requiresContext: boolean;
}

export const AI_ACTIONS: AIActionDescriptor[] = [
  { id: 'generate_lesson', name: 'Generate Lesson', description: 'Auto-generate complete interactive lesson framework', category: 'CONTENT', requiresContext: true },
  { id: 'improve_lesson', name: 'Improve Lesson', description: 'Enhance engagement, formatting, and pedagogical depth', category: 'CONTENT', requiresContext: true },
  { id: 'simplify', name: 'Simplify (Decrease CEFR)', description: 'Lower syntactic complexity for lower CEFR levels', category: 'TRANSFORMATION', requiresContext: true },
  { id: 'increase_cefr', name: 'Increase CEFR', description: 'Elevate vocabulary and sentence structure to higher CEFR', category: 'TRANSFORMATION', requiresContext: true },
  { id: 'translate', name: 'Multi-Target Translate', description: 'Translate content matrix across 14 ISO target languages', category: 'TRANSFORMATION', requiresContext: true },
  { id: 'generate_vocabulary', name: 'Generate Vocabulary Set', description: 'Extract and compile thematic lexical headwords', category: 'CONTENT', requiresContext: true },
  { id: 'generate_examples', name: 'Generate Examples', description: 'Create natural contextual sample sentences', category: 'CONTENT', requiresContext: true },
  { id: 'generate_ipa', name: 'Generate IPA Phonetics', description: 'Auto-transcribe terms into phonetic IPA symbols', category: 'AUDIO_VISUAL', requiresContext: true },
  { id: 'generate_pronunciation', name: 'Generate Pronunciation Drill', description: 'Create Minimal Pair drills and audio prompts', category: 'AUDIO_VISUAL', requiresContext: true },
  { id: 'generate_quiz', name: 'Generate Quiz Items', description: 'Build multiple choice & gap fill evaluation items', category: 'ASSESSMENT', requiresContext: true },
  { id: 'generate_discussion', name: 'Generate Discussion Prompts', description: 'Create speaking club debate triggers', category: 'CONTENT', requiresContext: true },
  { id: 'generate_homework', name: 'Generate Homework Assignment', description: 'Compile self-study revision tasks', category: 'ASSESSMENT', requiresContext: true },
  { id: 'generate_article', name: 'Generate Magazine Article', description: 'Draft editorial culture read for COSYmagazine', category: 'CONTENT', requiresContext: true },
  { id: 'generate_worksheet', name: 'Generate Printable Worksheet', description: 'Layout PDF printable booklet page for COSYmanuals', category: 'CONTENT', requiresContext: true },
  { id: 'generate_listening', name: 'Generate Listening Exercise', description: 'Create audio script with comprehension questions', category: 'AUDIO_VISUAL', requiresContext: true },
  { id: 'generate_tts', name: 'Generate Neural TTS Audio', description: 'Synthesize native speaker audio with force-alignment', category: 'AUDIO_VISUAL', requiresContext: true },
  { id: 'generate_images', name: 'Generate Visual Asset', description: 'Generate illustrative prompt images or hotspots', category: 'AUDIO_VISUAL', requiresContext: true },
  { id: 'generate_dialogue', name: 'Generate Dialogue Script', description: 'Draft multi-turn realistic spoken scenario', category: 'CONTENT', requiresContext: true },
  { id: 'generate_roleplay', name: 'Generate RPG Quest Script', description: 'Draft COSY Town 3D avatar conversation tree for COSYworld', category: 'CONTENT', requiresContext: true },
  { id: 'generate_cultural_notes', name: 'Generate Cultural Notes', description: 'Add sociolinguistic context and usage tips', category: 'CONTENT', requiresContext: true },
  { id: 'generate_metadata', name: 'Auto-Tag Metadata', description: 'Infer CEFR level, skills, themes, and IRT score', category: 'METADATA', requiresContext: true }
];
