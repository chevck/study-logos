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
    heroPhraseInsight: 'Language insight:',
    heroFindPassage: 'Find a passage, then tap any word or words',
    heroBlurb:
      'Choose a study language and Bible edition, load a passage, and tap words grouped by transliteration. We won\'t feed you every detail — we lead you to what stirs your interest, so you keep researching and more light is expounded in your heart.',
    labelStudyLanguage: 'Study language',
    labelBibleEdition: 'Bible edition',
    srPassageGroup: 'Scripture passage',
    labelBook: 'Book',
    labelChapter: 'Chapter',
    labelVerse: 'Verse',
    search: 'Load passage',
    searching: 'Loading…',
    passageHeading: 'Passage:',
    scriptureHeading: 'Scripture',
    readingLabel: 'Reading',
    loadVerseHint: 'Choose book, chapter, and verse above, then load the passage.',
    loadingPassage: 'Loading passage…',
    versePlaceholder: 'Your verse appears here after you load a passage.',
    loadingPhrases: 'Mapping words to original language…',
    phrasesError: 'Could not map this passage to original-language words.',
    phrasesRetry: 'Retry word mapping',
    selectedPhrase: 'Selected text',
    saveNotebook: 'Save to notebook',
    saveNotebookSignIn: 'Sign in to save',
    savedNotebook: 'Saved to notebook',
    segments: {
      originalLanguage: 'Original language',
      definition: 'Definition',
      firstMention: 'First mention',
      caseStudy: 'Case study',
      crossRefs: 'Cross-references',
      commentary: 'Commentary',
    },
    crossRefLoading: 'Loading cross-reference…',
    crossRefNoMatch: 'The selected text does not appear in this verse.',
    firstMentionNoMatch:
      'The English translation may use different wording here — read the passage for the related original-language concept.',
    seeFirstMention: 'See first mention in Scripture',
    firstMentionTeaser:
      'Curious where this word first appears — in Hebrew, Greek, or both? Explore when you\'re ready.',
    firstMentionHide: 'Hide first mentions',
    breakdownBack: '← Back',
    breakdownEmptyHint:
      'Tap any word or words in the passage — grouped by transliteration — to see original language, definition, case study, and cross-references.',
    breakdownLoading: 'Generating breakdown…',
    notebookTitle: 'Notebook',
    notebookClose: 'Close',
    notebookAriaBackdrop: 'Close notebook',
    notebookEmpty: 'Nothing saved yet. Open a breakdown and tap Save to notebook.',
    notebookRemove: 'Remove',
    errLoadVerse: 'Could not load verse',
    errLoadBreakdown: 'Could not load breakdown',
    errGuestLimit:
      'Guest preview allows one passage with one word breakdown. Sign in to keep studying.',
    toastSignInToSave: 'Sign in to save words to your notebook.',
    toastNotebookOffline:
      'Using saved notebook offline; will sync when the server is available',
    toastNotebookFail: 'Notebook could not load from server',
    toastSaveFail: 'Could not save notebook to server',
    toastRemoved: 'Removed from notebook',
    toastSaved: 'Saved to notebook ✓',
    skeletonAria: 'Loading breakdown',
    ariaScriptureRegion: 'Scripture passage',
    addToHomeTitle: 'Add Study Logos to your home screen',
    addToHomeBody:
      'Open the app in one tap — like an app on your phone, without the app store.',
    addToHomeIosStep1: 'Tap the Share button in Safari',
    addToHomeIosStep2: 'Scroll down and tap “Add to Home Screen”',
    addToHomeAndroidInstall: 'Add to home screen',
    addToHomeAndroidManual:
      'Open your browser menu and choose “Add to home screen” or “Install app”.',
    addToHomeNotNow: 'Not now',
    betaBadge: 'Beta',
    betaNotice: 'Study Logos is currently in beta testing',
    experienceReviewIntro:
      'You’ve completed five word studies — we’d love a quick review before you continue. This only takes a minute.',
    experienceReviewRatingLabel: 'Overall, how would you rate your experience so far?',
    experienceReviewRatingLow: '1 · Not good',
    experienceReviewRatingHigh: '10 · Excellent',
    experienceReviewEnjoyedLabel: 'What have you enjoyed most so far?',
    experienceReviewEnjoyedPlaceholder:
      'e.g. tapping words grouped by transliteration, case studies, cross-references…',
    experienceReviewWishLabel:
      'What do you wish the app had — or what would help your devotion or study?',
    experienceReviewWishPlaceholder:
      'Features, content, workflow, or anything that would deepen your time in the Word…',
    experienceReviewRecommendLabel:
      'How likely are you to recommend Study Logos to someone in your church or Bible study?',
    experienceReviewRecommendLow: '1 · Not likely',
    experienceReviewRecommendHigh: '10 · Very likely',
    experienceReviewSectionLabel: 'Which part of the breakdown helps you most?',
    experienceReviewSectionPlaceholder: 'Choose one…',
    experienceReviewSections: [
      { value: 'originalLanguage', label: 'Original language' },
      { value: 'definition', label: 'Definition' },
      { value: 'caseStudy', label: 'Case study' },
      { value: 'crossReferences', label: 'Cross-references' },
      { value: 'firstMention', label: 'First mention' },
      { value: 'commentary', label: 'Commentary' },
    ],
    experienceReviewSubmit: 'Submit and continue studying',
    experienceReviewSubmitting: 'Submitting…',
    experienceReviewSubmitError: 'Could not save your review. Please try again.',
    experienceReviewRequiredNote:
      'Please complete this short review to continue using Study Logos.',
  },
  yor: {
    docTitle: 'Ìwádìí Logos',
    brandWord1: 'ìwádìí',
    brandWord2: 'logos',
    navStudy: 'Ìwádìí',
    navSearch: 'Ṣàwárí',
    navNotebook: 'Àkọsílẹ̀',
    ctaGetStarted: 'Bẹ̀rẹ̀',
    heroPhraseInsight: 'Oye èdè:',
    heroFindPassage: 'Wá ẹ̀kúnrín kan, kí o kàn sí ọ̀rọ̀ tàbí àwọn ọ̀rọ̀',
    heroBlurb:
      'Yàn èdè àti ẹ̀dà Bíbélì, kí o gbé Ìwé Mímọ́ wọlé, kí o tẹ ọ̀rọ̀ tàbí àwọn ọ̀rọ̀ tí a pín ní ìbámu pẹ̀lú àkọsílẹ̀ èdè àtẹ̀yìnwá fún oye Gíríkì / Hébérù àti àwọn ìgbéyẹ̀wò aláròpọ.',
    labelStudyLanguage: 'Èdè ìwádìí',
    labelBibleEdition: 'Ẹ̀dà Bíbélì',
    srPassageGroup: 'Àṣẹ Ìwé Mímọ́',
    labelBook: 'Ìwé',
    labelChapter: 'Ẹ̀ka',
    labelVerse: 'Ẹ̀sì',
    search: 'Gbé wọlé',
    searching: 'À ń gbé wọlé…',
    passageHeading: 'Ẹ̀kúnrín:',
    scriptureHeading: 'Ìwé Mímọ́',
    readingLabel: 'Kíkà',
    loadVerseHint: 'Yàn ìwé, ẹ̀ka, àti ẹ̀sì lókè, kí o gbé ẹ̀kúnrín náà wọlé.',
    loadingPassage: 'À ń gbé ẹ̀kúnrín náà wọlé…',
    versePlaceholder: 'Ẹ̀kúnrín rẹ yóò fara hàn níbí lẹ́yìn tí o bá ti gbé e wọlé.',
    loadingPhrases: 'À ń ṣe àpapọ̀ ọ̀rọ̀ pẹ̀lú èdè àtẹ̀yìnwá…',
    phrasesError: 'Kò lè ṣe àpapọ̀ ẹ̀kúnrín náà pẹ̀lú ọ̀rọ̀ èdè àtẹ̀yìnwá.',
    phrasesRetry: 'Gbìyànjú àpapọ̀ ọ̀rọ̀ lẹ́ẹ̀kansi',
    selectedPhrase: 'Àkọsílẹ̀ tí a fọwọ́kan',
    saveNotebook: 'Fi sínú àkọsílẹ̀',
    savedNotebook: 'Ti fi sínú àkọsílẹ̀',
    segments: {
      originalLanguage: 'Èdè àtẹ̀yìnwá',
      definition: 'Àṣẹ àyẹ̀wò',
      firstMention: 'Ìgbà kọ́kọ́',
      caseStudy: 'Ìgbéyẹ̀wò',
      crossRefs: 'Àwọn àṣẹ ìtọ́kasí',
      commentary: 'Ìsọfúnni',
    },
    crossRefLoading: 'À ń gbé àṣẹ ìtọ́kasí wọlé…',
    crossRefNoMatch: 'A kò rí àkọsílẹ̀ kan tí ó bá èdè àtẹ̀yìnwá náà mu.',
    firstMentionNoMatch:
      'Itumọ̀ Gẹ̀ẹ́sì leè fara yà níbí — kà áṣẹ náà láti rí èrò èdè àtẹ̀yìnwá tí ó jọmọ.',
    seeFirstMention: 'Wo ìgbà kọ́kọ́ tí a ṣàmúlò ọ̀rọ̀ náà',
    firstMentionTeaser:
      'Ṣe o ní ìfẹ́ mọ̀ ibi tí a ṣàmúlò ọ̀rọ̀ náà lákọkọ́ — ní Hébérù, Gíríkì, tàbí méjèèjì? Ṣàwárí nígbà tí o bá setán.',
    firstMentionHide: 'Pa àwọn ìgbà kọ́kọ́',
    breakdownBack: '← Padà',
    breakdownEmptyHint:
      'Tẹ ọ̀rọ̀ tàbí àwọn ọ̀rọ̀ nínú ẹ̀kúnrín náà — tí a pín ní ìbámu pẹ̀lú àkọsílẹ̀ èdè àtẹ̀yìnwá — láti rí èdè àtẹ̀yìnwá, àṣẹ àyẹ̀wò, ìgbéyẹ̀wò, àti àwọn àṣẹ ìtọ́kasí.',
    breakdownLoading: 'À ń ṣẹ̀ṣẹ̀ ń dá àpẹrẹ náà…',
    notebookTitle: 'Àkọsílẹ̀',
    notebookClose: 'Pa',
    notebookAriaBackdrop: 'Pa àkọsílẹ̀',
    notebookEmpty:
      'Kò sí nǹkan tí a fi pamọ́ síbáyósí. Ṣí àpẹrẹ kan kí o sì tẹ Fi sínú àkọsílẹ̀.',
    notebookRemove: 'Yọ kúrò',
    errLoadVerse: 'Kò lè gbé ẹ̀kúnrín náà wọlé',
    errLoadBreakdown: 'Kò lè ṣe àpẹrẹ náà',
    toastNotebookOffline:
      'À ń lo àkọsílẹ̀ tí a fi pamọ́ láìsí ẹ̀rọ-ìbára; yóò bá aṣẹ pẹ̀lú nígbà tí olùpín bá wà',
    toastNotebookFail: 'Kò lè gbé àkọsílẹ̀ láti olùpín',
    toastSaveFail: 'Kò lè fi àkọsílẹ̀ pamọ́ sí olùpín',
    toastRemoved: 'Ti yọ kúrò nínú àkọsílẹ̀',
    toastSaved: 'Ti fi sínú àkọsílẹ̀ ✓',
    skeletonAria: 'À ń gbé àpẹrẹ náà',
    ariaScriptureRegion: 'Ẹ̀kúnrín Ìwé Mímọ́',
    addToHomeTitle: 'Fi Study Logos sí ojú ààlà fóònù rẹ',
    addToHomeBody:
      'Ṣí app náà pẹ̀lú títẹ kan — bíi app lórí fóònù rẹ, láìsí app store.',
    addToHomeIosStep1: 'Tẹ bọ́tìnì Share nínú Safari',
    addToHomeIosStep2: 'Wọlé sílẹ̀ kí o tẹ “Add to Home Screen”',
    addToHomeAndroidInstall: 'Fi sí ojú ààlà fóònù',
    addToHomeAndroidManual:
      'Ṣí menu aṣàwákiri rẹ kí o yàn “Add to home screen” tàbí “Install app”.',
    addToHomeNotNow: 'Kò sí ní báyìí',
    betaBadge: 'Beta',
    betaNotice: 'Study Logos wà ní ìdánwò beta lọ́wọ́lọ́wọ́',
    experienceReviewIntro:
      'O ti parí àwọn ìwádìí ọ̀rọ̀ marún — a fẹ́ gbọ́ ọ̀rọ̀ rẹ kíákíá kí o tó tẹ̀síwájú. Ó ń gba ìṣẹ́jú kan.',
    experienceReviewRatingLabel: 'Lápapọ̀, báwo ni o ṣe yẹ ìrírí rẹ síbí?',
    experienceReviewRatingLow: '1 · Kò dára',
    experienceReviewRatingHigh: '10 · Ó dára gidigidi',
    experienceReviewEnjoyedLabel: 'Kini o ti gbádùn jùlọ síbí?',
    experienceReviewEnjoyedPlaceholder: 'Fún àpẹẹrẹ: títẹ ọ̀rọ̀, àwọn ìgbéyẹ̀wò, àwọn àṣẹ ìtọ́kasí…',
    experienceReviewWishLabel:
      'Kini o fẹ́ kí app náà ní — tàbí kini yóò ràn iwádìí tàbí ẹ̀bọ rẹ lọ́wọ́?',
    experienceReviewWishPlaceholder: 'Àwọn ẹya, àkoonu, tàbí ohunkóhun tí yóò jìn sí ìwé Mímọ́ rẹ…',
    experienceReviewRecommendLabel:
      'Báwo ni o ṣe lè ṣàbá Study Logos sí ẹnì kan nínú ìjọ tàbí ẹgbẹ́ Bíbélì rẹ?',
    experienceReviewRecommendLow: '1 · Kò ṣeé ṣe',
    experienceReviewRecommendHigh: '10 · Ó ṣeé ṣe gidigidi',
    experienceReviewSectionLabel: 'Igbá wo nínú àpẹrẹ náà ló ràn ọ́ jù?',
    experienceReviewSectionPlaceholder: 'Yàn ọ̀kan…',
    experienceReviewSections: [
      { value: 'originalLanguage', label: 'Èdè àtẹ̀yìnwá' },
      { value: 'definition', label: 'Àṣẹ àyẹ̀wò' },
      { value: 'caseStudy', label: 'Ìgbéyẹ̀wò' },
      { value: 'crossReferences', label: 'Àwọn àṣẹ ìtọ́kasí' },
      { value: 'firstMention', label: 'Ìgbà kọ́kọ́' },
      { value: 'commentary', label: 'Ìsọfúnni' },
    ],
    experienceReviewSubmit: 'Fi ránṣẹ́ kí o tẹ̀síwájú ìwádìí',
    experienceReviewSubmitting: 'À ń fi ránṣẹ́…',
    experienceReviewSubmitError: 'Kò lè fi àmọ̀ rẹ pamọ́. Gbìyànjú lẹ́ẹ̀kansi.',
    experienceReviewRequiredNote:
      'Jọ̀wọ́ parí àmọ̀ yìí láti tẹ̀síwájú lò Study Logos.',
  },
};

export function appCopy(lang) {
  return APP_COPY[lang] ?? APP_COPY.eng;
}

/** Pill styles shared; labels localized for empty `caseStudyLabel` fallback. */
export const CASE_STYLES = {
  story: {
    pill: 'border-ep-success/35 bg-ep-success-soft text-ep-case-story-text',
  },
  cinematic: {
    pill: 'border-violet-400/40 bg-ep-case-violet-soft text-ep-case-violet-text',
  },
  historical: {
    pill: 'border-amber-400/40 bg-ep-case-amber-soft text-ep-case-amber-text',
  },
  parable: {
    pill: 'border-orange-700/30 bg-ep-case-parable-soft text-ep-case-parable-text',
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
export const AUTH_TOKEN_KEY = 'study-logos-auth-token';
export const AUTH_USER_KEY = 'study-logos-auth-user';
export const GUEST_ID_KEY = 'study-logos-guest-id';
export const THEME_PREFERENCE_KEY = 'study-logos-theme-preference';
