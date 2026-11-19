import { randomUUID } from 'node:crypto';

/**
 * Content Identifier (CID) Utility for COSYstudio
 */

export function generateCid(prefix: string = 'ulo'): string {
  const timestamp = Date.now().toString(36);
  const randomSuffix = randomUUID().replace(/-/g, '').substring(0, 12);
  return `cid_${prefix}_${timestamp}${randomSuffix}`;
}

export function isValidCid(cid: string): boolean {
  return /^cid_[a-zA-Z0-9]+_[a-zA-Z0-9_-]+$/.test(cid);
}

export function parseCidPrefix(cid: string): string | null {
  const match = cid.match(/^cid_([a-zA-Z0-9]+)_/);
  return match ? match[1] : null;
}

/** True only for ULO ids, i.e. what schemas/ulo.schema.json accepts for `cid`. */
export function isUloCid(cid: string): boolean {
  return /^cid_ulo_[a-zA-Z0-9_-]+$/.test(cid);
}
