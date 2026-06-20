import { useState } from "react";
import { useTheme } from "../context/ThemeContext.jsx";
import ThemePicker from "./ThemePicker.jsx";
import { getAuthToken } from "../lib/authStorage.js";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isLoggedIn = Boolean(getAuthToken());

  const handleSelect = async (next) => {
    if (next === theme || saving) return;
    setError("");
    setSaving(true);
    try {
      await setTheme(next);
    } catch (err) {
      setError(err.message || "Could not save theme.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-extrabold text-ep-ink">Appearance</p>
          <p className="mt-0.5 text-xs font-medium text-ep-muted">
            {isLoggedIn
              ? "System follows your device. Your choice is saved to your account."
              : "System follows your device settings. Your choice is saved on this browser."}
          </p>
        </div>
        <ThemePicker onChange={handleSelect} disabled={saving} />
      </div>
      {error ? (
        <p className="mt-2 text-xs font-semibold text-ep-danger-text" role="alert">
          {error}
        </p>
      ) : null}
      {saving ? (
        <p className="mt-2 text-xs font-medium text-ep-muted">Saving…</p>
      ) : null}
    </div>
  );
}
