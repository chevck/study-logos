export default function TranslationPills({ value, onChange, codes }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {codes.map((code) => {
        const active = value === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => onChange(code)}
            className={[
              'rounded-full border px-4 py-2.5 font-sans text-xs font-bold uppercase tracking-wide transition-colors',
              active
                ? 'border-ep-accent bg-ep-accent-soft text-ep-accent-foreground shadow-inner ring-[3px] ring-ep-accent/15'
                : 'border-ep-line/90 bg-white text-gray-700 shadow-inner hover:border-gray-400 hover:bg-white',
            ].join(' ')}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
