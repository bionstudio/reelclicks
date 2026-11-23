"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * Fixed desktop "frame counter" that tracks which story section is on screen.
 * Sections opt in with  data-section="Title"  attributes.
 */
export function SectionIndicator() {
  const pathname = usePathname();
  const [current, setCurrent] = useState<{ index: number; title: string; total: number } | null>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
    if (sections.length < 2) {
      setCurrent(null);
      return;
    }
    const triggers = sections.map((el, i) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => {
          if (self.isActive) setCurrent({ index: i + 1, title: el.dataset.section || "", total: sections.length });
        },
      }),
    );
    const progress = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        if (bar.current) bar.current.style.transform = `scaleY(${self.progress})`;
      },
    });
    return () => {
      triggers.forEach((t) => t.kill());
      progress.kill();
    };
  }, [pathname]);

  if (!current) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-4 mix-blend-difference xl:flex"
    >
      <span className="label text-paper tabular-nums">{String(current.index).padStart(2, "0")}</span>
      <span className="relative block h-20 w-px bg-paper/20">
        <span ref={bar} className="absolute inset-0 origin-top scale-y-0 bg-paper" />
      </span>
      <span className="label text-paper/40 tabular-nums">{String(current.total).padStart(2, "0")}</span>
      <span key={current.title} className="label mt-2 max-h-[12rem] truncate text-paper/70 [writing-mode:vertical-rl] animate-[fadein_.6s_ease]">
        {current.title}
      </span>
    </div>
  );
}
