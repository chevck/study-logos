export default function ScriptureViewer({
  verseText,
  activeWord,
  highlightWord,
  onWordClick,
  ariaLabel,
  interactive = true,
}) {
  const tokens = verseText?.trim() ? verseText.trim().match(/\S+/g) ?? [] : [];
  const marked = highlightWord ?? activeWord;

  return (
    <div
      className="rounded-2xl border border-ep-line/85 bg-white/90 p-3 font-sans text-[1rem] font-semibold leading-[1.85] text-ep-ink shadow-inner backdrop-blur-sm sm:p-5 sm:text-[1.1rem] sm:leading-[1.95] md:text-[1.15rem]"
      role="region"
      aria-label={ariaLabel ?? 'Scripture passage'}
    >
      {tokens.map((word, i) => {
        const isMarked = marked != null && word === marked;
        const gap = i < tokens.length - 1 ? ' ' : '';

        if (!interactive) {
          return (
            <span key={`${i}-${word}`}>
              <span
                className={[
                  'inline rounded-lg border px-1 py-0.5 align-baseline',
                  isMarked
                    ? 'border-ep-accent bg-ep-accent-soft text-ep-ink shadow-sm ring-2 ring-ep-accent/25'
                    : 'border-transparent text-ep-ink',
                ].join(' ')}
              >
                {word}
              </span>
              {gap}
            </span>
          );
        }

        return (
          <span key={`${i}-${word}`}>
            <button
              type="button"
              onClick={() => onWordClick?.(word)}
              className={[
                'inline touch-manipulation rounded-lg border px-1 py-0.5 align-baseline transition-colors duration-150',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ep-accent',
                isMarked
                  ? 'border-ep-accent bg-ep-accent-soft text-ep-ink shadow-sm ring-2 ring-ep-accent/25'
                  : 'border-transparent bg-white text-ep-ink hover:border-gray-300 hover:bg-white',
              ].join(' ')}
            >
              {word}
            </button>
            {gap}
          </span>
        );
      })}
    </div>
  );
}
