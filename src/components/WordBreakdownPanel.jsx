import SkeletonLoader from './SkeletonLoader.jsx';
import { appCopy, CASE_STYLES, CASE_STUDY_LABELS } from '../lib/types.js';

function styleForCaseStudy(styleKey, studyLanguage) {
  const key = styleKey && CASE_STYLES[styleKey] ? styleKey : 'story';
  const labels = CASE_STUDY_LABELS[studyLanguage] ?? CASE_STUDY_LABELS.eng;
  return { pill: CASE_STYLES[key].pill, label: labels[key] };
}

/** Outer flight-style card */
const shell =
  'overflow-hidden rounded-[1.75rem] border border-ep-line/90 bg-white font-sans shadow-card-lg backdrop-blur-sm';

export default function WordBreakdownPanel({
  breakdown,
  loading,
  onSave,
  savedWords,
  onCrossRefClick,
  breadcrumbs,
  onBack,
  studyLanguage = 'eng',
}) {
  const empty = !loading && !breakdown;
  const copy = appCopy(studyLanguage);
  const seg = copy.segments;

  return (
    <section className={shell}>
      {breadcrumbs?.length > 0 && onBack && (
        <div className="flex flex-wrap items-center gap-2 border-b border-ep-line bg-white px-4 py-3 sm:gap-3 sm:px-6 sm:py-4">
          <button
            type="button"
            onClick={onBack}
            className='rounded-full border border-ep-line/90 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-gray-700 shadow-inner transition hover:bg-ep-accent-soft hover:text-ep-ink'
          >
            {copy.breakdownBack}
          </button>
          <nav className="flex flex-wrap items-center gap-1 text-xs font-semibold text-gray-600">
            {breadcrumbs.map((crumb, i) => (
              <span key={`${crumb}-${i}`} className="flex items-center gap-1">
                {i > 0 ? <span className="text-gray-400" aria-hidden>/</span> : null}
                <span className="font-bold text-ep-ink">{crumb}</span>
              </span>
            ))}
          </nav>
        </div>
      )}

      {loading && (
        <div className="border-b border-ep-line bg-white px-4 py-3 sm:px-6 sm:py-4">
          <p className="text-sm font-semibold text-gray-600">{copy.breakdownLoading}</p>
        </div>
      )}

      {!loading && breakdown && (
        <div className="flex flex-col gap-4 border-b border-ep-line px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:px-6 sm:py-5">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-ep-muted">{copy.selectedWord}</p>
            <p className="mt-1 break-words font-sans text-2xl font-extrabold tracking-tight text-ep-ink sm:text-3xl">
              {breakdown.word}
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-600">{breakdown.reference}</p>
          </div>
          <button
            type="button"
            onClick={onSave}
            className={
              savedWords
                ? 'w-full shrink-0 rounded-full bg-[#3D3D3D] px-6 py-3 text-sm font-bold text-white shadow-inner transition hover:bg-[#2A2A2A] sm:w-auto'
                : 'w-full shrink-0 rounded-full bg-ep-accent px-6 py-3 text-sm font-bold text-ep-accent-foreground shadow-soft transition hover:bg-ep-accent-hover sm:w-auto'
            }
          >
            {savedWords ? copy.savedNotebook : copy.saveNotebook}
          </button>
        </div>
      )}

      <div className="overflow-visible">
        {empty && (
          <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 px-4 py-10 text-center sm:min-h-[240px] sm:px-6 sm:py-14">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-ep-line/80 bg-ep-accent-soft text-xl text-ep-accent shadow-inner">
              ✦
            </div>
            <p className="max-w-sm text-sm font-semibold leading-relaxed text-gray-600">
              {copy.breakdownEmptyHint}
            </p>
          </div>
        )}

        {loading && (
          <div className="p-4 sm:p-6">
            <SkeletonLoader ariaLabel={copy.skeletonAria} />
          </div>
        )}

        {!loading && breakdown && (
          <div className="border-t border-ep-line/80 bg-ep-surface-muted/95 px-4 py-6 sm:px-6 sm:py-8">
            <div className="mx-auto flex max-w-3xl flex-col gap-5">
              <BreakdownSegment title={seg.originalLanguage}>
                <p className="text-xl font-bold text-ep-ink">{breakdown.original}</p>
                <p className="mt-1 text-sm font-semibold italic text-gray-700">{breakdown.transliteration}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                  {breakdown.language}
                </p>
              </BreakdownSegment>

              <BreakdownSegment title={seg.definition}>
                <p className="text-[15px] font-medium leading-relaxed text-ep-ink">{breakdown.definition}</p>
              </BreakdownSegment>

              <BreakdownSegment title={seg.caseStudy}>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span
                    className={[
                      'rounded-full border px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide',
                      styleForCaseStudy(breakdown.caseStudyStyle, studyLanguage).pill,
                    ].join(' ')}
                  >
                    {breakdown.caseStudyLabel ||
                      styleForCaseStudy(breakdown.caseStudyStyle, studyLanguage).label}
                  </span>
                </div>
                <div
                  className="max-w-none text-[15px] font-medium leading-relaxed text-ep-ink [&_em]:italic [&_em]:text-gray-700 [&_p+p]:mt-3 [&_strong]:font-bold [&_strong]:text-ep-ink"
                  dangerouslySetInnerHTML={{ __html: breakdown.caseStudy || '' }}
                />
              </BreakdownSegment>

              <BreakdownSegment title={seg.crossRefs}>
                <div className="flex flex-wrap gap-2">
                  {(breakdown.crossReferences || []).map((ref) => (
                    <button
                      key={ref}
                      type="button"
                      onClick={() => onCrossRefClick(ref)}
                      className="rounded-full border border-ep-line bg-white px-4 py-2 text-left text-xs font-bold text-ep-ink shadow-inner transition hover:border-ep-accent hover:bg-ep-accent-soft"
                    >
                      {ref}
                    </button>
                  ))}
                </div>
              </BreakdownSegment>

              <BreakdownSegment title={seg.commentary} className="mb-0">
                <p className="text-[15px] font-medium leading-relaxed text-ep-ink">{breakdown.commentary}</p>
                {breakdown.commentaryAttribution && (
                  <p className="mt-3 text-xs font-semibold italic text-gray-600">
                    {breakdown.commentaryAttribution}
                  </p>
                )}
              </BreakdownSegment>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function BreakdownSegment({ title, children, className = '' }) {
  return (
    <div
      className={`rounded-2xl border border-ep-line/80 bg-white p-4 shadow-card sm:p-5 ${className}`}
    >
      <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-gray-500">{title}</p>
      {children}
    </div>
  );
}
