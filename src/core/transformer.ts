import { UniversalLearningObject, PublicationTarget } from '../types/ulo';

export interface TargetTransformationOutput {
  target: PublicationTarget;
  transformedAt: string;
  payload: Record<string, unknown>;
}

export function transformUloForTarget(
  ulo: UniversalLearningObject,
  target: PublicationTarget
): TargetTransformationOutput {
  let transformedPayload: Record<string, unknown> = {};

  switch (target) {
    case 'COSYlanguages':
      transformedPayload = {
        type: 'InteractiveCard',
        cid: ulo.cid,
        title: ulo.metadata.title,
        cefr: ulo.metadata.cefrLevel,
        language: ulo.metadata.targetLanguage,
        content: ulo.payload,
      };
      break;

    case 'COSYworld':
      transformedPayload = {
        type: '3D_RPG_NPC_DialogueTree',
        questCid: ulo.cid,
        districtCoordinates: { x: 104, y: 42, z: 12 },
        npcName: 'Ella Bronx',
        dialogueScript: ulo.payload.lines || [
          { speaker: 'NPC', text: ulo.metadata.title }
        ],
      };
      break;

    case 'COSYgames':
      transformedPayload = {
        type: 'MicroGame_ArcadeWordPool',
        gamePackCid: ulo.cid,
        timeLimitSeconds: 60,
        wordPairs: ulo.payload.items || [],
      };
      break;

    case 'PDF_WORKSHEET':
      transformedPayload = {
        type: 'Vector_A4_Printable',
        layoutId: 'std_a4_v1',
        headerTitle: ulo.metadata.title,
        cefrBadge: ulo.metadata.cefrLevel,
        bodyBlocks: ulo.payload.blocks || [],
      };
      break;

    default:
      transformedPayload = {
        type: 'StandardJSONResponse',
        cid: ulo.cid,
        metadata: ulo.metadata,
        payload: ulo.payload,
      };
      break;
  }

  return {
    target,
    transformedAt: new Date().toISOString(),
    payload: transformedPayload,
  };
}
