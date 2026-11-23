"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, MOTION_OK, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils/cn";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** "lines" for paragraphs/headings, "words" for punchier staggers, "chars" for wordmarks. */
  split?: "lines" | "words" | "chars";
  delay?: number;
  stagger?: number;
  duration?: number;
  /** "scroll" waits for the element to enter the viewport; "intro" waits for the preloader. */
  trigger?: "scroll" | "intro";
  start?: string;
  id?: string;
};

/**
 * Masked typographic reveal built on GSAP SplitText.
 * The text stays fully readable for screen readers and when motion is reduced.
 */
export function RevealText({
  as: Tag = "div",
  children,
  className,
  split = "lines",
  delay = 0,
  stagger,
  duration = 1.25,
  trigger = "scroll",
  start = "top 88%",
  id,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        let tween: gsap.core.Tween | undefined;
        const st = SplitText.create(el, {
          type: split === "lines" ? "lines" : split === "words" ? "words,lines" : "chars,words",
          mask: split === "lines" ? "lines" : split === "words" ? "words" : "chars",
          autoSplit: true,
          aria: "auto",
          onSplit(self) {
            tween?.kill();
            const targets = split === "lines" ? self.lines : split === "words" ? self.words : self.chars;
            gsap.set(el, { visibility: "visible" });
            tween = gsap.from(targets, {
              yPercent: 115,
              duration,
              ease: "expo.out",
              stagger: stagger ?? (split === "chars" ? 0.03 : split === "words" ? 0.06 : 0.1),
              delay,
              paused: true,
            });
            if (trigger === "scroll") {
              ScrollTrigger.create({ trigger: el, start, once: true, onEnter: () => tween?.play() });
            } else {
              whenIntroDone(() => tween?.play());
            }
            return tween;
          },
        });
        return () => st.revert();
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={cn("[.js-motion_&]:invisible", className)}>
      {children}
    </Tag>
  );
}

/** Runs `fn` once the cinematic preloader has finished (or immediately if it was skipped). */
export function whenIntroDone(fn: () => void) {
  if (typeof window === "undefined") return;
  if (document.documentElement.dataset.introDone === "1") {
    fn();
    return;
  }
  window.addEventListener("reelclicks:intro-done", () => fn(), { once: true });
}
