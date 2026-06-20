export default function Logo({ brandWord1 = "study", brandWord2 = "logos" }) {
  return (
    <div className="flex items-baseline gap-1 font-extrabold tracking-tight text-ep-ink">
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
  );
}
