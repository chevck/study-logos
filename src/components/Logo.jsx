import AppIcon from './AppIcon.jsx';
import BetaBadge from './BetaBadge.jsx';

export default function Logo({
  brandWord1 = 'study',
  brandWord2 = 'logos',
  showWordmark = true,
  iconSize = 'md',
  showBeta = true,
  betaLabel = 'Beta',
  betaTitle = 'Study Logos is currently in beta testing',
  inverted = false,
}) {
  const iconSizes = {
    sm: 'h-8 w-8 shrink-0',
    md: 'h-9 w-9 shrink-0 sm:h-10 sm:w-10',
    lg: 'h-11 w-11 shrink-0 sm:h-12 sm:w-12',
  };

  return (
    <div className="flex items-center gap-2.5">
      <AppIcon variant="auto" className={iconSizes[iconSize] ?? iconSizes.md} alt="" />
      {showWordmark ? (
        <div
          className={[
            'flex items-baseline gap-1 font-extrabold tracking-tight',
            inverted ? 'text-white' : 'text-ep-ink',
          ].join(' ')}
        >
          <span className="text-xl lowercase sm:text-2xl">{brandWord1}</span>
          <span className="relative text-xl lowercase sm:text-2xl">
            <span
              className="absolute -top-3 left-[0.2rem] flex gap-px text-[5px] leading-none text-ep-accent sm:left-1 sm:text-[6px]"
              aria-hidden
            >
              <span>●</span>
              <span>●</span>
              <span>●</span>
            </span>
            {brandWord2}
          </span>
        </div>
      ) : null}
      {showBeta ? <BetaBadge label={betaLabel} title={betaTitle} /> : null}
    </div>
  );
}
