import {
  DISABLED_STUDY_LANGUAGE_CODES,
  STUDY_LANGUAGES,
  STUDY_LANGUAGE_CHOICE_LABELS,
} from '../lib/types.js';

export default function StudyLanguagePills({ value, onChange, studyUiLang = 'eng' }) {
  const labels = STUDY_LANGUAGE_CHOICE_LABELS[studyUiLang] ?? STUDY_LANGUAGE_CHOICE_LABELS.eng;

  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-2">
      {STUDY_LANGUAGES.map(({ code }) => {
        const active = value === code;
        const disabled = DISABLED_STUDY_LANGUAGE_CODES.has(code);
        const label = labels[code] ?? code;

        const buttonClass = [
          'rounded-full border px-4 py-2.5 font-sans text-xs font-bold tracking-wide transition-colors',
          disabled
            ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 opacity-90 ring-0'
            : active
              ? 'border-ep-accent bg-ep-accent-soft text-ep-accent-foreground shadow-inner ring-[3px] ring-ep-accent/15'
              : 'border-ep-line/90 bg-white text-gray-700 shadow-inner hover:border-gray-400 hover:bg-white',
        ].join(' ');

        return (
          <button
            key={code}
            type="button"
            disabled={disabled}
            onClick={() => !disabled && onChange(code)}
            aria-disabled={disabled}
            className={buttonClass}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
