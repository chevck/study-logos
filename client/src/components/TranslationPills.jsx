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
              'rounded-xl border px-4 py-2.5 font-sans text-xs font-bold uppercase tracking-wide transition-colors',
              active
                ? 'border-ep-blue bg-blue-50 text-ep-blue shadow-sm ring-1 ring-ep-blue/20'
                : 'border-gray-300 bg-white text-gray-700 shadow-sm hover:border-gray-400 hover:bg-gray-50',
            ].join(' ')}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
