/**
 * Protestant canon: book display names and chapter counts.
 * Per-chapter verse counts live in {@link ./bibleVerseCounts.js}.
 */
import { VERSE_COUNTS_BY_BOOK } from './bibleVerseCounts.js';

export const BIBLE_BOOKS = [
  { slug: 'genesis', name: 'Genesis', chapters: 50 },
  { slug: 'exodus', name: 'Exodus', chapters: 40 },
  { slug: 'leviticus', name: 'Leviticus', chapters: 27 },
  { slug: 'numbers', name: 'Numbers', chapters: 36 },
  { slug: 'deuteronomy', name: 'Deuteronomy', chapters: 34 },
  { slug: 'joshua', name: 'Joshua', chapters: 24 },
  { slug: 'judges', name: 'Judges', chapters: 21 },
  { slug: 'ruth', name: 'Ruth', chapters: 4 },
  { slug: '1-samuel', name: '1 Samuel', chapters: 31 },
  { slug: '2-samuel', name: '2 Samuel', chapters: 24 },
  { slug: '1-kings', name: '1 Kings', chapters: 22 },
  { slug: '2-kings', name: '2 Kings', chapters: 25 },
  { slug: '1-chronicles', name: '1 Chronicles', chapters: 29 },
  { slug: '2-chronicles', name: '2 Chronicles', chapters: 36 },
  { slug: 'ezra', name: 'Ezra', chapters: 10 },
  { slug: 'nehemiah', name: 'Nehemiah', chapters: 13 },
  { slug: 'esther', name: 'Esther', chapters: 10 },
  { slug: 'job', name: 'Job', chapters: 42 },
  { slug: 'psalms', name: 'Psalms', chapters: 150 },
  { slug: 'proverbs', name: 'Proverbs', chapters: 31 },
  { slug: 'ecclesiastes', name: 'Ecclesiastes', chapters: 12 },
  { slug: 'song-of-solomon', name: 'Song of Solomon', chapters: 8 },
  { slug: 'isaiah', name: 'Isaiah', chapters: 66 },
  { slug: 'jeremiah', name: 'Jeremiah', chapters: 52 },
  { slug: 'lamentations', name: 'Lamentations', chapters: 5 },
  { slug: 'ezekiel', name: 'Ezekiel', chapters: 48 },
  { slug: 'daniel', name: 'Daniel', chapters: 12 },
  { slug: 'hosea', name: 'Hosea', chapters: 14 },
  { slug: 'joel', name: 'Joel', chapters: 3 },
  { slug: 'amos', name: 'Amos', chapters: 9 },
  { slug: 'obadiah', name: 'Obadiah', chapters: 1 },
  { slug: 'jonah', name: 'Jonah', chapters: 4 },
  { slug: 'micah', name: 'Micah', chapters: 7 },
  { slug: 'nahum', name: 'Nahum', chapters: 3 },
  { slug: 'habakkuk', name: 'Habakkuk', chapters: 3 },
  { slug: 'zephaniah', name: 'Zephaniah', chapters: 3 },
  { slug: 'haggai', name: 'Haggai', chapters: 2 },
  { slug: 'zechariah', name: 'Zechariah', chapters: 14 },
  { slug: 'malachi', name: 'Malachi', chapters: 4 },
  { slug: 'matthew', name: 'Matthew', chapters: 28 },
  { slug: 'mark', name: 'Mark', chapters: 16 },
  { slug: 'luke', name: 'Luke', chapters: 24 },
  { slug: 'john', name: 'John', chapters: 21 },
  { slug: 'acts', name: 'Acts', chapters: 28 },
  { slug: 'romans', name: 'Romans', chapters: 16 },
  { slug: '1-corinthians', name: '1 Corinthians', chapters: 16 },
  { slug: '2-corinthians', name: '2 Corinthians', chapters: 13 },
  { slug: 'galatians', name: 'Galatians', chapters: 6 },
  { slug: 'ephesians', name: 'Ephesians', chapters: 6 },
  { slug: 'philippians', name: 'Philippians', chapters: 4 },
  { slug: 'colossians', name: 'Colossians', chapters: 4 },
  { slug: '1-thessalonians', name: '1 Thessalonians', chapters: 5 },
  { slug: '2-thessalonians', name: '2 Thessalonians', chapters: 3 },
  { slug: '1-timothy', name: '1 Timothy', chapters: 6 },
  { slug: '2-timothy', name: '2 Timothy', chapters: 4 },
  { slug: 'titus', name: 'Titus', chapters: 3 },
  { slug: 'philemon', name: 'Philemon', chapters: 1 },
  { slug: 'hebrews', name: 'Hebrews', chapters: 13 },
  { slug: 'james', name: 'James', chapters: 5 },
  { slug: '1-peter', name: '1 Peter', chapters: 5 },
  { slug: '2-peter', name: '2 Peter', chapters: 3 },
  { slug: '1-john', name: '1 John', chapters: 5 },
  { slug: '2-john', name: '2 John', chapters: 1 },
  { slug: '3-john', name: '3 John', chapters: 1 },
  { slug: 'jude', name: 'Jude', chapters: 1 },
  { slug: 'revelation', name: 'Revelation', chapters: 22 },
];

