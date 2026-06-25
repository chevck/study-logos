/** Match server-side normalizeVerseText in phrase-align.js */
export function normalizeVerseText(raw) {
  return String(raw ?? "")
    .normalize("NFKC")
    .replace(/[\u2018\u2019\u2032\u0060]/g, "'")
    .replace(/[\u201C\u201D\u2033]/g, '"')
    .replace(/[\u0000-\u001f]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
