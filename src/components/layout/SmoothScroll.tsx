"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type ScrollApi = {
  lenis: Lenis | null;
  scrollTo: (target: number | string | HTMLElement, opts?: { offset?: number; immediate?: boolean }) => void;
  stop: () => void;
  start: () => void;
};

const ScrollContext = createContext<ScrollApi>({
  lenis: null,
  scrollTo: (t) => {
    if (typeof t === "number") window.scrollTo({ top: t });
  },
  stop: () => {},
  start: () => {},
});

export const useSmoothScroll = () => useContext(ScrollContext);

/**
 * Lenis smooth scrolling synced with GSAP ScrollTrigger.
 * Disabled entirely for users who prefer reduced motion (native scrolling).
 * Lenis never hijacks scroll: it only interpolates native wheel input.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const rafRef = useRef<((time: number) => void) | null>(null);

  useEffect(() => {
    document.documentElement.dataset.motionReady = "1";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const instance = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), anchors: true });
    instance.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => instance.raf(time * 1000);
    rafRef.current = raf;
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);

    return () => {
      gsap.ticker.remove(raf);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  const api: ScrollApi = {
    lenis,
    scrollTo: (target, opts = {}) => {
      if (lenis) {
        lenis.scrollTo(target, { offset: opts.offset ?? 0, immediate: opts.immediate, duration: 1.6 });
        return;
      }
      const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
      const top =
        typeof el === "number" ? el : el instanceof HTMLElement ? el.getBoundingClientRect().top + window.scrollY : 0;
      window.scrollTo({ top: top + (opts.offset ?? 0), behavior: opts.immediate ? "auto" : "smooth" });
    },
    stop: () => lenis?.stop(),
    start: () => lenis?.start(),
  };

  return <ScrollContext.Provider value={api}>{children}</ScrollContext.Provider>;
}
