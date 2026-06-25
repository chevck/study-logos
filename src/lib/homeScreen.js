const DISMISS_KEY = 'study-logos-a2hs-dismissed';
const PENDING_KEY = 'study-logos-pending-a2hs';

/** True when the app was opened from a home-screen / installed shortcut. */
export function isInstalledHomeScreen() {
  if (typeof window === 'undefined') return false;
  if (window.navigator.standalone === true) return true;
  return ['standalone', 'fullscreen', 'minimal-ui'].some((mode) =>
    window.matchMedia(`(display-mode: ${mode})`).matches,
  );
}

export function isMobileDevice() {
  if (typeof window === 'undefined') return false;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const narrow = window.matchMedia('(max-width: 768px)').matches;
  const mobileUa = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  return (coarse && narrow) || mobileUa;
}

export function isIosSafariLike() {
  if (typeof navigator === 'undefined') return false;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function canSuggestHomeScreen() {
  return isMobileDevice() && !isInstalledHomeScreen();
}

export function isHomeScreenPromptDismissed() {
  try {
    return localStorage.getItem(DISMISS_KEY) === '1';
  } catch {
    return false;
  }
}

export function dismissHomeScreenPrompt() {
  try {
    localStorage.setItem(DISMISS_KEY, '1');
  } catch {
    /* ignore */
  }
}

export function markPendingHomeScreenPrompt() {
  try {
    sessionStorage.setItem(PENDING_KEY, '1');
  } catch {
    /* ignore */
  }
}

export function consumePendingHomeScreenPrompt() {
  try {
    const pending = sessionStorage.getItem(PENDING_KEY) === '1';
    if (pending) sessionStorage.removeItem(PENDING_KEY);
    return pending;
  } catch {
    return false;
  }
}
