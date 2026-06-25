import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ScriptureViewer from "./components/ScriptureViewer.jsx";
import WordBreakdownPanel from "./components/WordBreakdownPanel.jsx";
import NotebookDrawer from "./components/NotebookDrawer.jsx";
import StudyLanguagePills from "./components/StudyLanguagePills.jsx";
import TranslationPills from "./components/TranslationPills.jsx";
import Toast from "./components/Toast.jsx";
import AddToHomeScreenPrompt from "./components/AddToHomeScreenPrompt.jsx";
import ExperienceReviewModal from "./components/ExperienceReviewModal.jsx";
import ReferencePicker from "./components/ReferencePicker.jsx";
import Logo from "./components/Logo.jsx";
import UserAvatarMenu from "./components/UserAvatarMenu.jsx";
import {
  clearAuth,
  fetchBreakdownSection,
  fetchNotebook,
  fetchPhrases,
  fetchSessionUser,
  fetchVerse,
  getAuthToken,
  getAuthUser,
  GuestLimitError,
  ExperienceReviewRequiredError,
  saveNotebook,
} from "./lib/api.js";
import { BREAKDOWN_SECTIONS } from "./lib/breakdownSections.js";
import { applyTheme, normalizeTheme } from "./lib/theme.js";
import { getThemePreference } from "./lib/authStorage.js";
import {
  NOTEBOOK_ID_KEY,
  NOTEBOOK_STORAGE_KEY,
  appCopy,
  studyLanguageToBibleApiLanguage,
  TRANSLATIONS_BY_STUDY_LANGUAGE,
} from "./lib/types.js";
import {
  applyReferenceToPickerState,
  formatReference,
  getBookBySlug,
  getVerseCount,
  parseReferenceString,
} from "./lib/bibleBooks.js";
import { findPhraseInVerse } from "./lib/matchTransliteration.js";
import { normalizeVerseText } from "./lib/normalizeVerse.js";
import { firstNameFromFullName } from "./lib/userDisplay.js";
import {
  canSuggestHomeScreen,
  consumePendingHomeScreenPrompt,
  isHomeScreenPromptDismissed,
} from "./lib/homeScreen.js";

function notebookEntryId(reference, phrase, original) {
  return `${reference}|${phrase}|${original}`;
}

