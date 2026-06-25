const ICONS = {
  light: '/icons/icon-light.png',
  dark: '/icons/icon-dark.png',
  gold: '/icons/icon-gold.png',
};

/**
 * Study Logos app mark. `auto` picks light/dark from the active theme.
 */
export default function AppIcon({
  variant = 'auto',
  className = 'h-9 w-9 shrink-0',
  alt = '',
}) {
  if (variant === 'gold') {
    return <img src={ICONS.gold} alt={alt} className={className} decoding="async" />;
  }
  if (variant === 'light') {
    return <img src={ICONS.light} alt={alt} className={className} decoding="async" />;
  }
  if (variant === 'dark') {
    return <img src={ICONS.dark} alt={alt} className={className} decoding="async" />;
  }

  return (
    <>
      <img
        src={ICONS.light}
        alt={alt}
        className={`${className} dark:hidden`}
        decoding="async"
      />
      <img
        src={ICONS.dark}
        alt={alt}
        className={`${className} hidden dark:block`}
        decoding="async"
      />
    </>
  );
}
