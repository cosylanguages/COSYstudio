import { describe, it, expect } from 'vitest';
import { generateCid, isValidCid } from '../src/core/cid';
import { validateUlo } from '../src/core/validator';
import { transformUloForTarget } from '../src/core/transformer';
import { MOCK_ULOS } from '../src/data/mockUlos';

describe('COSYstudio Core ULO Engine', () => {
  it('generates valid CIDs', () => {
    const cid = generateCid();
    expect(isValidCid(cid)).toBe(true);
    expect(cid.startsWith('cid_ulo_')).toBe(true);
  });

  it('validates correct ULO instances', () => {
    const sampleUlo = MOCK_ULOS[0];
    const result = validateUlo(sampleUlo);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('detects invalid ULO missing metadata', () => {
    const invalidUlo = { cid: 'cid_ulo_123', subtype: 'LESSON' } as any;
    const result = validateUlo(invalidUlo);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('transforms ULO for COSYlanguages target', () => {
    const sampleUlo = MOCK_ULOS[0];
    const transformed = transformUloForTarget(sampleUlo, 'COSYlanguages');
    expect(transformed.target).toBe('COSYlanguages');
    expect(transformed.payload.type).toBe('InteractiveCard');
  });

  it('transforms ULO for COSYworld target', () => {
    const sampleUlo = MOCK_ULOS[0];
    const transformed = transformUloForTarget(sampleUlo, 'COSYworld');
    expect(transformed.target).toBe('COSYworld');
    expect(transformed.payload.type).toBe('3D_RPG_NPC_DialogueTree');
  });
});