const bySlug = new Map(BIBLE_BOOKS.map((b) => [b.slug, b]));

/** Lowercase book name (with optional leading "1"/"2"/"3") → slug */
const NAME_TO_SLUG = new Map();
for (const b of BIBLE_BOOKS) {
  NAME_TO_SLUG.set(b.name.toLowerCase(), b.slug);
  const compact = b.name.toLowerCase().replace(/\s+/g, '');
  NAME_TO_SLUG.set(compact, b.slug);
}
NAME_TO_SLUG.set('songofsongs', 'song-of-solomon');
NAME_TO_SLUG.set('songofsolomon', 'song-of-solomon');
NAME_TO_SLUG.set('psalm', 'psalms');

export function getBookBySlug(slug) {
  return bySlug.get(slug) ?? BIBLE_BOOKS[0];
}

/** @returns {number} Verse count for a 1-based chapter (defaults to 1). */
export function getVerseCount(slug, chapter) {
  const counts = VERSE_COUNTS_BY_BOOK[slug];
  if (!counts?.length) return 1;
  const idx = chapter - 1;
  if (idx < 0 || idx >= counts.length) return 1;
  return counts[idx];
}

export function clampReference(slug, chapter, verse) {
  const book = getBookBySlug(slug);
  const c = Math.min(Math.max(1, chapter), book.chapters);
  const v = Math.min(Math.max(1, verse), getVerseCount(book.slug, c));
  return { slug: book.slug, chapter: c, verse: v };
}

export function formatReference(slug, chapter, verse) {
  const book = getBookBySlug(slug);
  return `${book.name} ${chapter}:${verse}`;
}

/**
 * Parse strings like "Romans 5:13", "1 John 3:16", "Psalms 23:1".
 * @returns {{ slug: string, chapter: number, verse: number } | null}
 */
export function parseReferenceString(str) {
  const s = str.trim();
  if (!s) return null;

  const m = s.match(/^(.+?)\s+(\d+)\s*:\s*(\d+)\s*$/);
  if (!m) return null;

  let bookPart = m[1].trim().replace(/\s+/g, ' ');
  const chapter = Number(m[2]);
  const verse = Number(m[3]);
  if (!Number.isFinite(chapter) || !Number.isFinite(verse) || chapter < 1 || verse < 1) {
    return null;
  }

  const key = bookPart.toLowerCase();
  let slug = NAME_TO_SLUG.get(key);
  if (!slug) {
    const compact = key.replace(/\s/g, '');
    slug = NAME_TO_SLUG.get(compact);
  }

  if (!slug) {
    const sorted = [...BIBLE_BOOKS].sort((a, b) => b.name.length - a.name.length);
    for (const b of sorted) {
      const bn = b.name.toLowerCase();
      if (key === bn || key.startsWith(`${bn} `)) {
        slug = b.slug;
        break;
      }
    }
  }

  if (!slug) return null;
  const book = getBookBySlug(slug);
  if (chapter > book.chapters) return null;
  if (verse > getVerseCount(slug, chapter)) return null;

  return { slug, chapter, verse };
}

export function applyReferenceToPickerState(parsed) {
  if (!parsed) return null;
  return clampReference(parsed.slug, parsed.chapter, parsed.verse);
}
