import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { avatarColorFromName, initialsFromName } from "../lib/userDisplay.js";

export default function UserAvatarMenu({ user, onSignOut, notebookCount = 0 }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e) {
      if (!rootRef.current?.contains(e.target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (!user) return null;

  const initials = initialsFromName(user.fullName);
  const colorClass = avatarColorFromName(user.fullName);

  return (
    <div ref={rootRef} className="relative ml-auto shrink-0">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className={`relative flex h-10 w-10 items-center justify-center rounded-full text-sm font-extrabold shadow-soft ring-2 ring-ep-surface-panel transition hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ep-accent/35 ${colorClass}`}
        title={user.fullName}
      >
        {initials}
        {notebookCount > 0 ? (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-ep-accent px-1 text-[10px] font-extrabold text-ep-accent-foreground shadow-card ring-2 ring-ep-surface-panel">
            {notebookCount > 9 ? "9+" : notebookCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-64 overflow-hidden rounded-2xl border border-ep-line/90 bg-ep-surface-panel/98 p-1.5 shadow-card-lg backdrop-blur-xl"
        >
          <div className="border-b border-ep-line/80 px-3 py-3">
            <p className="truncate text-sm font-extrabold text-ep-ink">{user.fullName}</p>
            <p className="mt-0.5 truncate text-xs font-medium text-ep-muted">{user.email}</p>
          </div>

          <Link
            to="/account"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="mt-1 flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-semibold text-ep-ink transition hover:bg-ep-accent-soft"
          >
            Account settings
          </Link>

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onSignOut?.();
            }}
            className="flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-ep-muted transition hover:bg-ep-danger-soft hover:text-ep-danger-text"
          >
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}
