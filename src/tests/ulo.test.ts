import { describe, it } from 'node:test';
import assert from 'node:assert';
import { generateCid, isValidCid, parseCidPrefix } from '../utils/cid';
import { validateUlo, validateBlock } from '../utils/validate';
import { transformUlo } from '../utils/transformer';
import { UniversalLearningObject, LessonBlock } from '../types/ulo';
import * as sampleUloRaw from '../../tests/fixtures/sample-ulo.json';

const sampleUlo = sampleUloRaw as unknown as UniversalLearningObject;

describe('COSYstudio ULO Engine Tests', () => {
  describe('CID Utility', () => {
    it('should generate valid CIDs with prefix', () => {
      const cid = generateCid('ulo');
      assert.strictEqual(isValidCid(cid), true);
      assert.strictEqual(parseCidPrefix(cid), 'ulo');
    });

    it('should validate correctly', () => {
      assert.strictEqual(isValidCid('cid_ulo_12345'), true);
      assert.strictEqual(isValidCid('invalid_cid'), false);
    });
  });

  describe('Schema Validation', () => {
    it('should validate a valid ULO instance', () => {
      const result = validateUlo(sampleUlo);
      assert.strictEqual(result.valid, true, `Errors: ${result.errors.join(', ')}`);
    });

    it('should reject an invalid ULO instance missing required fields', () => {
      const invalidUlo = { ...sampleUlo, cid: undefined };
      const result = validateUlo(invalidUlo);
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.length > 0);
    });

    it('should validate a valid Lesson Block', () => {
      const validBlock: LessonBlock = {
        blockId: 'block_901',
        type: 'heading',
        properties: { level: 1 }
      };
      const result = validateBlock(validBlock);
      assert.strictEqual(result.valid, true);
    });
  });

  describe('Target Transformation Engine', () => {
    it('should transform ULO for COSYlanguages target', () => {
      const output = transformUlo(sampleUlo, 'COSYlanguages');
      assert.strictEqual(output.target, 'COSYlanguages');
      assert.strictEqual(output.format, 'HTML5_INTERACTIVE_CARD');
      assert.strictEqual(output.data.cid, sampleUlo.cid);
    });

    it('should transform ULO for COSYgames target', () => {
      const output = transformUlo(sampleUlo, 'COSYgames');
      assert.strictEqual(output.target, 'COSYgames');
      assert.strictEqual(output.format, 'ARCADE_WORD_PAIR_POOL');
    });

    it('should transform ULO for COSYworld target', () => {
      const output = transformUlo(sampleUlo, 'COSYworld');
      assert.strictEqual(output.target, 'COSYworld');
      assert.strictEqual(output.format, 'SPATIAL_3D_NPC_TREE');
    });

    it('should transform ULO for PDF Worksheet target', () => {
      const output = transformUlo(sampleUlo, 'PDF_WORKSHEET');
      assert.strictEqual(output.target, 'PDF_WORKSHEET');
      assert.strictEqual(output.format, 'VECTOR_PDF_A4');
    });
  });
});
