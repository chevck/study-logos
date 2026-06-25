import { useEffect, useMemo, useState } from 'react';
import AppIcon from './AppIcon.jsx';
import SkeletonLoader from './SkeletonLoader.jsx';
import ScriptureViewer from './ScriptureViewer.jsx';
import { appCopy, CASE_STYLES, CASE_STUDY_LABELS } from '../lib/types.js';

function styleForCaseStudy(styleKey, studyLanguage) {
  const key = styleKey && CASE_STYLES[styleKey] ? styleKey : 'story';
  const labels = CASE_STUDY_LABELS[studyLanguage] ?? CASE_STUDY_LABELS.eng;
  return { pill: CASE_STYLES[key].pill, label: labels[key] };
}

function crossRefLabel(ref) {
  return typeof ref === 'string' ? ref.trim() : '';
}

function isActiveCrossRef(preview, ref) {
  const label = crossRefLabel(ref);
  return Boolean(label && preview?.clickedReference === label);
}

function getFirstMentions(breakdown) {
  if (Array.isArray(breakdown?.firstMentions) && breakdown.firstMentions.length) {
    return breakdown.firstMentions;
  }
  if (breakdown?.firstMention?.reference) {
    return [breakdown.firstMention];
  }
  return [];
}

const shell =
  'overflow-hidden rounded-[1.75rem] border border-ep-line/90 bg-ep-surface-panel font-sans shadow-card-lg backdrop-blur-sm';

