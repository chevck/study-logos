import AppIcon from './AppIcon.jsx';
import { useInstallPrompt } from '../hooks/useInstallPrompt.js';
import { dismissHomeScreenPrompt, isIosSafariLike } from '../lib/homeScreen.js';
import { primaryBtn } from '../lib/uiClasses.js';

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" className="inline h-5 w-5 align-[-0.125em]" aria-hidden>
      <path
        fill="currentColor"
        d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11A2.99 2.99 0 1 0 15 5a2.99 2.99 0 0 0 .05.49L8 9.6A3 3 0 1 0 8 14.4l7.05 4.11c.01.16.05.32.05.49a3 3 0 1 0 3-3h-.1z"
      />
    </svg>
  );
}

export default function AddToHomeScreenPrompt({ open, copy, onClose }) {
  const { canNativeInstall, promptNativeInstall } = useInstallPrompt();
  const ios = isIosSafariLike();

  if (!open) return null;

  const handleDismiss = () => {
    dismissHomeScreenPrompt();
    onClose();
  };

  const handleInstall = async () => {
    const outcome = await promptNativeInstall();
    if (outcome === 'accepted') {
      dismissHomeScreenPrompt();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-ep-ink/40 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-[2px] sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="a2hs-title"
    >
      <div className="w-full max-w-md overflow-hidden rounded-[1.75rem] border border-ep-line/90 bg-ep-surface-panel shadow-card-lg">
        <div className="border-b border-ep-line/80 px-5 py-4 sm:px-6">
          <div className="mb-4 flex justify-center">
            <AppIcon variant="gold" className="h-16 w-16 shadow-soft" alt="" />
          </div>
          <p id="a2hs-title" className="font-sans text-lg font-extrabold tracking-tight text-ep-ink">
            {copy.addToHomeTitle}
          </p>
          <p className="mt-2 text-sm font-medium leading-relaxed text-ep-subtle">
            {copy.addToHomeBody}
          </p>
        </div>

        <div className="space-y-3 px-5 py-4 sm:px-6">
          {ios ? (
            <ol className="list-decimal space-y-2 pl-5 text-sm font-medium leading-relaxed text-ep-ink">
              <li>
                {copy.addToHomeIosStep1}{' '}
                <ShareIcon />
              </li>
              <li>{copy.addToHomeIosStep2}</li>
            </ol>
          ) : canNativeInstall ? (
            <button type="button" onClick={handleInstall} className={primaryBtn}>
              {copy.addToHomeAndroidInstall}
            </button>
          ) : (
            <p className="text-sm font-medium leading-relaxed text-ep-ink">
              {copy.addToHomeAndroidManual}
            </p>
          )}
        </div>

        <div className="border-t border-ep-line/80 px-5 py-3 sm:px-6">
          <button
            type="button"
            onClick={handleDismiss}
            className="w-full rounded-2xl px-4 py-3 text-sm font-bold text-ep-muted transition hover:bg-ep-surface-muted hover:text-ep-ink"
          >
            {copy.addToHomeNotNow}
          </button>
        </div>
      </div>
    </div>
  );
}
