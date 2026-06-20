import { AUTH_TOKEN_KEY, AUTH_USER_KEY, GUEST_ID_KEY, THEME_PREFERENCE_KEY } from "./types.js";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function getAuthToken() {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY)?.trim() || null;
  } catch {
    return null;
  }
}

export function setAuthToken(token) {
  try {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  } catch {
    /* ignore */
  }
}

export function getAuthUser() {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAuthUser(user) {
  try {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  } catch {
    /* ignore */
  }
}

export function clearAuth() {
  setAuthToken(null);
  setAuthUser(null);
}

export class SessionExpiredError extends Error {
  constructor(message = "Session expired. Please sign in again.") {
    super(message);
    this.name = "SessionExpiredError";
  }
}

export class GuestLimitError extends Error {
  constructor(message = "Sign in to keep studying.") {
    super(message);
    this.name = "GuestLimitError";
  }
}

export function getOrCreateGuestId() {
  try {
    let id = localStorage.getItem(GUEST_ID_KEY);
    if (!id || !UUID_RE.test(id)) {
      id = crypto.randomUUID();
      localStorage.setItem(GUEST_ID_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

export function getThemePreference() {
  try {
    return localStorage.getItem(THEME_PREFERENCE_KEY);
  } catch {
    return null;
  }
}

export function setThemePreference(theme) {
  try {
    if (theme) {
      localStorage.setItem(THEME_PREFERENCE_KEY, theme);
    } else {
      localStorage.removeItem(THEME_PREFERENCE_KEY);
    }
  } catch {
    /* ignore */
  }
}
