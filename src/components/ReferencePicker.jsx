import { useMemo } from 'react';
import {
  BIBLE_BOOKS,
  getBookBySlug,
  getVerseCount,
} from '../lib/bibleBooks.js';

const labelClass =
  'text-[11px] font-extrabold uppercase tracking-[0.14em] text-ep-muted';

const segmentSelectClass =
  'w-full min-h-[3.25rem] cursor-pointer appearance-none border-0 bg-transparent py-2.5 pl-3.5 pr-9 text-sm font-semibold text-ep-ink outline-none transition hover:bg-ep-surface-muted/80 focus:bg-ep-accent-soft/50 disabled:cursor-not-allowed disabled:opacity-50';

function IconChevronDown({ className }) {
  return (
    <svg
      className={className}
      viewBox='0 0 20 20'
      fill='currentColor'
      aria-hidden
    >
      <path
        fillRule='evenodd'
        d='M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z'
        clipRule='evenodd'
      />
    </svg>
  );
}

function SelectSegment({
  id,
  value,
  onChange,
  disabled,
  ariaLabel,
  children,
  className = '',
  widthClass = '',
}) {
  return (
    <div className={`relative min-w-0 ${widthClass}`}>
      <select
        id={id}
        disabled={disabled}
        value={value}
        onChange={onChange}
        className={`${segmentSelectClass} ${className}`}
        aria-label={ariaLabel}
      >
        {children}
      </select>
      <IconChevronDown className='pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ep-muted/80' />
    </div>
  );
}

export default function ReferencePicker({
  bookSlug,
  chapter,
  verse,
  onBookSlugChange,
  onChapterChange,
  onVerseChange,
  disabled,
  labels,
}) {
  const book = useMemo(() => getBookBySlug(bookSlug), [bookSlug]);

  const chapterOptions = useMemo(
    () => Array.from({ length: book.chapters }, (_, i) => i + 1),
    [book.chapters],
  );

  const verseOptions = useMemo(
    () =>
      Array.from(
        { length: getVerseCount(bookSlug, chapter) },
        (_, i) => i + 1,
      ),
    [bookSlug, chapter],
  );

  const safeVerse = Math.min(verse, verseOptions.length || 1);

  return (
    <fieldset className='min-w-0 border-0 p-0'>
      <legend className='sr-only'>{labels.srPassageGroup}</legend>

      <div className='mb-2 grid grid-cols-[minmax(0,1fr)_4.75rem_4.75rem] gap-2 sm:grid-cols-[minmax(0,1fr)_5rem_5rem] sm:gap-3'>
        <span className={labelClass}>{labels.labelBook}</span>
        <span className={`${labelClass} text-center`}>{labels.labelChapter}</span>
        <span className={`${labelClass} text-center`}>{labels.labelVerse}</span>
      </div>

      <div
        className={[
          'grid grid-cols-[minmax(0,1fr)_4.75rem_4.75rem] overflow-hidden rounded-2xl border border-ep-line/90 bg-white shadow-innerSoft transition',
          'focus-within:border-ep-accent focus-within:ring-[3px] focus-within:ring-ep-accent/15',
          'sm:grid-cols-[minmax(0,1fr)_5rem_5rem]',
          disabled ? 'opacity-60' : '',
        ].join(' ')}
      >
        <SelectSegment
          id='ref-book'
          disabled={disabled}
          value={bookSlug}
          onChange={(e) => onBookSlugChange(e.target.value)}
          ariaLabel={labels.labelBook}
          className='text-base sm:pl-4'
        >
          {BIBLE_BOOKS.map((b) => (
            <option key={b.slug} value={b.slug}>
              {b.name}
            </option>
          ))}
        </SelectSegment>

        <div className='border-l border-ep-line/80'>
          <SelectSegment
            id='ref-chapter'
            disabled={disabled}
            value={chapter}
            onChange={(e) => onChapterChange(Number(e.target.value))}
            ariaLabel={labels.labelChapter}
            className='text-center tabular-nums'
          >
            {chapterOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </SelectSegment>
        </div>

        <div className='border-l border-ep-line/80'>
          <SelectSegment
            id='ref-verse'
            disabled={disabled}
            value={safeVerse}
            onChange={(e) => onVerseChange(Number(e.target.value))}
            ariaLabel={labels.labelVerse}
            className='text-center tabular-nums'
          >
            {verseOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </SelectSegment>
        </div>
      </div>
    </fieldset>
  );
}
