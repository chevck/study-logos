import { appCopy } from '../lib/types.js';

export default function NotebookDrawer({ open, entries, onClose, onRemove, studyLanguage = 'eng' }) {
  if (!open) return null;

  const t = appCopy(studyLanguage);

  return (
    <div className="fixed inset-0 z-50 font-sans">
      <button
        type="button"
        className="absolute inset-0 bg-gray-900/40"
        aria-label={t.notebookAriaBackdrop}
        onClick={onClose}
      />
      <aside
        className="absolute right-0 top-0 flex h-[100dvh] max-h-screen w-full max-w-md flex-col border-l border-ep-line bg-white shadow-card-lg sm:max-w-sm"
        role="dialog"
        aria-labelledby="notebook-title"
      >
        <div className="flex items-center justify-between gap-3 border-b border-ep-line px-4 py-4 sm:px-6 sm:py-5">
          <h2 id="notebook-title" className="text-lg font-extrabold text-ep-ink">
            {t.notebookTitle}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            {t.notebookClose}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5">
          {entries.length === 0 ? (
            <p className="rounded-xl border border-dashed border-gray-300 bg-slate-50 px-4 py-8 text-center text-sm font-semibold leading-relaxed text-gray-600">
              {t.notebookEmpty}
            </p>
          ) : (
            <ul className="space-y-4">
              {entries.map((e) => (
                <li
                  key={e.id}
                  className="rounded-xl border border-ep-line bg-white p-4 shadow-card"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-extrabold text-ep-blue">{e.word}</p>
                      <p className="text-xs font-bold text-gray-600">{e.reference}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemove(e.id)}
                      className="shrink-0 rounded-lg border border-gray-300 px-2 py-1 text-xs font-bold text-gray-600 transition hover:bg-gray-50"
                    >
                      {t.notebookRemove}
                    </button>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-ep-ink">{e.original}</p>
                  <p className="text-xs font-semibold italic text-gray-700">{e.transliteration}</p>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-gray-800">{e.definition}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}
