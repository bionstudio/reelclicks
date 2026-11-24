import type { SVGProps } from "react";

export function InstagramIcon({ size = 18, ...p }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden {...p}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function WhatsAppIcon({ size = 18, ...p }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden {...p}>
      <path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.4-4.3a8.5 8.5 0 1 1 15.6-4.5Z" strokeLinejoin="round" />
      <path
        d="M9.2 8.4c.2-.4.5-.4.7-.4h.5c.2 0 .4 0 .5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c-.1.1-.2.3 0 .5.3.6.8 1.2 1.3 1.6.6.5 1.2.8 1.6 1 .2.1.4 0 .5-.1l.6-.7c.2-.2.3-.2.6-.1l1.5.7c.3.1.4.3.4.4 0 .5-.2 1.1-.6 1.4-.5.4-1.2.6-1.9.5-1.2-.2-2.6-.9-3.8-2-1.2-1.1-2-2.5-2.3-3.6-.2-.8 0-1.6.3-2.2Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

/** REELCLICKS.IN wordmark — typographic, so it scales crisply at any size. */
export function Wordmark({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={className} aria-label="REELCLICKS.IN">
      <span aria-hidden className="inline-flex items-center gap-[0.3em] font-display font-[800] tracking-[-0.05em]">
        <span className="relative inline-flex h-[0.95em] w-[0.95em] items-center justify-center rounded-full bg-lime">
          <span className="ml-[0.08em] h-0 w-0 border-y-[0.2em] border-l-[0.32em] border-y-transparent border-l-ink" />
        </span>
        <span>
          {compact ? "RC" : "reelclicks"}
          <span className="text-lime">.in</span>
        </span>
      </span>
    </span>
  );
}
