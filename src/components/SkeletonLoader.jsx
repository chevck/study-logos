export default function SkeletonLoader({ ariaLabel = 'Loading' }) {
  const bar = (w) => (
    <div className={`h-4 animate-pulse rounded-lg bg-gray-200 ${w}`} aria-hidden />
  );

  return (
    <div
      className='space-y-5 rounded-2xl border border-ep-line/85 bg-white/70 p-5 shadow-inner backdrop-blur-sm'
      role="status"
      aria-label={ariaLabel}
    >
      <div className="space-y-2">
        {bar('w-3/5')}
        {bar('w-full')}
        {bar('w-4/5')}
      </div>
      <div className='space-y-2 rounded-xl border border-ep-line/70 bg-white/90 p-4 shadow-inner'>
        {bar('w-2/5')}
        {bar('w-full')}
        {bar('w-full')}
      </div>
      <div className="flex flex-wrap gap-2">
        {bar('w-20')}
        {bar('w-24')}
        {bar('w-28')}
      </div>
    </div>
  );
}