export default function WordBreakdownPanel({
  breakdown,
  loading,
  onSave,
  savedWords,
  saveRequiresLogin = false,
  onCrossRefClick,
  crossRefPreview,
  studyLanguage = 'eng',
}) {
  const empty = !loading && !breakdown;
  const copy = appCopy(studyLanguage);
  const seg = copy.segments;
  const surfacePhrase = breakdown?.phrase ?? breakdown?.word;
  const firstMentions = useMemo(
    () => (breakdown ? getFirstMentions(breakdown) : []),
    [breakdown],
  );
  const [firstMentionOpen, setFirstMentionOpen] = useState(false);

  useEffect(() => {
    setFirstMentionOpen(false);
  }, [breakdown?.phrase, breakdown?.reference, breakdown?.original]);

  return (
    <section className={shell}>
      {loading && (
        <div className="border-b border-ep-line bg-ep-surface-panel px-4 py-3 sm:px-6 sm:py-4">
          <p className="text-sm font-semibold text-ep-subtle">{copy.breakdownLoading}</p>
        </div>
      )}

      {!loading && breakdown && (
        <div className="flex flex-col gap-4 border-b border-ep-line px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:px-6 sm:py-5">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-ep-muted">{copy.selectedPhrase}</p>
            <p className="mt-1 break-words font-sans text-2xl font-extrabold tracking-tight text-ep-ink sm:text-3xl">
              {surfacePhrase}
            </p>
            <p className="mt-1 text-sm font-semibold text-ep-subtle">{breakdown.reference}</p>
          </div>
          <button
            type="button"
            onClick={onSave}
            className={
              savedWords
                ? 'w-full shrink-0 rounded-full bg-ep-saved px-6 py-3 text-sm font-bold text-ep-surface-panel shadow-inner transition hover:bg-ep-saved-hover sm:w-auto'
                : 'w-full shrink-0 rounded-full bg-ep-accent px-6 py-3 text-sm font-bold text-ep-accent-foreground shadow-soft transition hover:bg-ep-accent-hover sm:w-auto'
            }
          >
            {savedWords
              ? copy.savedNotebook
              : saveRequiresLogin
                ? copy.saveNotebookSignIn
                : copy.saveNotebook}
          </button>
        </div>
      )}

      <div className="overflow-visible">
        {empty && (
          <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 px-4 py-10 text-center sm:min-h-[240px] sm:px-6 sm:py-14">
            <div className="flex h-14 w-14 items-center justify-center">
              <AppIcon variant="gold" className="h-14 w-14" alt="" />
            </div>
            <p className="max-w-sm text-sm font-semibold leading-relaxed text-ep-subtle">
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
                <p className="mt-1 text-sm font-semibold italic text-ep-subtle">{breakdown.transliteration}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-wider text-ep-faint">
                  {breakdown.language}
                </p>
              </BreakdownSegment>

              <BreakdownSegment title={seg.definition}>
                <p className="text-[15px] font-medium leading-relaxed text-ep-ink">{breakdown.definition}</p>
              </BreakdownSegment>

              {firstMentions.length > 0 && !firstMentionOpen && (
                <div className="rounded-2xl border border-dashed border-ep-line/90 bg-ep-surface-panel/80 p-4 shadow-inner sm:p-5">
                  <p className="text-sm font-medium leading-relaxed text-ep-muted">
                    {copy.firstMentionTeaser}
                  </p>
                  <button
                    type="button"
                    onClick={() => setFirstMentionOpen(true)}
                    className="mt-4 inline-flex items-center justify-center rounded-full border border-ep-accent/40 bg-ep-accent-soft px-5 py-2.5 text-sm font-bold text-ep-ink transition hover:border-ep-accent hover:bg-ep-accent/20"
                  >
                    {copy.seeFirstMention}
                  </button>
                </div>
              )}

              {firstMentions.length > 0 && firstMentionOpen && (
                <BreakdownSegment title={seg.firstMention}>
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-ep-subtle">
                      {firstMentions.length > 1
                        ? 'First canonical appearances by original language'
                        : 'First canonical appearance'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setFirstMentionOpen(false)}
                      className="rounded-full px-3 py-1 text-xs font-bold text-ep-muted transition hover:bg-ep-surface-muted hover:text-ep-ink"
                    >
                      {copy.firstMentionHide}
                    </button>
                  </div>

                  <div className="flex flex-col gap-5">
                    {firstMentions.map((mention, index) => {
                      const active = isActiveCrossRef(crossRefPreview, mention.reference);
                      return (
                        <div
                          key={`${mention.reference}-${mention.language}-${index}`}
                          className={index > 0 ? 'border-t border-ep-line/70 pt-5' : ''}
                        >
                          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-ep-faint">
                            {mention.language}
                          </p>
                          {mention.relatedForm && (
                            <p className="mt-1 text-sm font-bold text-ep-ink">{mention.relatedForm}</p>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              onCrossRefClick(mention.reference, {
                                isFirstMention: true,
                                relatedForm: mention.relatedForm,
                              })
                            }
                            className={[
                              'mt-2 rounded-full border px-4 py-2 text-left text-xs font-bold shadow-inner transition',
                              active
                                ? 'border-ep-accent bg-ep-accent-soft text-ep-ink ring-2 ring-ep-accent/20'
                                : 'border-ep-line bg-ep-surface-panel text-ep-ink hover:border-ep-accent hover:bg-ep-accent-soft',
                            ].join(' ')}
                          >
                            {mention.reference}
                          </button>
                          {mention.note && (
                            <p className="mt-3 text-[15px] font-medium leading-relaxed text-ep-ink">
                              {mention.note}
                            </p>
                          )}
                          <RefPreview
                            preview={crossRefPreview}
                            activeReference={mention.reference}
                            copy={copy}
                            seg={seg}
                            isFirstMention={active && crossRefPreview?.isFirstMention}
                          />
                        </div>
                      );
                    })}
                  </div>
                </BreakdownSegment>
              )}

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
                  className="max-w-none text-[15px] font-medium leading-relaxed text-ep-ink [&_em]:italic [&_em]:text-ep-subtle [&_p+p]:mt-3 [&_strong]:font-bold [&_strong]:text-ep-ink"
                  dangerouslySetInnerHTML={{ __html: breakdown.caseStudy || '' }}
                />
              </BreakdownSegment>

              <BreakdownSegment title={seg.crossRefs}>
                <div className="flex flex-wrap gap-2">
                  {(breakdown.crossReferences || []).map((ref) => {
                    const label = crossRefLabel(ref);
                    if (!label) return null;
                    const active = isActiveCrossRef(crossRefPreview, label);
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => onCrossRefClick(label)}
                        className={[
                          'rounded-full border px-4 py-2 text-left text-xs font-bold shadow-inner transition',
                          active
                            ? 'border-ep-accent bg-ep-accent-soft text-ep-ink ring-2 ring-ep-accent/20'
                            : 'border-ep-line bg-ep-surface-panel text-ep-ink hover:border-ep-accent hover:bg-ep-accent-soft',
                        ].join(' ')}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>

                {crossRefPreview?.clickedReference &&
                  (breakdown.crossReferences || []).some(
                    (ref) => crossRefLabel(ref) === crossRefPreview.clickedReference,
                  ) && (
                    <RefPreview
                      preview={crossRefPreview}
                      activeReference={crossRefPreview.clickedReference}
                      copy={copy}
                      seg={seg}
                      isFirstMention={false}
                      className="mt-4 border-t border-ep-line/70 pt-4"
                    />
                  )}
              </BreakdownSegment>

              <BreakdownSegment title={seg.commentary} className="mb-0">
                <p className="text-[15px] font-medium leading-relaxed text-ep-ink">{breakdown.commentary}</p>
                {breakdown.commentaryAttribution && (
                  <p className="mt-3 text-xs font-semibold italic text-ep-subtle">
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
      className={`rounded-2xl border border-ep-line/80 bg-ep-surface-panel p-4 shadow-card sm:p-5 ${className}`}
    >
      <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-ep-faint">{title}</p>
      {children}
    </div>
  );
}

function RefPreview({
  preview,
  activeReference,
  copy,
  seg,
  isFirstMention = false,
  className = 'mt-4',
}) {
  if (!preview?.clickedReference || preview.clickedReference !== activeReference) {
    return null;
  }

  const noMatchMessage = isFirstMention
    ? copy.firstMentionNoMatch
    : copy.crossRefNoMatch;

  return (
    <div className={className}>
      <p className="mb-2 text-xs font-bold text-ep-subtle">{preview.reference}</p>
      {preview.loading ? (
        <p className="text-sm font-semibold text-ep-faint">{copy.crossRefLoading}</p>
      ) : preview.error ? (
        <p className="text-sm font-semibold text-ep-danger-text" role="alert">
          {preview.error}
        </p>
      ) : (
        <>
          <ScriptureViewer
            verseText={preview.text}
            highlightPhraseText={preview.highlightPhrase}
            interactive={false}
            ariaLabel={`${seg.crossRefs}: ${preview.reference}`}
          />
          {!preview.highlightPhrase && (
            <p className="mt-2 text-xs font-semibold text-ep-faint">{noMatchMessage}</p>
          )}
        </>
      )}
    </div>
  );
}
