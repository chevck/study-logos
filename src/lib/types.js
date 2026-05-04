/** @deprecated Use TRANSLATIONS_BY_STUDY_LANGUAGE["eng"] or pass codes from parent. */
export const TRANSLATIONS = ['NKJV', 'NLT', 'AMP'];

/**
 * Study / UI language (app). Each maps to API.Bible `language` (ISO 639-3) for listing bibles.
 */
export const STUDY_LANGUAGES = [
  { code: 'eng', bibleLanguage: 'eng' },
  { code: 'yor', bibleLanguage: 'yor' },
];

/** Study language codes not yet offered in the UI (disabled + “Coming soon”). */
export const DISABLED_STUDY_LANGUAGE_CODES = new Set(['yor']);

/** Label for each option [optionCode], when the whole UI is in [uiLang]. */
export const STUDY_LANGUAGE_CHOICE_LABELS = {
  eng: { eng: 'English', yor: 'Yorùbá' },
  yor: { eng: 'Èdè Gẹ̀ẹ́sì', yor: 'Yorùbá' },
};

/** Bible edition codes shown as pills; must resolve via API.Bible for the given bibleLanguage. */
export const TRANSLATIONS_BY_STUDY_LANGUAGE = {
  eng: ['NKJV', 'NLT', 'AMP'],
  yor: ['OYCB'],
};

export function studyLanguageToBibleApiLanguage(studyLangCode) {
  const row = STUDY_LANGUAGES.find((l) => l.code === studyLangCode);
  return row?.bibleLanguage ?? 'eng';
}

/**
 * All user-visible chrome copy follows the study language (English vs Yorùbá).
 * @type {Record<string, typeof APP_COPY.eng>}
 */
