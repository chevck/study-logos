import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";
import { clearAuth, fetchSessionUser } from "../lib/api.js";
import { avatarColorFromName, initialsFromName } from "../lib/userDisplay.js";

export default function AccountSettingsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Account settings — Study Logos";
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchSessionUser()
      .then((data) => {
        if (!cancelled) setUser(data.user);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Could not load account.");
          navigate("/login", {
            replace: true,
            state: { message: "Sign in to view account settings.", returnTo: "/account" },
          });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const handleSignOut = () => {
    clearAuth();
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center font-sans text-sm font-semibold text-ep-muted">
        Loading account…
      </div>
    );
  }

  if (error || !user) {
    return null;
  }

  const initials = initialsFromName(user.fullName);
  const colorClass = avatarColorFromName(user.fullName);

  return (
    <div className="min-h-screen font-sans">
      <header className="ep-header-bar px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
          <Link to="/">
            <Logo />
          </Link>
          <Link
            to="/study"
            className="rounded-full px-4 py-2 text-sm font-semibold text-ep-muted transition hover:bg-ep-surface-panel/80 hover:text-ep-ink"
          >
            Back to study
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-ep-ink">Account settings</h1>
        <p className="mt-2 text-sm font-medium text-ep-muted">
          Manage your Study Logos profile and sign-in preferences.
        </p>

        <div className="ep-surface-card mt-8 p-6 sm:p-8">
          <div className="flex items-center gap-4 border-b border-ep-line/80 pb-6">
            <div
              className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-extrabold shadow-soft ${colorClass}`}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-extrabold text-ep-ink">{user.fullName}</p>
              <p className="truncate text-sm font-medium text-ep-muted">{user.email}</p>
            </div>
          </div>

          <dl className="mt-6 space-y-5">
            <div>
              <dt className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-ep-muted">
                Full name
              </dt>
              <dd className="mt-1 text-sm font-semibold text-ep-ink">{user.fullName}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-ep-muted">
                Email
              </dt>
              <dd className="mt-1 text-sm font-semibold text-ep-ink">{user.email}</dd>
            </div>
          </dl>

          <div className="mt-8 border-t border-ep-line/80 pt-6">
            <ThemeToggle />
          </div>

          <div className="mt-8 flex flex-wrap gap-3 border-t border-ep-line/80 pt-6">
            <Link
              to="/forgot-password"
              className="inline-flex items-center justify-center rounded-full border border-ep-line bg-ep-surface-panel px-5 py-2.5 text-sm font-bold text-ep-ink shadow-inner transition hover:bg-ep-surface-muted"
            >
              Change password
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center justify-center rounded-full bg-ep-ink px-5 py-2.5 text-sm font-bold text-ep-surface-panel transition hover:opacity-90"
            >
              Sign out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
