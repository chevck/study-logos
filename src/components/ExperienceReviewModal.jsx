import { useEffect, useMemo, useState } from 'react';
import AppIcon from './AppIcon.jsx';
import { submitExperienceReview } from '../lib/api.js';
import { inputClass, labelClass, primaryBtn } from '../lib/uiClasses.js';

function RatingGrid({ value, onChange, name, lowLabel, highLabel }) {
  const scores = useMemo(() => Array.from({ length: 10 }, (_, i) => i + 1), []);

  return (
    <div>
      <div
        className="grid grid-cols-4 gap-2 sm:grid-cols-5"
        role="radiogroup"
        aria-label={name}
      >
        {scores.map((score) => {
          const selected = value === score;
          return (
            <button
              key={score}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(score)}
              className={[
                'min-h-[2.75rem] rounded-xl border text-sm font-extrabold tabular-nums transition',
                selected
                  ? 'border-ep-accent bg-ep-accent-soft text-ep-ink ring-2 ring-ep-accent/25'
                  : 'border-ep-line bg-ep-surface-panel text-ep-ink hover:border-ep-accent hover:bg-ep-accent-soft/60',
              ].join(' ')}
            >
              {score}
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between gap-3 text-[11px] font-semibold text-ep-faint">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}

const EMPTY_FORM = {
  rating: null,
  recommendRating: null,
  enjoyedMost: '',
  wishHad: '',
  mostHelpfulSection: '',
};

export default function ExperienceReviewModal({ open, copy, onSubmitted }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return undefined;
    setForm(EMPTY_FORM);
    setError('');
    setSubmitting(false);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function blockEscape(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
      }
    }

    window.addEventListener('keydown', blockEscape, true);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', blockEscape, true);
    };
  }, [open]);

  const sectionOptions = copy.experienceReviewSections;

  const isValid =
    form.rating != null &&
    form.recommendRating != null &&
    form.enjoyedMost.trim().length >= 3 &&
    form.wishHad.trim().length >= 3 &&
    sectionOptions.some((option) => option.value === form.mostHelpfulSection);

  if (!open) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isValid || submitting) return;

    setSubmitting(true);
    setError('');
    try {
      await submitExperienceReview({
        rating: form.rating,
        recommendRating: form.recommendRating,
        enjoyedMost: form.enjoyedMost.trim(),
        wishHad: form.wishHad.trim(),
        mostHelpfulSection: form.mostHelpfulSection,
      });
      onSubmitted?.();
    } catch (err) {
      setError(err.message || copy.experienceReviewSubmitError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-ep-ink/55 p-0 backdrop-blur-[3px] sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="experience-review-title"
    >
      <div className="flex max-h-[100dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-[1.75rem] border border-ep-line/90 bg-ep-surface-panel shadow-card-lg sm:max-h-[min(100dvh,720px)] sm:rounded-[1.75rem]">
        <div className="shrink-0 border-b border-ep-line/80 px-5 py-4 sm:px-6">
          <div className="mb-3 flex justify-center">
            <AppIcon variant="gold" className="h-12 w-12" alt="" />
          </div>
          <p id="experience-review-title" className="text-center font-sans text-xl font-extrabold tracking-tight text-ep-ink">
            {copy.experienceReviewTitle}
          </p>
          <p className="mt-2 text-center text-sm font-medium leading-relaxed text-ep-subtle">
            {copy.experienceReviewIntro}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6">
            <div className="flex flex-col gap-5">
              <fieldset>
                <legend className={labelClass}>{copy.experienceReviewRatingLabel}</legend>
                <div className="mt-2">
                  <RatingGrid
                    name={copy.experienceReviewRatingLabel}
                    value={form.rating}
                    onChange={(rating) => setForm((prev) => ({ ...prev, rating }))}
                    lowLabel={copy.experienceReviewRatingLow}
                    highLabel={copy.experienceReviewRatingHigh}
                  />
                </div>
              </fieldset>

              <div>
                <label htmlFor="experience-enjoyed" className={labelClass}>
                  {copy.experienceReviewEnjoyedLabel}
                </label>
                <textarea
                  id="experience-enjoyed"
                  required
                  rows={3}
                  value={form.enjoyedMost}
                  onChange={(e) => setForm((prev) => ({ ...prev, enjoyedMost: e.target.value }))}
                  className={`${inputClass} mt-2 min-h-[5.5rem] resize-y`}
                  placeholder={copy.experienceReviewEnjoyedPlaceholder}
                />
              </div>

              <div>
                <label htmlFor="experience-wish" className={labelClass}>
                  {copy.experienceReviewWishLabel}
                </label>
                <textarea
                  id="experience-wish"
                  required
                  rows={3}
                  value={form.wishHad}
                  onChange={(e) => setForm((prev) => ({ ...prev, wishHad: e.target.value }))}
                  className={`${inputClass} mt-2 min-h-[5.5rem] resize-y`}
                  placeholder={copy.experienceReviewWishPlaceholder}
                />
              </div>

              <fieldset>
                <legend className={labelClass}>{copy.experienceReviewRecommendLabel}</legend>
                <div className="mt-2">
                  <RatingGrid
                    name={copy.experienceReviewRecommendLabel}
                    value={form.recommendRating}
                    onChange={(recommendRating) =>
                      setForm((prev) => ({ ...prev, recommendRating }))
                    }
                    lowLabel={copy.experienceReviewRecommendLow}
                    highLabel={copy.experienceReviewRecommendHigh}
                  />
                </div>
              </fieldset>

              <div>
                <label htmlFor="experience-section" className={labelClass}>
                  {copy.experienceReviewSectionLabel}
                </label>
                <select
                  id="experience-section"
                  required
                  value={form.mostHelpfulSection}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, mostHelpfulSection: e.target.value }))
                  }
                  className={`${inputClass} mt-2`}
                >
                  <option value="">{copy.experienceReviewSectionPlaceholder}</option>
                  {sectionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {error ? (
                <p className="text-sm font-semibold text-ep-danger-text" role="alert">
                  {error}
                </p>
              ) : null}
            </div>
          </div>

          <div className="shrink-0 border-t border-ep-line/80 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
            <button
              type="submit"
              disabled={!isValid || submitting}
              className={primaryBtn}
            >
              {submitting ? copy.experienceReviewSubmitting : copy.experienceReviewSubmit}
            </button>
            <p className="mt-3 text-center text-xs font-medium text-ep-faint">
              {copy.experienceReviewRequiredNote}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
