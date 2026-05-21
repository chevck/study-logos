/** Lowercase token with edge punctuation stripped for matching. */
export function normalizeToken(token) {
  return (token || '')
    .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '')
    .toLowerCase();
}

function tokenizeVerse(verseText) {
  return verseText?.trim() ? verseText.trim().match(/\S+/g) ?? [] : [];
}

/**
 * Find the verse token matching the main breakdown word (no API calls).
 * @returns {string | null} Exact token from the verse text, for highlighting.
 */
export function findTokenInVerse(verseText, targetWord) {
  const target = normalizeToken(targetWord);
  if (!target) return null;
  return tokenizeVerse(verseText).find((t) => normalizeToken(t) === target) ?? null;
}