export const APP_COPY = {
  eng: {
    docTitle: 'Study Logos',
    brandWord1: 'study',
    brandWord2: 'logos',
    navStudy: 'Study',
    navSearch: 'Search',
    navNotebook: 'Notebook',
    ctaGetStarted: 'Get started',
    heroWordInsight: 'Word insight:',
    heroFindPassage: 'Find a passage, then tap any word',
    heroBlurb:
      'Choose a study language and Bible edition, load Scripture, then tap a word for Greek / Hebrew insight and narrative case studies.',
    labelStudyLanguage: 'Study language',
    labelBibleEdition: 'Bible edition',
    srRefLabel: 'Scripture reference',
    placeholderRef: 'e.g. Romans 5:13 or John 3:16',
    search: 'Search',
    searching: 'Searching…',
    passageHeading: 'Passage:',
    scriptureHeading: 'Scripture',
    readingLabel: 'Reading',
    loadVerseHint: 'Load a verse with Search above.',
    loadingPassage: 'Loading passage…',
    versePlaceholder: 'Your verse appears here after you search.',
    selectedWord: 'Selected word',
    saveNotebook: 'Save to notebook',
    savedNotebook: 'Saved to notebook',
    segments: {
      originalLanguage: 'Original language',
      definition: 'Definition',
      caseStudy: 'Case study',
      crossRefs: 'Cross-references',
      commentary: 'Commentary',
    },
    breakdownBack: '← Back',
    breakdownEmptyHint:
      'Tap any word in the passage to see original language, definition, case study, and cross-references.',
    breakdownLoading: 'Generating word breakdown…',
    notebookTitle: 'Notebook',
    notebookClose: 'Close',
    notebookAriaBackdrop: 'Close notebook',
    notebookEmpty: 'Nothing saved yet. Open a breakdown and tap Save to notebook.',
    notebookRemove: 'Remove',
    errLoadVerse: 'Could not load verse',
    errLoadBreakdown: 'Could not load breakdown',
    toastNotebookOffline:
      'Using saved notebook offline; will sync when the server is available',
    toastNotebookFail: 'Notebook could not load from server',
    toastSaveFail: 'Could not save notebook to server',
    toastRemoved: 'Removed from notebook',
    toastSaved: 'Saved to notebook ✓',
    skeletonAria: 'Loading breakdown',
    ariaScriptureRegion: 'Scripture passage',
  },
  yor: {
    docTitle: 'Ìwádìí Logos',
    brandWord1: 'ìwádìí',
    brandWord2: 'logos',
    navStudy: 'Ìwádìí',
    navSearch: 'Ṣàwárí',
    navNotebook: 'Àkọsílẹ̀',
    ctaGetStarted: 'Bẹ̀rẹ̀',
    heroWordInsight: 'Oye ọ̀rọ̀:',
    heroFindPassage: 'Wá ẹ̀kúnrín kan, kí o kàn sí ọ̀rọ̀ kan',
    heroBlurb:
      'Yàn èdè àti ẹ̀dà Bíbélì, kí o gbé Ìwé Mímọ́ wọlé, kí o tẹ ọ̀rọ̀ kan fún oye Èdè Gíríkì / Hébérù àti àwọn ìgbéyẹ̀wò aláròpọ.',
    labelStudyLanguage: 'Èdè ìwádìí',
    labelBibleEdition: 'Ẹ̀dà Bíbélì',
    srRefLabel: 'Àṣẹ Ìwé Mímọ́',
    placeholderRef: 'Àpẹrẹ Romans 5:13 tàbí John 3:16',
    search: 'Ṣàwárí',
    searching: 'À ń ṣàwárí…',
    passageHeading: 'Ẹ̀kúnrín:',
    scriptureHeading: 'Ìwé Mímọ́',
    readingLabel: 'Kíkà',
    loadVerseHint: 'Gbé ẹ̀kúnrín kan wọlé nípasẹ̀ Ṣàwárí lókè.',
    loadingPassage: 'À ń gbé ẹ̀kúnrín náà wọlé…',
    versePlaceholder: 'Ẹ̀kúnrín rẹ yóò fara hàn níbí lẹ́yìn tí o bá ti ṣàwárí.',
    selectedWord: 'Ọ̀rọ̀ tí a fọwọ́kan',
    saveNotebook: 'Fi sínú àkọsílẹ̀',
    savedNotebook: 'Ti fi sínú àkọsílẹ̀',
    segments: {
      originalLanguage: 'Èdè àtẹ̀yìnwá',
      definition: 'Àṣẹ àyẹ̀wò',
      caseStudy: 'Ìgbéyẹ̀wò',
      crossRefs: 'Àwọn àṣẹ ìtọ́kasí',
      commentary: 'Ìsọfúnni',
    },
    breakdownBack: '← Padà',
    breakdownEmptyHint:
      'Tẹ ọ̀rọ̀ kan nínú ẹ̀kúnrín náà láti rí èdè àtẹ̀yìnwá, àṣẹ àyẹ̀wò, ìgbéyẹ̀wò, àti àwọn àṣẹ ìtọ́kasí.',
    breakdownLoading: 'À ń ṣẹ̀ṣẹ̀ ń dá àpẹrẹ ọ̀rọ̀ náà…',
    notebookTitle: 'Àkọsílẹ̀',
    notebookClose: 'Pa',
    notebookAriaBackdrop: 'Pa àkọsílẹ̀',
    notebookEmpty:
      'Kò sí nǹkan tí a fi pamọ́ síbáyósí. Ṣí àpẹrẹ ọ̀rọ̀ kan kí o sì tẹ Fi sínú àkọsílẹ̀.',
    notebookRemove: 'Yọ kúrò',
    errLoadVerse: 'Kò lè gbé ẹ̀kúnrín náà wọlé',
    errLoadBreakdown: 'Kò lè ṣe àpẹrẹ ọ̀rọ̀ náà',
    toastNotebookOffline:
      'À ń lo àkọsílẹ̀ tí a fi pamọ́ láìsí ẹ̀rọ-ìbára; yóò bá aṣẹ pẹ̀lú nígbà tí olùpín bá wà',
    toastNotebookFail: 'Kò lè gbé àkọsílẹ̀ láti olùpín',
    toastSaveFail: 'Kò lè fi àkọsílẹ̀ pamọ́ sí olùpín',
    toastRemoved: 'Ti yọ kúrò nínú àkọsílẹ̀',
    toastSaved: 'Ti fi sínú àkọsílẹ̀ ✓',
    skeletonAria: 'À ń gbé àpẹrẹ ọ̀rọ̀ náà',
    ariaScriptureRegion: 'Ẹ̀kúnrín Ìwé Mímọ́',
  },
};

export function appCopy(lang) {
  return APP_COPY[lang] ?? APP_COPY.eng;
}

/** Pill styles shared; labels localized for empty `caseStudyLabel` fallback. */
export const CASE_STYLES = {
  story: {
    pill: 'border-emerald-300 bg-emerald-50 text-emerald-900',
  },
  cinematic: {
    pill: 'border-violet-300 bg-violet-50 text-violet-900',
  },
  historical: {
    pill: 'border-amber-300 bg-amber-50 text-amber-950',
  },
  parable: {
    pill: 'border-orange-800/30 bg-[#FDF5F0] text-[#6B2E12]',
  },
};

export const CASE_STUDY_LABELS = {
  eng: {
    story: 'Short story',
    cinematic: 'Cinematic',
    historical: 'Historical analogy',
    parable: 'Parable',
  },
  yor: {
    story: 'Ìtàn kíkúrú',
    cinematic: 'Fìdíò',
    historical: 'Àbápín tí tẹ̀lẹ',
    parable: 'Ọ̀rọ̀ àlọ́',
  },
};

/** Legacy: full notebook JSON was stored here; entries now live on the server under NOTEBOOK_ID_KEY. */
export const NOTEBOOK_STORAGE_KEY = 'study-logos-notebook';
export const NOTEBOOK_ID_KEY = 'study-logos-notebook-id';
