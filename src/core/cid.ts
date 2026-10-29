/**
 * Deterministic & unique Content Identifier (CID) generator for COSYstudio
 * Format: cid_ulo_<timestamp_base36><random_suffix>
 */
export function generateCid(prefix = 'cid_ulo'): string {
  const timePart = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timePart}${randomPart}`;
}

export function isValidCid(cid: string): boolean {
  return /^cid_[a-z0-9]+_[a-z0-9]+$/i.test(cid);
}
