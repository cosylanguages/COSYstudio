import { UniversalLearningObject } from '../types/ulo';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateUlo(ulo: Partial<UniversalLearningObject>): ValidationResult {
  const errors: string[] = [];

  if (!ulo.cid) {
    errors.push('Missing Content Identifier (cid)');
  }

  if (!ulo.subtype) {
    errors.push('Missing ULO subtype');
  }

  if (!ulo.metadata) {
    errors.push('Missing ULO metadata dimension');
  } else {
    if (!ulo.metadata.title) errors.push('Metadata missing title');
    if (!ulo.metadata.targetLanguage) errors.push('Metadata missing target language');
    if (!ulo.metadata.cefrLevel) errors.push('Metadata missing CEFR level');
    if (!ulo.metadata.theme) errors.push('Metadata missing theme');
  }

  if (!ulo.relationships) {
    errors.push('Missing relationships graph dimension');
  }

  if (!ulo.publicationTargets || ulo.publicationTargets.length === 0) {
    errors.push('At least one publication target must be specified');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
