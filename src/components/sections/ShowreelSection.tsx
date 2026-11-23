"use client";

import { useRef } from "react";
import type { Showreel } from "@/types/content";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText } from "@/components/animations/RevealText";
import { VideoPlayer } from "@/components/portfolio/VideoPlayer";

export function ShowreelSection({ reel }: { reel: Showreel }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and (min-width: 768px)`, () => {
        // The frame opens from a letterboxed crop to full width as it enters
        gsap.fromTo(
          "[data-reel-frame]",
          { clipPath: "inset(10% 12% 10% 12%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: { trigger: "[data-reel-frame]", start: "top 95%", end: "top 20%", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} data-section="Showreel" aria-labelledby="reel-title" className="relative py-24 md:py-36">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <SectionLabel index="003" title="Showreel" />
            <RevealText as="h2" id="reel-title" split="lines" className="display mt-10 text-huge uppercase">
              The art of
              <br />
              <em className="text-gold-soft">seeing</em> differently.
            </RevealText>
          </div>
          <dl className="label grid grid-cols-3 gap-x-8 gap-y-1 text-left md:text-right">
            <dt>Title</dt>
            <dt>Year</dt>
            <dt>Runtime</dt>
            <dd className="text-paper">{reel.title}</dd>
            <dd className="text-paper">{reel.year}</dd>
            <dd className="text-paper">{reel.duration ?? "—"}</dd>
          </dl>
        </div>

        <div data-reel-frame className="relative mt-14 md:mt-20">
          <VideoPlayer video={reel.video} poster={reel.poster} title={`REELCLICKS.IN ${reel.title} ${reel.year}`} playLabel="Play showreel" />
          {reel.isSample && (
            <span className="sample-badge pointer-events-none absolute right-4 top-4 z-20">Placeholder reel</span>
          )}
        </div>
      </div>
    </section>
  );
}
