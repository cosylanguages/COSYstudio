import Ajv2020 from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import * as uloSchema from '../../schemas/ulo.schema.json';
import * as blocksSchema from '../../schemas/blocks.schema.json';
import { UniversalLearningObject, LessonBlock } from '../types/ulo';

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);

const validateUloFn = ajv.compile(uloSchema);
const validateBlockFn = ajv.compile(blocksSchema);

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateUlo(ulo: unknown): ValidationResult {
  const valid = validateUloFn(ulo);
  if (valid) {
    return { valid: true, errors: [] };
  }
  const errors = (validateUloFn.errors || []).map(
    (e) => `${e.instancePath || 'root'} ${e.message}`
  );
  return { valid: false, errors };
}

export function validateBlock(block: unknown): ValidationResult {
  const valid = validateBlockFn(block);
  if (valid) {
    return { valid: true, errors: [] };
  }
  const errors = (validateBlockFn.errors || []).map(
    (e) => `${e.instancePath || 'root'} ${e.message}`
  );
  return { valid: false, errors };
}