function breakdownSurfacePhrase(breakdown) {
  return breakdown?.phrase ?? breakdown?.word ?? "";
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

/** One shared GET per page load (avoids duplicate calls from React Strict Mode remount). */
let notebookInitialLoadPromise = null;
let notebookLoadAuthKey = null;

function loadNotebookOnce() {
  const authKey = getAuthToken() ? "auth" : "guest";
  if (authKey !== notebookLoadAuthKey) {
    notebookInitialLoadPromise = null;
    notebookLoadAuthKey = authKey;
  }

  if (!getAuthToken()) {
    return Promise.resolve({ entries: [], networkError: false });
  }

  if (!notebookInitialLoadPromise) {
    notebookInitialLoadPromise = (async () => {
      const id = getOrCreateNotebookId();
      try {
        const data = await fetchNotebook(id);
        let entries = Array.isArray(data.entries) ? data.entries : [];
        if (entries.length === 0) {
          const legacy = loadLegacyNotebook();
          if (legacy.length > 0) {
            entries = legacy;
            localStorage.removeItem(NOTEBOOK_STORAGE_KEY);
          }
        }
        return { entries, networkError: false };
      } catch {
        const legacy = loadLegacyNotebook();
        return { entries: legacy, networkError: true };
      }
    })();
  }
  return notebookInitialLoadPromise;
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

export default function StudyApp() {
  const mainRef = useRef(null);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [authUser, setAuthUser] = useState(() => getAuthUser());

  const [pickerBookSlug, setPickerBookSlug] = useState("romans");
  const [pickerChapter, setPickerChapter] = useState(5);
  const [pickerVerse, setPickerVerse] = useState(13);
  const [displayReference, setDisplayReference] = useState("");
  const [verseText, setVerseText] = useState("");
  const [studyLanguage, setStudyLanguage] = useState("eng");
  const [translation, setTranslation] = useState("NKJV");

  const [activePhraseId, setActivePhraseId] = useState(null);
  const [phrases, setPhrases] = useState([]);
  const [phrasesLoading, setPhrasesLoading] = useState(false);
  const [phrasesError, setPhrasesError] = useState("");
  const [breakdown, setBreakdown] = useState(null);
  const [revealedSectionCount, setRevealedSectionCount] = useState(0);

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

  const [crossRefPreview, setCrossRefPreview] = useState(null);
  const crossRefReqRef = useRef(0);
  const breakdownReqRef = useRef(0);
  const [showAddToHomeScreen, setShowAddToHomeScreen] = useState(false);
  const [experienceReviewRequired, setExperienceReviewRequired] = useState(false);

  useEffect(() => {
    document.documentElement.lang = studyLanguage === "yor" ? "yo" : "en";
    document.title = t.docTitle;
  }, [studyLanguage, t.docTitle]);

  useEffect(() => {
    if (!sessionChecked || !isLoggedIn) return;
    if (experienceReviewRequired) return;
    if (!consumePendingHomeScreenPrompt()) return;
    if (!canSuggestHomeScreen() || isHomeScreenPromptDismissed()) return;
    setShowAddToHomeScreen(true);
  }, [sessionChecked, isLoggedIn, experienceReviewRequired]);

  useEffect(() => {
    let cancelled = false;

    function applyNotebook({ entries, networkError }) {
      if (cancelled) return;
      setNotebook(entries);
      setNotebookReady(true);
      if (networkError) {
        const msg = appCopy(studyLanguageRef.current);
        setToast(
          entries.length > 0
            ? msg.toastNotebookOffline
            : msg.toastNotebookFail,
        );
      }
    }

    if (!getAuthToken()) {
      setIsLoggedIn(false);
      setAuthUser(null);
      setSessionChecked(true);
      loadNotebookOnce().then(applyNotebook);
      return () => {
        cancelled = true;
      };
    }

    fetchSessionUser()
      .then((data) => {
        if (cancelled) return;
        setIsLoggedIn(true);
        setAuthUser(data.user ?? getAuthUser());
        setExperienceReviewRequired(Boolean(data.experienceReviewRequired));
        applyTheme(normalizeTheme(data.user?.theme));
        return loadNotebookOnce();
      })
      .then((result) => {
        if (cancelled || !result) return;
        applyNotebook(result);
      })
      .catch(() => {
        if (cancelled) return;
        setIsLoggedIn(false);
        setAuthUser(null);
        return loadNotebookOnce().then(applyNotebook);
      })
      .finally(() => {
        if (!cancelled) setSessionChecked(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSignOut = useCallback(() => {
    clearAuth();
    setIsLoggedIn(false);
    setAuthUser(null);
    setNotebook([]);
    setNotebookReady(true);
    applyTheme(normalizeTheme(getThemePreference()));
    navigate("/login", {
      state: { message: "You have been signed out.", returnTo: "/study" },
    });
  }, [navigate]);

  const handleGuestLimit = useCallback(
    (e) => {
      const msg =
        e instanceof GuestLimitError
          ? e.message
          : appCopy(studyLanguageRef.current).errGuestLimit;
      setError(msg);
      setToast(msg);
      navigate("/login", {
        state: {
          message: msg,
          returnTo: "/study",
        },
      });
    },
    [navigate],
  );

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
    if (!notebookReady || !isLoggedIn || !sessionChecked) return;
    const id = getOrCreateNotebookId();
    const msg = appCopy(studyLanguage);
    const handle = setTimeout(() => {
      saveNotebook(id, notebook).catch(() => {
        setToast(msg.toastSaveFail);
      });
    }, 400);
    return () => clearTimeout(handle);
  }, [notebook, notebookReady, studyLanguage, isLoggedIn, sessionChecked]);

  const currentSaved = useMemo(() => {
    if (!breakdown?.original) return false;
    const id = notebookEntryId(
      displayReference,
      breakdownSurfacePhrase(breakdown),
      breakdown.original,
    );
    return notebook.some((n) => n.id === id);
  }, [notebook, breakdown, displayReference]);

  const loadPhrasesForVerse = useCallback(
    async (ref, text, trans, studyLangOverride) => {
      const studyLang = studyLangOverride ?? studyLanguage;
      setPhrasesLoading(true);
      setPhrasesError("");
      setPhrases([]);
      setActivePhraseId(null);
      try {
        const data = await fetchPhrases({
          reference: ref,
          verseText: text,
          translation: trans,
          studyLanguage: studyLang,
        });
        setPhrases(Array.isArray(data.phrases) ? data.phrases : []);
      } catch (e) {
        setPhrases([]);
        if (e instanceof GuestLimitError) {
          handleGuestLimit(e);
          return;
        }
        setPhrasesError(e.message || appCopy(studyLanguage).phrasesError);
      } finally {
        setPhrasesLoading(false);
      }
    },
    [studyLanguage, handleGuestLimit],
  );

  const loadBreakdown = useCallback(
    async (phraseObj, ref, text, trans, studyLangOverride) => {
      const studyLang = studyLangOverride ?? studyLanguage;
      const reqId = ++breakdownReqRef.current;

      setLoading(true);
      setBreakdown({ phrase: phraseObj.text, reference: ref });
      setRevealedSectionCount(0);
      setError("");

      const merged = { phrase: phraseObj.text, reference: ref };
      const pending = {};
      let revealed = 0;

      const revealQueuedSections = () => {
        while (revealed < BREAKDOWN_SECTIONS.length) {
          const section = BREAKDOWN_SECTIONS[revealed];
          if (!pending[section]) break;
          Object.assign(merged, pending[section]);
          revealed += 1;
          if (reqId !== breakdownReqRef.current) return;
          setBreakdown({ ...merged });
          setRevealedSectionCount(revealed);
        }
      };

      const handleBreakdownError = (e) => {
        if (reqId !== breakdownReqRef.current) return;
        setBreakdown(null);
        setRevealedSectionCount(0);
        if (e instanceof GuestLimitError) {
          handleGuestLimit(e);
          return;
        }
        if (e instanceof ExperienceReviewRequiredError) {
          setExperienceReviewRequired(true);
          return;
        }
        setError(e.message || appCopy(studyLanguage).errLoadBreakdown);
      };

      const baseParams = {
        phrase: phraseObj.text,
        reference: ref,
        verseText: text,
        translation: trans,
        studyLanguage: studyLang,
        phraseTransliteration: phraseObj.transliteration,
        phraseOriginal: phraseObj.original,
        readerFirstName: firstNameFromFullName(authUser?.fullName),
      };

      try {
        const { breakdown: coreData, studyMeta } = await fetchBreakdownSection({
          ...baseParams,
          section: "core",
        });
        if (reqId !== breakdownReqRef.current) return;
        if (studyMeta?.experienceReviewRequired) {
          setExperienceReviewRequired(true);
        }
        pending.core = coreData;
        revealQueuedSections();

        const tailSections = BREAKDOWN_SECTIONS.slice(1);
        await Promise.all(
          tailSections.map(async (section) => {
            try {
              const { breakdown: sectionData, studyMeta: sectionMeta } =
                await fetchBreakdownSection({
                  ...baseParams,
                  section,
                  coreContext: pending.core,
                });
              if (reqId !== breakdownReqRef.current) return;
              if (sectionMeta?.experienceReviewRequired) {
                setExperienceReviewRequired(true);
              }
              pending[section] = sectionData;
              revealQueuedSections();
            } catch (e) {
              if (reqId !== breakdownReqRef.current) return;
              if (e instanceof GuestLimitError || e instanceof ExperienceReviewRequiredError) {
                handleBreakdownError(e);
                return;
              }
              pending[section] = {};
              revealQueuedSections();
              setError((prev) => prev || e.message || appCopy(studyLanguage).errLoadBreakdown);
            }
          }),
        );
      } catch (e) {
        handleBreakdownError(e);
      } finally {
        if (reqId === breakdownReqRef.current) {
          setLoading(false);
        }
      }
    },
    [studyLanguage, handleGuestLimit, authUser],
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
        setVerseText(normalizeVerseText(data.text || ""));
        return data;
      } catch (e) {
        if (e instanceof GuestLimitError) {
          handleGuestLimit(e);
          throw e;
        }
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
    [studyLanguage, handleGuestLimit],
  );

  const loadVerseAndPhrases = useCallback(
    async (ref, trans, opts = {}) => {
      const data = await loadVerse(ref, trans, opts);
      if (data?.text) {
        await loadPhrasesForVerse(
          data.reference || ref,
          data.text,
          trans,
          opts.studyLanguageOverride,
        );
      }
      return data;
    },
    [loadVerse, loadPhrasesForVerse],
  );

  const syncPickerFromRefString = useCallback((refString) => {
    const parsed = parseReferenceString(refString);
    if (!parsed) return;
    const a = applyReferenceToPickerState(parsed);
    setPickerBookSlug(a.slug);
    setPickerChapter(a.chapter);
    setPickerVerse(a.verse);
  }, []);

  const handlePickerBookChange = useCallback((slug) => {
    setPickerBookSlug(slug);
    const b = getBookBySlug(slug);
    setPickerChapter((c) => Math.min(Math.max(1, c), b.chapters));
  }, []);

  useEffect(() => {
    setPickerVerse((v) => {
      const max = getVerseCount(pickerBookSlug, pickerChapter);
      return v > max ? max : Math.max(1, v);
    });
  }, [pickerBookSlug, pickerChapter]);

  const pickerLabels = useMemo(
    () => ({
      srPassageGroup: t.srPassageGroup,
      labelBook: t.labelBook,
      labelChapter: t.labelChapter,
      labelVerse: t.labelVerse,
    }),
    [t],
  );

  const handleSearch = async (e) => {
    e.preventDefault();
    const ref = formatReference(pickerBookSlug, pickerChapter, pickerVerse);
    setActivePhraseId(null);
    setPhrases([]);
    setPhrasesError("");
    setBreakdown(null);
    setRevealedSectionCount(0);
    setCrossRefPreview(null);
    try {
      await loadVerseAndPhrases(ref, translation);
    } catch {
      /* handled */
    }
  };

  const handlePhraseClick = async (phrase) => {
    if (!verseText || !displayReference || !phrase?.text) return;
    setActivePhraseId(phrase.id);
    setCrossRefPreview(null);
    await loadBreakdown(phrase, displayReference, verseText, translation);
  };

  const handleRetryPhrases = async () => {
    if (!verseText || !displayReference) return;
    await loadPhrasesForVerse(displayReference, verseText, translation);
  };

  const handleStudyLanguageChange = async (code) => {
    const opts =
      TRANSLATIONS_BY_STUDY_LANGUAGE[code] ??
      TRANSLATIONS_BY_STUDY_LANGUAGE.eng;
    const nextTrans = opts.includes(translation) ? translation : opts[0];
    setStudyLanguage(code);
    setTranslation(nextTrans);
    setBreakdown(null);
    setRevealedSectionCount(0);
    setCrossRefPreview(null);
    setPhrases([]);
    setPhrasesError("");
    setActivePhraseId(null);
    if (!displayReference) return;
    try {
      await loadVerseAndPhrases(displayReference, nextTrans, {
        bibleApiLanguage: studyLanguageToBibleApiLanguage(code),
        softFail: true,
        studyLanguageOverride: code,
      });
    } catch {
      /* loadVerse sets error state */
    }
  };

  const handleCrossRefClick = async (refString, opts = {}) => {
    const ref = String(refString ?? "").trim();
    const surfacePhrase = breakdownSurfacePhrase(breakdown);
    if (!ref || !surfacePhrase) return;

    const reqId = ++crossRefReqRef.current;
    setCrossRefPreview({
      clickedReference: ref,
      reference: ref,
      text: "",
      highlightPhrase: null,
      loading: true,
    });

    try {
      const apiLang = studyLanguageToBibleApiLanguage(studyLanguage);
      const data = await fetchVerse(ref, translation, apiLang);
      if (reqId !== crossRefReqRef.current) return;

      const resolvedRef = data.reference || ref;
      const text = data.text || "";
      let highlightPhrase = findPhraseInVerse(text, surfacePhrase);
      if (!highlightPhrase && opts.relatedForm) {
        highlightPhrase = findPhraseInVerse(text, opts.relatedForm);
      }

      setCrossRefPreview({
        clickedReference: ref,
        reference: resolvedRef,
        text,
        highlightPhrase,
        loading: false,
        isFirstMention: Boolean(opts.isFirstMention),
      });
    } catch (e) {
      if (reqId !== crossRefReqRef.current) return;
      if (e instanceof GuestLimitError) {
        handleGuestLimit(e);
        setCrossRefPreview(null);
        return;
      }
      setCrossRefPreview({
        clickedReference: ref,
        reference: ref,
        text: "",
        highlightPhrase: null,
        loading: false,
        error: e.message || t.errLoadVerse,
        isFirstMention: Boolean(opts.isFirstMention),
      });
    }
  };

  const handleSave = () => {
    if (!breakdown?.original) return;
    const surfacePhrase = breakdownSurfacePhrase(breakdown);
    if (!isLoggedIn) {
      setToast(t.toastSignInToSave);
      navigate("/login", {
        state: {
          message: t.toastSignInToSave,
          returnTo: "/study",
        },
      });
      return;
    }
    const id = notebookEntryId(
      displayReference,
      surfacePhrase,
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
        word: surfacePhrase,
        phrase: surfacePhrase,
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
    setBreakdown(null);
    setRevealedSectionCount(0);
    setActivePhraseId(null);
    setCrossRefPreview(null);
    if (!displayReference) return;
    try {
      await loadVerseAndPhrases(displayReference, code, { softFail: true });
    } catch {
      /* loadVerse sets error */
    }
  };

  const scrollMainTop = () => {
    mainRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSearch = () => {
    document.getElementById("ref-book")?.focus();
    document
      .getElementById("search-panel")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const pillNavBtn =
    "rounded-full px-4 py-2 text-xs font-semibold text-ep-muted transition hover:bg-ep-surface-panel hover:text-ep-ink sm:text-sm";

  const surfaceCard = "ep-surface-card";

  return (
    <div className='relative min-h-screen overflow-x-hidden font-sans'>
      <header className='ep-header-bar sticky top-0 z-40'>
        <div className='mx-auto flex max-w-5xl flex-col gap-3 px-3 py-3 sm:px-6 sm:py-4'>
          <div className='flex items-center gap-3 md:gap-4'>
            <Link to="/" className='min-w-0 shrink text-left'>
              <Logo
                brandWord1={t.brandWord1}
                brandWord2={t.brandWord2}
                betaLabel={t.betaBadge}
                betaTitle={t.betaNotice}
              />
            </Link>

            <nav
              aria-label='Main navigation'
              className='mx-auto hidden max-w-xl flex-1 justify-center px-2 md:flex'
            >
              <div className='inline-flex items-center gap-0.5 rounded-full border border-ep-line/85 bg-ep-surface-panel/95 p-1 shadow-inner'>
                <button
                  type='button'
                  onClick={scrollMainTop}
                  className={pillNavBtn}
                >
                  {t.navStudy}
                </button>
                <button
                  type='button'
                  onClick={scrollToSearch}
                  className={pillNavBtn}
                >
                  {t.navSearch}
                </button>
                <button
                  type='button'
                  onClick={() => setDrawerOpen(true)}
                  className={pillNavBtn}
                >
                  {t.navNotebook}
                </button>
              </div>
            </nav>

            {isLoggedIn && authUser ? (
              <UserAvatarMenu
                user={authUser}
                onSignOut={handleSignOut}
                notebookCount={notebook.length}
              />
            ) : (
              <Link
                to="/signup"
                className='relative ml-auto shrink-0 rounded-full bg-ep-accent px-5 py-2.5 text-sm font-bold tracking-tight text-ep-accent-foreground shadow-soft transition hover:bg-ep-accent-hover'
              >
                {t.ctaGetStarted}
                {notebook.length > 0 && (
                  <span className='absolute -top-1.5 -right-1.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-ep-surface-panel px-1 text-[10px] font-extrabold text-ep-accent-foreground shadow-card ring-1 ring-ep-line/70'>
                    {notebook.length > 9 ? "9+" : notebook.length}
                  </span>
                )}
              </Link>
            )}
          </div>

          <nav
            aria-label='Main navigation'
            className='flex justify-center md:hidden'
          >
            <div className='inline-flex w-full max-w-md items-center justify-around gap-0.5 rounded-full border border-ep-line/85 bg-ep-surface-panel/95 py-1 pl-1 pr-2 shadow-inner'>
              <button
                type='button'
                onClick={scrollMainTop}
                className={pillNavBtn}
              >
                {t.navStudy}
              </button>
              <button
                type='button'
                onClick={scrollToSearch}
                className={pillNavBtn}
              >
                {t.navSearch}
              </button>
              <button
                type='button'
                onClick={() => setDrawerOpen(true)}
                className={pillNavBtn}
              >
                {t.navNotebook}
              </button>
            </div>
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
                {t.heroPhraseInsight}{" "}
                <span className='text-ep-subtle'>{displayReference}</span>
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
            <span className='text-[11px] font-extrabold tracking-[0.14em] text-ep-muted uppercase'>
              {t.labelStudyLanguage}
            </span>
            <StudyLanguagePills
              value={studyLanguage}
              onChange={handleStudyLanguageChange}
              studyUiLang={studyLanguage}
            />
          </div>

          <div className='flex flex-col gap-4 pb-5 mb-5 border-b border-ep-line sm:flex-row sm:items-center sm:justify-between'>
            <span className='text-[11px] font-extrabold tracking-[0.14em] text-ep-muted uppercase'>
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
            className='flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-3'
          >
            <div className='min-w-0 flex-1'>
              <ReferencePicker
                bookSlug={pickerBookSlug}
                chapter={pickerChapter}
                verse={pickerVerse}
                onBookSlugChange={handlePickerBookChange}
                onChapterChange={setPickerChapter}
                onVerseChange={setPickerVerse}
                disabled={verseLoading}
                labels={pickerLabels}
              />
            </div>
            <button
              type='submit'
              disabled={verseLoading}
              className='inline-flex h-[3.25rem] w-full shrink-0 items-center justify-center gap-2.5 rounded-2xl bg-ep-accent px-6 text-sm font-bold tracking-tight text-ep-accent-foreground shadow-soft transition hover:bg-ep-accent-hover focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ep-accent/35 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100 sm:w-auto sm:min-w-[9.5rem] sm:px-8'
            >
              <IconSearch className='h-[1.125rem] w-[1.125rem] shrink-0 stroke-[2.25]' />
              {verseLoading ? t.searching : t.search}
            </button>
          </form>
        </div>

        {error && (
          <div
            className='mb-6 ep-alert-error shadow-inner sm:mb-8 sm:px-5 sm:py-4'
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
                <span className='text-ep-subtle'>
                  <span className='break-words'>{displayReference}</span>{" "}
                  <span className='whitespace-nowrap'>
                    → <span className='font-bold text-ep-accent'>{translation}</span>
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
              <p className='text-[11px] font-extrabold tracking-[0.14em] text-ep-muted uppercase'>
                {t.readingLabel}
              </p>
              {displayReference ? (
                <p className='mt-1 text-sm font-bold break-words text-ep-ink'>
                  {displayReference}{" "}
                  <span className='font-semibold text-ep-subtle'>
                    · {translation}
                  </span>
                </p>
              ) : (
                <p className='mt-1 text-sm text-ep-faint'>{t.loadVerseHint}</p>
              )}
            </div>
            {verseLoading && (
              <p className='text-sm font-semibold text-ep-subtle'>
                {t.loadingPassage}
              </p>
            )}
            {!verseLoading && phrasesLoading && verseText && (
              <p className='text-sm font-semibold text-ep-subtle'>
                {t.loadingPhrases}
              </p>
            )}
            {!verseLoading && !phrasesLoading && verseText && phrases.length > 0 && (
              <ScriptureViewer
                verseText={verseText}
                phrases={phrases}
                activePhraseId={activePhraseId}
                onPhraseClick={handlePhraseClick}
                ariaLabel={t.ariaScriptureRegion}
              />
            )}
            {!verseLoading && !phrasesLoading && verseText && phrases.length === 0 && (
              <div className='flex flex-col gap-3'>
                <ScriptureViewer
                  verseText={verseText}
                  interactive={false}
                  ariaLabel={t.ariaScriptureRegion}
                />
                {phrasesError && (
                  <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                    <p className='text-sm font-semibold text-ep-danger-text' role='alert'>
                      {phrasesError}
                    </p>
                    <button
                      type='button'
                      onClick={handleRetryPhrases}
                      className='shrink-0 rounded-full border border-ep-line bg-ep-surface-panel px-4 py-2 text-xs font-bold text-ep-ink shadow-inner transition hover:bg-ep-accent-soft'
                    >
                      {t.phrasesRetry}
                    </button>
                  </div>
                )}
              </div>
            )}
            {!verseLoading && !verseText && (
              <p className='text-sm italic font-medium text-ep-faint'>
                {t.versePlaceholder}
              </p>
            )}
          </div>

          <div className='w-full'>
            <WordBreakdownPanel
              breakdown={breakdown}
              loading={loading}
              revealedSectionCount={revealedSectionCount}
              onSave={handleSave}
              savedWords={currentSaved}
              saveRequiresLogin={!isLoggedIn}
              onCrossRefClick={handleCrossRefClick}
              crossRefPreview={crossRefPreview}
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

      <AddToHomeScreenPrompt
        open={showAddToHomeScreen && !experienceReviewRequired}
        copy={t}
        onClose={() => setShowAddToHomeScreen(false)}
      />

      <ExperienceReviewModal
        open={experienceReviewRequired && isLoggedIn}
        copy={t}
        onSubmitted={() => setExperienceReviewRequired(false)}
      />
    </div>
  );
}
