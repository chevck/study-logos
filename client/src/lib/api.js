const BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:6001";

async function parseError(res) {
  try {
    const body = await res.json();
    return body.error || body.message || res.statusText;
  } catch {
    return res.statusText;
  }
}

export async function fetchVerse(reference, translation, bibleLanguage = 'eng') {
  const params = new URLSearchParams({
    reference: reference.trim(),
    translation: translation.trim(),
    language: bibleLanguage,
  });
  const res = await fetch(`${BASE}/api/verse?${params}`);
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function fetchNotebook(notebookId) {
  const res = await fetch(`${BASE}/api/notebook/${notebookId}`);
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function saveNotebook(notebookId, entries) {
  const res = await fetch(`${BASE}/api/notebook/${notebookId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ entries }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function fetchBreakdown({
  word,
  reference,
  verseText,
  translation,
  studyLanguage,
}) {
  const res = await fetch(`${BASE}/api/breakdown`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      word,
      reference,
      verseText,
      translation,
      studyLanguage: studyLanguage ?? "eng",
    }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}
