"use client";

import { useRef, type ElementType, type ReactNode, type CSSProperties } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils/cn";

/* ───────────── Image reveal mask: a curtain lifts while the image settles ───────────── */
export function RevealMask({
  children,
  className,
  direction = "up",
  parallax = 0,
  delay = 0,
  style,
}: {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  /** Additional scroll parallax on the inner media in percent (0 = none). */
  parallax?: number;
  delay?: number;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = ref.current!;
      const inner = el.querySelector<HTMLElement>("[data-mask-inner]");
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const from = {
          up: "inset(100% 0% 0% 0%)",
          down: "inset(0% 0% 100% 0%)",
          left: "inset(0% 0% 0% 100%)",
          right: "inset(0% 100% 0% 0%)",
        }[direction];
        gsap.fromTo(
          el,
          { clipPath: from },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.6,
            ease: "expo.inOut",
            delay,
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          },
        );
        if (inner) {
          gsap.fromTo(inner, { scale: 1.25 }, {
            scale: 1,
            duration: 2.2,
            ease: "expo.out",
            delay,
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          });
          if (parallax) {
            gsap.fromTo(
              inner.firstElementChild ?? inner,
              { yPercent: -parallax },
              {
                yPercent: parallax,
                ease: "none",
                scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
              },
            );
          }
        }
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)} style={style}>
      <div data-mask-inner className="absolute inset-0 will-change-transform">
        <div className={cn("absolute inset-0", parallax ? "-top-[12%] -bottom-[12%]" : "")}>{children}</div>
      </div>
    </div>
  );
}

/* ───────────── Fade-up for small UI groups ───────────── */
export function FadeIn({
  as: Tag = "div",
  children,
  className,
  delay = 0,
  y = 28,
  stagger = 0,
  selector,
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  stagger?: number;
  /** Animate matching children instead of the wrapper (for staggered lists). */
  selector?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const el = ref.current!;
      const targets = selector ? el.querySelectorAll(selector) : el;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          targets,
          { autoAlpha: 0, y },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.2,
            delay,
            stagger,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/* ───────────── Subtle scroll parallax ───────────── */
export function Parallax({
  children,
  className,
  speed = 10,
}: {
  children: ReactNode;
  className?: string;
  /** Distance in percent of the element's height travelled across the viewport. */
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and (min-width: 768px)`, () => {
        gsap.fromTo(
          ref.current,
          { yPercent: speed / 2 },
          {
            yPercent: -speed / 2,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}

/* ───────────── Words light up as you read (scroll-scrubbed) ───────────── */
export function ScrubWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useGSAP(
    () => {
      const words = ref.current!.querySelectorAll<HTMLElement>("[data-w]");
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          words,
          { opacity: 0.16 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.08,
            scrollTrigger: { trigger: ref.current, start: "top 82%", end: "bottom 45%", scrub: 0.6 },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  const words = text.split(/\s+/);
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i} data-w className="inline-block">
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
