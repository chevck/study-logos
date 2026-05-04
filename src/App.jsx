import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ScriptureViewer from "./components/ScriptureViewer.jsx";
import WordBreakdownPanel from "./components/WordBreakdownPanel.jsx";
import NotebookDrawer from "./components/NotebookDrawer.jsx";
import StudyLanguagePills from "./components/StudyLanguagePills.jsx";
import TranslationPills from "./components/TranslationPills.jsx";
import Toast from "./components/Toast.jsx";
import {
  fetchBreakdown,
  fetchNotebook,
  fetchVerse,
  saveNotebook,
} from "./lib/api.js";
import {
  NOTEBOOK_ID_KEY,
  NOTEBOOK_STORAGE_KEY,
  appCopy,
  studyLanguageToBibleApiLanguage,
  TRANSLATIONS_BY_STUDY_LANGUAGE,
} from "./lib/types.js";

function notebookEntryId(reference, word, original) {
  return `${reference}|${word}|${original}`;
}

function loadLegacyNotebook() {
  try {
    const raw = localStorage.getItem(NOTEBOOK_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getOrCreateNotebookId() {
  try {
    let id = localStorage.getItem(NOTEBOOK_ID_KEY);
    const uuidRe =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!id || !uuidRe.test(id)) {
      id = crypto.randomUUID();
      localStorage.setItem(NOTEBOOK_ID_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

function Logo({ brandWord1, brandWord2 }) {
  return (
    <div className='flex items-baseline gap-1 font-extrabold tracking-tight text-ep-ink'>
      <span className='text-xl lowercase sm:text-2xl'>{brandWord1}</span>
      <span className='relative text-xl lowercase sm:text-2xl'>
        <span
          className='absolute -top-3 left-[0.2rem] flex gap-px text-[5px] leading-none text-ep-blue sm:left-1 sm:text-[6px]'
          aria-hidden
        >
          <span>●</span>
          <span>●</span>
          <span>●</span>
        </span>
        {brandWord2}
      </span>
    </div>
  );
}

function IconSearch(props) {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      aria-hidden
      {...props}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
      />
    </svg>
  );
}

export default function App() {
  const mainRef = useRef(null);
  const searchRef = useRef(null);

  const [referenceInput, setReferenceInput] = useState("Romans 5:13");
  const [displayReference, setDisplayReference] = useState("");
  const [verseText, setVerseText] = useState("");
  const [studyLanguage, setStudyLanguage] = useState("eng");
  const [translation, setTranslation] = useState("NKJV");

  const [activeWord, setActiveWord] = useState(null);
  const [breakdown, setBreakdown] = useState(null);

  const translationCodes = useMemo(
    () =>
      TRANSLATIONS_BY_STUDY_LANGUAGE[studyLanguage] ??
      TRANSLATIONS_BY_STUDY_LANGUAGE.eng,
    [studyLanguage],
  );

  const t = useMemo(() => appCopy(studyLanguage), [studyLanguage]);

  const [verseLoading, setVerseLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [notebook, setNotebook] = useState([]);
  const [notebookReady, setNotebookReady] = useState(false);
  const [toast, setToast] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [error, setError] = useState("");

  const [navStack, setNavStack] = useState([]);

  useEffect(() => {
    document.documentElement.lang = studyLanguage === "yor" ? "yo" : "en";
    document.title = t.docTitle;
  }, [studyLanguage, t.docTitle]);

  useEffect(() => {
    if (studyLanguage === "yor") {
      setStudyLanguage("eng");
      setTranslation((prev) =>
        TRANSLATIONS_BY_STUDY_LANGUAGE.eng.includes(prev) ? prev : "NKJV",
      );
    }
  }, [studyLanguage]);

  const studyLanguageRef = useRef(studyLanguage);
  studyLanguageRef.current = studyLanguage;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const id = getOrCreateNotebookId();
        const data = await fetchNotebook(id);
        let entries = Array.isArray(data.entries) ? data.entries : [];
        if (entries.length === 0) {
          const legacy = loadLegacyNotebook();
          if (legacy.length > 0) {
            entries = legacy;
            localStorage.removeItem(NOTEBOOK_STORAGE_KEY);
          }
        }
        if (!cancelled) {
          setNotebook(entries);
          setNotebookReady(true);
        }
      } catch {
        if (!cancelled) {
          const legacy = loadLegacyNotebook();
          setNotebook(legacy);
          setNotebookReady(true);
          const msg = appCopy(studyLanguageRef.current);
          setToast(
            legacy.length > 0
              ? msg.toastNotebookOffline
              : msg.toastNotebookFail,
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!notebookReady) return;
    const id = getOrCreateNotebookId();
    const msg = appCopy(studyLanguage);
    const handle = setTimeout(() => {
      saveNotebook(id, notebook).catch(() => {
        setToast(msg.toastSaveFail);
      });
    }, 400);
    return () => clearTimeout(handle);
  }, [notebook, notebookReady, studyLanguage]);

  const breadcrumbs = useMemo(() => {
    if (navStack.length === 0) return [];
    return [...navStack.map((n) => n.reference), displayReference];
  }, [navStack, displayReference]);

  const currentSaved = useMemo(() => {
    if (!breakdown?.original) return false;
    const id = notebookEntryId(
      displayReference,
      breakdown.word,
      breakdown.original,
    );
    return notebook.some((n) => n.id === id);
  }, [notebook, breakdown, displayReference]);

  const loadBreakdown = useCallback(
    async (word, ref, text, trans, studyLangOverride) => {
      const studyLang = studyLangOverride ?? studyLanguage;
      setLoading(true);
      setBreakdown(null);
      setError("");
      try {
        const data = await fetchBreakdown({
          word,
          reference: ref,
          verseText: text,
          translation: trans,
          studyLanguage: studyLang,
        });
        setBreakdown(data);
      } catch (e) {
        setBreakdown(null);
        setError(e.message || appCopy(studyLanguage).errLoadBreakdown);
      } finally {
        setLoading(false);
      }
    },
    [studyLanguage],
  );

  const loadVerse = useCallback(
    async (ref, trans, opts = {}) => {
      setVerseLoading(true);
      setError("");
      try {
        const apiLang =
          opts.bibleApiLanguage ??
          studyLanguageToBibleApiLanguage(studyLanguage);
        const data = await fetchVerse(ref, trans, apiLang);
        setDisplayReference(data.reference || ref);
        setVerseText(data.text || "");
        return data;
      } catch (e) {
        if (!opts.softFail) {
          setVerseText("");
          setDisplayReference("");
        }
        setError(e.message || appCopy(studyLanguage).errLoadVerse);
        throw e;
      } finally {
        setVerseLoading(false);
      }
    },
    [studyLanguage],
  );

  const handleSearch = async (e) => {
    e.preventDefault();
    const ref = referenceInput.trim();
    if (!ref) return;
    setNavStack([]);
    setActiveWord(null);
    setBreakdown(null);
    try {
      await loadVerse(ref, translation);
    } catch {
      /* handled */
    }
  };

  const handleWordClick = async (word) => {
    if (!verseText || !displayReference) return;
    setActiveWord(word);
    await loadBreakdown(word, displayReference, verseText, translation);
  };

  const handleStudyLanguageChange = async (code) => {
    const opts =
      TRANSLATIONS_BY_STUDY_LANGUAGE[code] ??
      TRANSLATIONS_BY_STUDY_LANGUAGE.eng;
    const nextTrans = opts.includes(translation) ? translation : opts[0];
    setStudyLanguage(code);
    setTranslation(nextTrans);
    setBreakdown(null);
    if (!displayReference) return;
    try {
      const data = await loadVerse(displayReference, nextTrans, {
        bibleApiLanguage: studyLanguageToBibleApiLanguage(code),
        softFail: true,
      });
      if (activeWord && data.text) {
        await loadBreakdown(
          activeWord,
          data.reference || displayReference,
          data.text,
          nextTrans,
          code,
        );
      }
    } catch {
      /* loadVerse / loadBreakdown set error state */
    }
  };

  const handleCrossRefClick = async (refString) => {
    const ref = refString.trim();
    if (!ref || !activeWord || !displayReference) return;

    const wordAtNav = activeWord;
    const fromRef = displayReference;

    setNavStack((s) => [
      ...s,
      { reference: displayReference, word: activeWord },
    ]);
    setReferenceInput(ref);

    try {
      const data = await loadVerse(ref, translation);
      const text = data.text;
      await loadBreakdown(activeWord, data.reference || ref, text, translation);
    } catch {
      setNavStack((s) => s.slice(0, -1));
      setReferenceInput(fromRef);
      try {
        const data = await loadVerse(fromRef, translation);
        await loadBreakdown(
          wordAtNav,
          data.reference || fromRef,
          data.text,
          translation,
        );
      } catch {
        /* handled */
      }
    }
  };

  const handleBack = async () => {
    if (navStack.length === 0) return;
    const prev = navStack[navStack.length - 1];
    setNavStack((s) => s.slice(0, -1));
    setReferenceInput(prev.reference);
    setActiveWord(prev.word);

    try {
      const data = await loadVerse(prev.reference, translation);
      await loadBreakdown(
        prev.word,
        data.reference || prev.reference,
        data.text,
        translation,
      );
    } catch {
      /* handled */
    }
  };

  const handleSave = () => {
    if (!breakdown?.original) return;
    const id = notebookEntryId(
      displayReference,
      breakdown.word,
      breakdown.original,
    );
    const exists = notebook.some((n) => n.id === id);
    if (exists) {
      setNotebook((n) => n.filter((x) => x.id !== id));
      setToast(t.toastRemoved);
      return;
    }
    setNotebook((n) => [
      ...n,
      {
        id,
        word: breakdown.word,
        reference: displayReference,
        original: breakdown.original,
        transliteration: breakdown.transliteration,
        definition: breakdown.definition,
      },
    ]);
    setToast(t.toastSaved);
  };

  const handleTranslationChange = async (code) => {
    setTranslation(code);
    if (!displayReference) return;
    try {
      const data = await loadVerse(displayReference, code, { softFail: true });
      if (activeWord && data.text) {
        await loadBreakdown(
          activeWord,
          data.reference || displayReference,
          data.text,
          code,
        );
      }
    } catch {
      /* loaders set error */
    }
  };

  const scrollMainTop = () => {
    mainRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSearch = () => {
    searchRef.current?.focus();
    document
      .getElementById("search-panel")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const surfaceCard = "rounded-2xl border border-ep-line bg-white shadow-card";

  return (
    <div className='relative min-h-screen overflow-x-hidden font-sans'>
      <header className='sticky top-0 z-40 bg-white border-b border-ep-line'>
        <div className='max-w-5xl px-3 py-3 mx-auto sm:px-6 sm:py-4'>
          <div className='flex items-center justify-between gap-3 md:gap-6'>
            <button
              type='button'
              onClick={scrollMainTop}
              className='min-w-0 text-left shrink'
            >
              <Logo brandWord1={t.brandWord1} brandWord2={t.brandWord2} />
            </button>
            <nav className='items-center justify-center flex-1 hidden gap-6 text-sm font-semibold text-gray-600 md:flex lg:justify-start lg:gap-8'>
              <button
                type='button'
                onClick={scrollMainTop}
                className='transition hover:text-ep-blue'
              >
                {t.navStudy}
              </button>
              <button
                type='button'
                onClick={scrollToSearch}
                className='transition hover:text-ep-blue'
              >
                {t.navSearch}
              </button>
              <button
                type='button'
                onClick={() => setDrawerOpen(true)}
                className='transition hover:text-ep-blue'
              >
                {t.navNotebook}
              </button>
            </nav>
            <button
              type='button'
              onClick={() => setDrawerOpen(true)}
              className='relative shrink-0 rounded-xl bg-ep-blue px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-ep-blue-hover sm:px-5 sm:py-2.5'
            >
              {t.ctaGetStarted}
              {notebook.length > 0 && (
                <span className='absolute -right-1.5 -top-1.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-white px-1 text-[10px] font-extrabold text-ep-blue ring-1 ring-ep-line'>
                  {notebook.length > 9 ? "9+" : notebook.length}
                </span>
              )}
            </button>
          </div>
          <nav
            className='flex items-center justify-around gap-2 pt-3 mt-3 text-xs font-semibold text-gray-600 border-t border-ep-line sm:text-sm md:hidden'
            aria-label='Main'
          >
            <button
              type='button'
              onClick={scrollMainTop}
              className='transition hover:text-ep-blue'
            >
              {t.navStudy}
            </button>
            <button
              type='button'
              onClick={scrollToSearch}
              className='transition hover:text-ep-blue'
            >
              {t.navSearch}
            </button>
            <button
              type='button'
              onClick={() => setDrawerOpen(true)}
              className='transition hover:text-ep-blue'
            >
              {t.navNotebook}
            </button>
          </nav>
        </div>
      </header>

      <main
        id='study-main'
        ref={mainRef}
        className='w-full max-w-5xl px-3 pt-6 pb-16 mx-auto sm:px-6 sm:pt-8'
      >
        <div className='mb-6 sm:mb-8'>
          <h2 className='text-xl font-extrabold tracking-tight text-balance text-ep-ink sm:text-2xl md:text-3xl'>
            {displayReference ? (
              <>
                {t.heroWordInsight}{" "}
                <span className='text-gray-600'>{displayReference}</span>
              </>
            ) : (
              <>{t.heroFindPassage}</>
            )}
          </h2>
          <p className='max-w-2xl mt-2 text-sm font-medium leading-snug text-pretty text-ep-muted sm:text-base sm:leading-normal'>
            {t.heroBlurb}
          </p>
        </div>

        <div
          id='search-panel'
          className={`mb-6 p-4 sm:mb-8 sm:p-5 md:p-6 ${surfaceCard}`}
        >
          <div className='flex flex-col gap-4 pb-5 mb-5 border-b border-ep-line sm:flex-row sm:items-center sm:justify-between'>
            <span className='text-xs font-bold tracking-wide text-gray-500 uppercase'>
              {t.labelStudyLanguage}
            </span>
            <StudyLanguagePills
              value={studyLanguage}
              onChange={handleStudyLanguageChange}
              studyUiLang={studyLanguage}
            />
          </div>

          <div className='flex flex-col gap-4 pb-5 mb-5 border-b border-ep-line sm:flex-row sm:items-center sm:justify-between'>
            <span className='text-xs font-bold tracking-wide text-gray-500 uppercase'>
              {t.labelBibleEdition}
            </span>
            <TranslationPills
              value={translation}
              onChange={handleTranslationChange}
              codes={translationCodes}
            />
          </div>

          <form
            onSubmit={handleSearch}
            className='flex flex-col gap-3 sm:flex-row sm:items-stretch'
          >
            <label className='sr-only' htmlFor='ref-input'>
              {t.srRefLabel}
            </label>
            <input
              ref={searchRef}
              id='ref-input'
              value={referenceInput}
              onChange={(e) => setReferenceInput(e.target.value)}
              placeholder={t.placeholderRef}
              className='min-h-[52px] w-full flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-[15px] font-semibold text-ep-ink shadow-sm outline-none placeholder:font-medium placeholder:text-gray-400 focus:border-ep-blue focus:ring-4 focus:ring-blue-100'
            />
            <button
              type='submit'
              disabled={verseLoading}
              className='flex min-h-[52px] w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-ep-blue px-6 font-bold text-white shadow-sm transition hover:bg-ep-blue-hover disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-8 md:px-10'
            >
              <IconSearch className='w-5 h-5' />
              {verseLoading ? t.searching : t.search}
            </button>
          </form>
        </div>

        {error && (
          <div
            className='px-4 py-3 mb-6 text-sm font-semibold text-red-900 border border-red-200 shadow-sm rounded-2xl bg-red-50 sm:mb-8 sm:px-5 sm:py-4'
            role='alert'
          >
            {error}
          </div>
        )}

        <div className='flex flex-wrap items-start justify-between gap-3 pb-2 mb-4 border-b border-transparent sm:mb-6'>
          <h3 className='text-base font-extrabold leading-snug text-ep-ink sm:text-lg'>
            {displayReference ? (
              <>
                {t.passageHeading}{" "}
                <span className='text-gray-700'>
                  <span className='break-words'>{displayReference}</span>{" "}
                  <span className='whitespace-nowrap'>
                    → <span className='text-ep-blue'>{translation}</span>
                  </span>
                </span>
              </>
            ) : (
              t.scriptureHeading
            )}
          </h3>
        </div>

        <div className='w-full'>
          <div className={`mb-8 w-full p-4 sm:p-5 md:p-6 ${surfaceCard}`}>
            <div className='pb-4 mb-5 border-b border-ep-line'>
              <p className='text-xs font-bold tracking-wide text-gray-500 uppercase'>
                {t.readingLabel}
              </p>
              {displayReference ? (
                <p className='mt-1 text-sm font-bold break-words text-ep-ink'>
                  {displayReference}{" "}
                  <span className='font-semibold text-gray-600'>
                    · {translation}
                  </span>
                </p>
              ) : (
                <p className='mt-1 text-sm text-gray-500'>{t.loadVerseHint}</p>
              )}
            </div>
            {verseLoading && (
              <p className='text-sm font-semibold text-gray-600'>
                {t.loadingPassage}
              </p>
            )}
            {!verseLoading && verseText && (
              <ScriptureViewer
                verseText={verseText}
                activeWord={activeWord}
                onWordClick={handleWordClick}
                ariaLabel={t.ariaScriptureRegion}
              />
            )}
            {!verseLoading && !verseText && (
              <p className='text-sm italic font-medium text-gray-500'>
                {t.versePlaceholder}
              </p>
            )}
          </div>

          <div className='w-full'>
            <WordBreakdownPanel
              breakdown={breakdown}
              loading={loading}
              onSave={handleSave}
              savedWords={currentSaved}
              onCrossRefClick={handleCrossRefClick}
              breadcrumbs={breadcrumbs}
              onBack={navStack.length ? handleBack : undefined}
              studyLanguage={studyLanguage}
            />
          </div>
        </div>
      </main>

      <NotebookDrawer
        open={drawerOpen}
        entries={notebook}
        studyLanguage={studyLanguage}
        onClose={() => setDrawerOpen(false)}
        onRemove={(id) => {
          setNotebook((n) => n.filter((x) => x.id !== id));
          setToast(t.toastRemoved);
        }}
      />

      <Toast message={toast} onDismiss={() => setToast("")} />
    </div>
  );
}
