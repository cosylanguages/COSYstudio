/**
 * Content Identifier (CID) Utility for COSYstudio
 */

export function generateCid(prefix: string = 'ulo'): string {
  const randomSuffix = Math.random().toString(36).substring(2, 10);
  const timestamp = Date.now().toString(36);
  return `cid_${prefix}_${timestamp}${randomSuffix}`;
}

export function isValidCid(cid: string): boolean {
  return /^cid_[a-zA-Z0-9]+_[a-zA-Z0-9_-]+$/.test(cid);
}

export function parseCidPrefix(cid: string): string | null {
  const match = cid.match(/^cid_([a-zA-Z0-9]+)_/);
  return match ? match[1] : null;
}
