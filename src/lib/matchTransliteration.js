/**
 * Find the verse token matching the main breakdown word (no API calls).
 * @returns {string | null} Exact token from the verse text, for highlighting.
 */
export function findTokenInVerse(verseText, targetWord) {
  const target = normalizeToken(targetWord);
  if (!target) return null;
  return tokenizeVerse(verseText).find((t) => normalizeToken(t) === target) ?? null;
}

/**
 * Find an exact phrase substring in the verse for cross-reference highlighting.
 * @returns {string | null} The phrase text if found in the verse, else null.
 */
export function findPhraseInVerse(verseText, targetPhrase) {
  const phrase = String(targetPhrase ?? "").trim();
  if (!phrase || !verseText) return null;
  return verseText.includes(phrase) ? phrase : null;
}

/** Lowercase token with edge punctuation stripped for matching. */
export function normalizeToken(token) {
  return (token || "")
    .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "")
    .toLowerCase();
}

function tokenizeVerse(verseText) {
  return verseText?.trim() ? (verseText.trim().match(/\S+/g) ?? []) : [];
}
