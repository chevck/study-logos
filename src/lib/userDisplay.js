export function firstNameFromFullName(fullName) {
  const parts = String(fullName ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return parts[0] ?? null;
}

export function initialsFromName(fullName) {
  const parts = String(fullName ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function avatarColorFromName(fullName) {
  const palette = [
    "bg-amber-200 text-amber-950 dark:bg-amber-800 dark:text-amber-100",
    "bg-orange-200 text-orange-950 dark:bg-orange-800 dark:text-orange-100",
    "bg-emerald-200 text-emerald-950 dark:bg-emerald-800 dark:text-emerald-100",
    "bg-sky-200 text-sky-950 dark:bg-sky-800 dark:text-sky-100",
    "bg-violet-200 text-violet-950 dark:bg-violet-800 dark:text-violet-100",
    "bg-rose-200 text-rose-950 dark:bg-rose-800 dark:text-rose-100",
  ];
  let hash = 0;
  const name = String(fullName ?? "");
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
}
