import { useTheme } from "../context/ThemeContext.jsx";

const OPTIONS = [
  ["system", "System"],
  ["light", "Light"],
  ["dark", "Dark"],
];

export default function ThemePicker({
  compact = false,
  className = "",
  disabled = false,
  onChange,
}) {
  const { theme, setTheme } = useTheme();

  const handleSelect = async (value) => {
    if (disabled || value === theme) return;
    if (onChange) {
      await onChange(value);
    } else {
      await setTheme(value);
    }
  };

  return (
    <div
      className={[
        "inline-flex rounded-full border border-ep-line/90 bg-ep-surface-muted p-1 shadow-inner",
        compact ? "scale-90 origin-right" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="group"
      aria-label="Theme"
    >
      {OPTIONS.map(([value, label]) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            disabled={disabled}
            aria-pressed={active}
            onClick={() => handleSelect(value)}
            className={
              active
                ? "rounded-full bg-ep-accent px-3 py-1.5 text-[11px] font-bold text-ep-accent-foreground shadow-soft transition sm:px-4 sm:py-2 sm:text-xs"
                : "rounded-full px-3 py-1.5 text-[11px] font-semibold text-ep-muted transition hover:text-ep-ink disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:py-2 sm:text-xs"
            }
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
