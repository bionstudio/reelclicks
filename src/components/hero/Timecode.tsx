"use client";

import { useEffect, useRef } from "react";

/** A running SMPTE-style timecode (HH:MM:SS:FF @ 25fps) — the film is rolling. */
export function Timecode({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = performance.now();
    let raf = 0;
    let last = "";
    const p = (n: number) => String(n).padStart(2, "0");
    const loop = (now: number) => {
      const t = (now - start) / 1000;
      const s = Math.floor(t);
      const tc = `${p(Math.floor(s / 3600))}:${p(Math.floor(s / 60) % 60)}:${p(s % 60)}:${p(Math.floor((t % 1) * 25))}`;
      if (tc !== last && ref.current) {
        ref.current.textContent = tc;
        last = tc;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <span className={className} aria-hidden>
      <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#d4543f] align-middle" />
      REC <span ref={ref}>00:00:00:00</span>
    </span>
  );
}
