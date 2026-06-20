import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  fetchSessionUser,
  getAuthToken,
  getAuthUser,
  updateUserTheme,
} from "../lib/api.js";
import {
  getThemePreference,
  setAuthUser,
  setThemePreference,
} from "../lib/authStorage.js";
import {
  applyTheme,
  normalizeTheme,
  resolveTheme,
  subscribeToSystemTheme,
} from "../lib/theme.js";

const ThemeContext = createContext(null);

function readInitialPreference() {
  const userTheme = getAuthUser()?.theme;
  if (userTheme) return normalizeTheme(userTheme);
  return normalizeTheme(getThemePreference());
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readInitialPreference);
  const [resolvedTheme, setResolvedTheme] = useState(() => resolveTheme(readInitialPreference()));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const resolved = applyTheme(theme);
    setResolvedTheme(resolved);
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") return undefined;
    return subscribeToSystemTheme(() => {
      const resolved = applyTheme("system");
      setResolvedTheme(resolved);
    });
  }, [theme]);

  useEffect(() => {
    let cancelled = false;

    async function loadTheme() {
      if (!getAuthToken()) {
        if (!cancelled) {
          setThemeState(normalizeTheme(getThemePreference()));
          setReady(true);
        }
        return;
      }

      const cached = getAuthUser()?.theme;
      if (cached && !cancelled) {
        setThemeState(normalizeTheme(cached));
      }

      try {
        const data = await fetchSessionUser();
        if (!cancelled) {
          setThemeState(normalizeTheme(data.user?.theme));
        }
      } catch {
        if (!cancelled) {
          setThemeState(normalizeTheme(getAuthUser()?.theme ?? getThemePreference()));
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    }

    loadTheme();
    return () => {
      cancelled = true;
    };
  }, []);

  const setTheme = useCallback(async (next) => {
    const normalized = normalizeTheme(next);
    setThemeState(normalized);
    setThemePreference(normalized);
    const resolved = applyTheme(normalized);
    setResolvedTheme(resolved);

    if (!getAuthToken()) return normalized;

    const data = await updateUserTheme(normalized);
    if (data.user) {
      setAuthUser(data.user);
    }
    return normalized;
  }, []);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme, ready }),
    [theme, resolvedTheme, setTheme, ready],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
