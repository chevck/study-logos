export const BREAKDOWN_SECTIONS = [
  'core',
  'firstMentions',
  'caseStudy',
  'crossReferences',
  'commentary',
];

/** UI segment keys mapped to API section ids (core covers original + definition). */
export const BREAKDOWN_SEGMENT_ORDER = [
  'core',
  'firstMentions',
  'caseStudy',
  'crossReferences',
  'commentary',
];

export function isBreakdownActive(breakdown, loading) {
  return loading || Boolean(breakdown?.phrase || breakdown?.reference);
}
