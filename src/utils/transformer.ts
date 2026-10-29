import { UniversalLearningObject, PublicationTarget } from '../types/ulo';

export interface TransformedOutput {
  target: PublicationTarget;
  transformedAt: string;
  format: string;
  data: Record<string, unknown>;
}

export function transformUlo(ulo: UniversalLearningObject, target: PublicationTarget): TransformedOutput {
  const transformedAt = new Date().toISOString();

  switch (target) {
    case 'COSYlanguages':
      return {
        target,
        transformedAt,
        format: 'HTML5_INTERACTIVE_CARD',
        data: {
          cid: ulo.cid,
          title: ulo.localization.titleLocKey,
          cefr: ulo.metadata.cefrLevel,
          payload: ulo.payload,
          media: ulo.relationships.referencesMediaCids || []
        }
      };

    case 'COSYgames':
      return {
        target,
        transformedAt,
        format: 'ARCADE_WORD_PAIR_POOL',
        data: {
          cid: ulo.cid,
          wordPool: ulo.payload.terms || [],
          difficulty: ulo.metadata.difficultyScore
        }
      };

    case 'COSYworld':
      return {
        target,
        transformedAt,
        format: 'SPATIAL_3D_NPC_TREE',
        data: {
          cid: ulo.cid,
          district: ulo.metadata.theme,
          npcDialogue: ulo.payload.dialogueTurns || [],
          requiredLevel: ulo.metadata.cefrLevel
        }
      };

    case 'PDF_WORKSHEET':
      return {
        target,
        transformedAt,
        format: 'VECTOR_PDF_A4',
        data: {
          cid: ulo.cid,
          titleKey: ulo.localization.titleLocKey,
          layoutTemplate: 'A4_PRINT_BOOKLET',
          exercises: ulo.relationships.exercisesCids || []
        }
      };

    default:
      return {
        target,
        transformedAt,
        format: 'GENERIC_JSON_REST',
        data: {
          cid: ulo.cid,
          subtype: ulo.subtype,
          metadata: ulo.metadata,
          payload: ulo.payload
        }
      };
  }
}
