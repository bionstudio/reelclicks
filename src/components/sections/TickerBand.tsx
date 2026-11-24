/** A tilted lime band of services scrolling endlessly — the loud accent between sections. */
export function TickerBand({ items }: { items: string[] }) {
  const row = (
    <span className="flex shrink-0 items-center">
      {items.map((t, i) => (
        <span key={i} className="flex items-center">
          <span>{t}</span>
          <svg aria-hidden viewBox="0 0 24 24" className="mx-[0.55em] h-[0.55em] w-[0.55em] fill-current">
            <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
          </svg>
        </span>
      ))}
    </span>
  );

  return (
    <div className="relative z-[1] -my-4 overflow-hidden py-10 md:-my-6 md:py-14" aria-hidden>
      {/* back band (cream, opposite tilt) */}
      <div className="absolute inset-x-[-5%] top-1/2 -translate-y-1/2 rotate-[2deg] bg-paper py-3 text-ink/80 md:py-4">
        <div className="flex whitespace-nowrap">
          <div className="marquee-track is-reverse display flex text-[clamp(1.25rem,2.6vw,2.4rem)] leading-none">
            {row}
            {row}
          </div>
        </div>
      </div>
      {/* front band (lime) */}
      <div className="relative -mx-[5%] -rotate-[2deg] bg-lime py-3 text-ink md:py-4">
        <div className="flex whitespace-nowrap">
          <div className="marquee-track is-fast display flex text-[clamp(1.25rem,2.6vw,2.4rem)] leading-none">
            {row}
            {row}
          </div>
        </div>
      </div>
    </div>
  );
}
