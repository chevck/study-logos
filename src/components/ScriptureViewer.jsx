export default function ScriptureViewer({
  verseText,
  phrases,
  activePhraseId,
  highlightPhraseId,
  highlightPhraseText,
  onPhraseClick,
  ariaLabel,
  interactive = true,
}) {
  const markedId = highlightPhraseId ?? activePhraseId;

  if (phrases?.length) {
    return (
      <div
        className="ep-inner-panel p-3 font-sans text-[1rem] font-semibold leading-[1.85] text-ep-ink sm:p-5 sm:text-[1.1rem] sm:leading-[1.95] md:text-[1.15rem]"
        role="region"
        aria-label={ariaLabel ?? "Scripture passage"}
      >
        {phrases.map((phrase) => {
          const isMarked = markedId != null && phrase.id === markedId;

          if (!interactive) {
            return (
              <span
                key={phrase.id}
                className={[
                  "inline rounded-lg border px-1 py-0.5 align-baseline",
                  isMarked
                    ? "border-ep-accent bg-ep-accent-soft text-ep-ink shadow-sm ring-2 ring-ep-accent/25"
                    : "border-transparent text-ep-ink",
                ].join(" ")}
              >
                {phrase.text}
              </span>
            );
          }

          return (
            <button
              key={phrase.id}
              type="button"
              onClick={() => onPhraseClick?.(phrase)}
              className={[
                "inline touch-manipulation rounded-lg border px-1 py-0.5 align-baseline transition-colors duration-150",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ep-accent",
                isMarked
                  ? "border-ep-accent bg-ep-accent-soft text-ep-ink shadow-sm ring-2 ring-ep-accent/25"
                  : "border-transparent bg-ep-surface-panel text-ep-ink hover:border-ep-line hover:bg-ep-surface-muted",
              ].join(" ")}
            >
              {phrase.text}
            </button>
          );
        })}
      </div>
    );
  }

  const highlight = highlightPhraseText?.trim();
  if (highlight && verseText?.includes(highlight)) {
    const idx = verseText.indexOf(highlight);
    const before = verseText.slice(0, idx);
    const after = verseText.slice(idx + highlight.length);

    return (
      <div
        className="ep-inner-panel p-3 font-sans text-[1rem] font-semibold leading-[1.85] text-ep-ink sm:p-5 sm:text-[1.1rem] sm:leading-[1.95] md:text-[1.15rem]"
        role="region"
        aria-label={ariaLabel ?? "Scripture passage"}
      >
        {before}
        <span className="inline rounded-lg border border-ep-accent bg-ep-accent-soft px-1 py-0.5 align-baseline text-ep-ink shadow-sm ring-2 ring-ep-accent/25">
          {highlight}
        </span>
        {after}
      </div>
    );
  }

  return (
    <div
      className="ep-inner-panel p-3 font-sans text-[1rem] font-semibold leading-[1.85] text-ep-ink sm:p-5 sm:text-[1.1rem] sm:leading-[1.95] md:text-[1.15rem]"
      role="region"
      aria-label={ariaLabel ?? "Scripture passage"}
    >
      {verseText}
    </div>
  );
}
