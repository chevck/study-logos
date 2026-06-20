import { pillActive, pillInactive } from '../lib/uiClasses.js';

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
              active ? pillActive : pillInactive,
            ].join(' ')}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
