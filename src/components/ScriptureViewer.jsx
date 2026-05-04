export default function ScriptureViewer({ verseText, activeWord, onWordClick, ariaLabel }) {
  const tokens = verseText?.trim() ? verseText.trim().match(/\S+/g) ?? [] : [];

  return (
    <div
      className="rounded-xl border border-gray-200 bg-slate-50 p-3 font-sans text-[1rem] font-semibold leading-[1.85] text-ep-ink sm:p-5 sm:text-[1.1rem] sm:leading-[1.95] md:text-[1.15rem]"
      role="region"
      aria-label={ariaLabel ?? 'Scripture passage'}
    >
      {tokens.map((word, i) => {
        const isActive = word === activeWord;
        return (
          <span key={`${i}-${word}`}>
            <button
              type="button"
              onClick={() => onWordClick(word)}
              className={[
                'inline touch-manipulation rounded-lg border px-1 py-0.5 align-baseline transition-colors duration-150',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ep-blue',
                isActive
                  ? 'border-ep-blue bg-blue-100 text-ep-ink shadow-sm'
                  : 'border-transparent bg-white text-ep-ink hover:border-gray-300 hover:bg-white',
              ].join(' ')}
            >
              {word}
            </button>
            {i < tokens.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </div>
  );
}
