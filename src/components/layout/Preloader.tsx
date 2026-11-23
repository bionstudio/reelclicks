"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const MIN_MS = 900; // long enough to read the wordmark, never artificially longer
const MAX_MS = 3200; // hard cap: the site is never blocked beyond this

/**
 * Cinematic preloader, shown once per browser session.
 * Progress reflects real work (fonts, hero poster, window load); it exits as
 * soon as those are done. An inline script in <head> hides it instantly for
 * returning visitors and acts as a fail-safe if JavaScript fails.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const line = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const el = root.current;
    if (!el || html.dataset.skipIntro === "1") return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const started = performance.now();
    const progress = { value: 0 };
    let target = 8;
    let finished = false;

    const render = () => {
      const v = Math.round(progress.value);
      if (counter.current) counter.current.textContent = String(v).padStart(3, "0");
      if (line.current) line.current.style.transform = `scaleX(${progress.value / 100})`;
    };

    const tasks: Promise<unknown>[] = [
      document.fonts?.ready ?? Promise.resolve(),
      new Promise<void>((res) => (document.readyState === "complete" ? res() : window.addEventListener("load", () => res(), { once: true }))),
      new Promise<void>((res) => {
        const poster = document.querySelector<HTMLImageElement>("[data-hero-poster] img, img[data-hero-poster]");
        if (!poster || poster.complete) return res();
        poster.addEventListener("load", () => res(), { once: true });
        poster.addEventListener("error", () => res(), { once: true });
      }),
    ];
    const step = 92 / tasks.length;
    tasks.forEach((t) => t.then(() => (target = Math.min(100, target + step))));

    const tick = () => {
      progress.value += (target - progress.value) * 0.12;
      render();
    };
    gsap.ticker.add(tick);

    const finish = () => {
      if (finished) return;
      finished = true;
      gsap.ticker.remove(tick);
      const done = () => {
        html.dataset.introDone = "1";
        try {
          sessionStorage.setItem("rc-intro", "1");
        } catch {}
        window.dispatchEvent(new Event("reelclicks:intro-done"));
        el.style.display = "none";
      };
      if (reduce) {
        gsap.to(el, { autoAlpha: 0, duration: 0.3, onComplete: done });
        return;
      }
      const tl = gsap.timeline({ onComplete: done });
      tl.to(progress, { value: 100, duration: 0.35, ease: "power2.out", onUpdate: render })
        .to(el.querySelectorAll("[data-pl-char]"), { yPercent: -110, stagger: 0.025, duration: 0.7, ease: "expo.in" }, "+=0.05")
        .to(el.querySelectorAll("[data-pl-meta]"), { autoAlpha: 0, duration: 0.3 }, "<")
        .to(el.querySelector("[data-pl-top]"), { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, "-=0.15")
        .to(el.querySelector("[data-pl-bottom]"), { yPercent: 100, duration: 1.1, ease: "expo.inOut" }, "<")
        .to(line.current, { scaleX: 0, transformOrigin: "right center", duration: 0.6, ease: "expo.inOut" }, "<")
        // let the hero begin while the shutter is still opening
        .call(() => {
          html.dataset.introDone = "1";
          window.dispatchEvent(new Event("reelclicks:intro-done"));
        }, [], "-=0.75");
    };

    Promise.all(tasks).then(() => {
      const wait = Math.max(0, MIN_MS - (performance.now() - started));
      window.setTimeout(finish, wait);
    });
    const cap = window.setTimeout(finish, MAX_MS);

    // intro char rise
    if (!reduce) {
      gsap.from(el.querySelectorAll("[data-pl-char]"), { yPercent: 110, stagger: 0.04, duration: 1, ease: "expo.out", delay: 0.1 });
    }

    return () => {
      window.clearTimeout(cap);
      gsap.ticker.remove(tick);
    };
  }, []);

  const word = "REELCLICKS".split("");

  return (
    <div ref={root} id="preloader" className="fixed inset-0 z-[100]" role="status" aria-label="Loading REELCLICKS.IN">
      <div data-pl-top className="absolute inset-x-0 top-0 h-1/2 bg-ink" />
      <div data-pl-bottom className="absolute inset-x-0 bottom-0 h-1/2 bg-ink" />

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="display flex overflow-hidden text-[clamp(2.75rem,10vw,8.5rem)] leading-none" aria-hidden>
          {word.map((c, i) => (
            <span key={i} data-pl-char className="inline-block">
              {c}
            </span>
          ))}
          <span data-pl-char className="ml-1 inline-block font-mono text-[0.25em] tracking-widest text-gold">
            .IN
          </span>
        </p>
      </div>

      <div className="shell absolute inset-x-0 top-[calc(50%+clamp(3.25rem,7vw,6.5rem))]">
        <div className="relative mx-auto h-px max-w-xl bg-line">
          <div ref={line} className="absolute inset-0 origin-left scale-x-0 bg-gold" />
        </div>
        <div data-pl-meta className="label mx-auto mt-4 flex max-w-xl justify-between">
          <span>Every frame has a story</span>
          <span>
            <span ref={counter}>000</span>
            <span className="text-mute-2">/100</span>
          </span>
        </div>
      </div>
    </div>
  );
}
