import { useEffect } from 'react';

export default function Toast({ message, onDismiss }) {
  useEffect(() => {
    if (!message) return undefined;
    const t = setTimeout(() => onDismiss?.(), 2000);
    return () => clearTimeout(t);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 z-[60] w-[calc(100vw-1.5rem)] max-w-md -translate-x-1/2 px-3 sm:bottom-8 sm:w-auto sm:max-w-lg sm:px-0"
      role="status"
      aria-live="polite"
    >
      <div className='rounded-[1.5rem] border border-ep-line/85 bg-white/95 px-5 py-3 text-center font-sans text-sm font-bold leading-snug text-ep-ink shadow-card backdrop-blur-md'>
        {message}
      </div>
    </div>
  );
}
