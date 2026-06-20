import {
  DISABLED_STUDY_LANGUAGE_CODES,
  STUDY_LANGUAGES,
  STUDY_LANGUAGE_CHOICE_LABELS,
} from '../lib/types.js';
import { pillActive, pillInactive } from '../lib/uiClasses.js';

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
            ? 'ep-pill-disabled'
            : active
              ? pillActive
              : pillInactive,
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
