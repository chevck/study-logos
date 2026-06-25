export default function BetaBadge({
  label = 'Beta',
  title = 'Study Logos is currently in beta testing',
}) {
  return (
    <span
      title={title}
      className="inline-flex shrink-0 items-center rounded-full border border-ep-accent/40 bg-ep-accent-soft px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-ep-ink/85 sm:px-2.5 sm:text-[11px]"
    >
      {label}
    </span>
  );
}
