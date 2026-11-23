"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

/** The footer rises out of the dark as the page ends — like closing credits. */
export function FooterReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const footer = ref.current!.firstElementChild as HTMLElement;
        gsap.fromTo(
          footer,
          { yPercent: -18 },
          { yPercent: 0, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "top 35%", scrub: true } },
        );
        const headline = ref.current!.querySelector("[data-footer-headline]");
        if (headline) {
          gsap.fromTo(
            headline,
            { opacity: 0.15, letterSpacing: "0.02em" },
            {
              opacity: 1,
              letterSpacing: "-0.02em",
              ease: "none",
              scrollTrigger: { trigger: ref.current, start: "top 85%", end: "top 25%", scrub: true },
            },
          );
        }
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className="relative z-0 overflow-hidden">
      {children}
    </div>
  );
}
