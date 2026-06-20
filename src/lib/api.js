import {
  clearAuth,
  getAuthToken,
  getOrCreateGuestId,
  GuestLimitError,
  SessionExpiredError,
  setAuthToken,
  setAuthUser,
} from "./authStorage.js";
import { applyTheme, normalizeTheme } from "./theme.js";
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

function applyRefreshedToken(res) {
  const refreshed = res.headers.get("X-Auth-Token");
  if (refreshed) {
    setAuthToken(refreshed);
  }
}

async function apiFetch(url, options = {}) {
  const token = getAuthToken();
  const headers = new Headers(options.headers ?? {});

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  } else {
    headers.set("X-Guest-Id", getOrCreateGuestId());
  }

  const res = await fetch(url, { ...options, headers });
  applyRefreshedToken(res);

  if (res.status === 401 && token) {
    clearAuth();
    throw new SessionExpiredError(await parseError(res));
  }

  if (res.status === 403 && !token) {
    throw new GuestLimitError(await parseError(res));
  }

  return res;
}

export async function fetchVerse(
  reference,
  translation,
  bibleLanguage = "eng",
) {
  const params = new URLSearchParams({
    reference: reference.trim(),
    translation: translation.trim(),
    language: bibleLanguage,
  });
  const res = await apiFetch(`${BASE}/api/verse?${params}`);
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function fetchNotebook(notebookId) {
  const res = await apiFetch(`${BASE}/api/notebook/${notebookId}`);
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function saveNotebook(notebookId, entries) {
  const res = await apiFetch(`${BASE}/api/notebook/${notebookId}`, {
    method: "PUT",
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
  const res = await apiFetch(`${BASE}/api/breakdown`, {
    method: "POST",
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

export async function signup({ fullName, email, password }) {
  const res = await fetch(`${BASE}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullName, email, password }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function login({ email, password }) {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  applyRefreshedToken(res);
  if (!res.ok) throw new Error(await parseError(res));
  const data = await res.json();
  if (data.token) {
    setAuthToken(data.token);
  }
  if (data.user) {
    setAuthUser(data.user);
    applyTheme(normalizeTheme(data.user.theme));
  }
  return data;
}

export async function fetchSessionUser() {
  const res = await apiFetch(`${BASE}/api/auth/me`);
  if (!res.ok) throw new Error(await parseError(res));
  const data = await res.json();
  if (data.user) {
    setAuthUser(data.user);
    applyTheme(normalizeTheme(data.user.theme));
  }
  return data;
}

export async function updateUserTheme(theme) {
  const res = await apiFetch(`${BASE}/api/auth/me`, {
    method: "PATCH",
    body: JSON.stringify({ theme }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  const data = await res.json();
  if (data.user) {
    setAuthUser(data.user);
    applyTheme(normalizeTheme(data.user.theme));
  }
  return data;
}

export async function requestPasswordReset({ email }) {
  const res = await fetch(`${BASE}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function resetPassword({ token, password }) {
  const res = await fetch(`${BASE}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export {
  clearAuth,
  getAuthToken,
  getAuthUser,
  GuestLimitError,
  SessionExpiredError,
} from "./authStorage.js";
