"use client";

import { useEffect, useRef } from "react";
import type { HomeContent } from "@/types/content";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { whenIntroDone } from "@/components/animations/RevealText";
import { Picture } from "@/components/ui/Picture";
import { ButtonLink } from "@/components/ui/Button";
import { Timecode } from "./Timecode";

export function Hero({ home }: { home: HomeContent }) {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  /* Choose the right rendition and only autoplay when appropriate */
  useEffect(() => {
    const v = video.current;
    if (!v || home.heroVideo.kind !== "file") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (reduce || conn?.saveData || /(^|-)2g$/.test(conn?.effectiveType ?? "")) return;

    const small = window.matchMedia("(max-width: 767px)").matches;
    v.src = small && home.heroVideo.mobileSrc ? home.heroVideo.mobileSrc : home.heroVideo.src;
    const onReady = () => v.classList.remove("opacity-0");
    v.addEventListener("playing", onReady, { once: true });
    v.play().catch(() => {
      /* autoplay blocked — poster remains */
    });

    // pause when off-screen to save battery
    const io = new IntersectionObserver(([e]) => (e?.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.05 });
    io.observe(v);
    return () => io.disconnect();
  }, [home.heroVideo]);

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        // y: 0 discards the px offset GSAP would otherwise read from the CSS pre-reveal transform
        gsap.set(q("[data-hero-word]"), { y: 0, yPercent: 118 });
        gsap.set(q("[data-hero-fade]"), { autoAlpha: 0, y: 18 });
        gsap.set(q("[data-hero-media]"), { scale: 1.18 });
        gsap.set(q("[data-hero-rule]"), { scaleX: 0 });

        const intro = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
        intro
          .to(q("[data-hero-media]"), { scale: 1, duration: 2.8, ease: "expo.out" }, 0)
          .to(q("[data-hero-word]"), { yPercent: 0, duration: 1.5, stagger: 0.07 }, 0.15)
          .to(q("[data-hero-rule]"), { scaleX: 1, duration: 1.6, ease: "expo.inOut" }, 0.5)
          .to(q("[data-hero-fade]"), { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.08 }, 0.9);
        whenIntroDone(() => intro.play());

        // Scroll: the shot pushes in, letterbox bars retract, titles drift away
        const scroll = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });
        scroll
          .to(q("[data-hero-zoom]"), { scale: 1.12, yPercent: 8, ease: "none" }, 0)
          .to(q("[data-hero-content]"), { yPercent: -18, autoAlpha: 0, ease: "none" }, 0)
          .to(q("[data-letterbox]"), { scaleY: 0, ease: "none" }, 0)
          .to(q("[data-hero-dim]"), { opacity: 0.85, ease: "none" }, 0);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const lines = home.heroHeadingLines;

  return (
    <section
      ref={root}
      data-section="Opening scene"
      aria-labelledby="hero-title"
      className="relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-ink"
    >
      {/* ── Media ── */}
      <div data-hero-zoom className="absolute inset-0 will-change-transform">
        <div data-hero-media className="absolute inset-0 will-change-transform" data-hero-poster>
          <Picture image={home.heroPoster} sizes="100vw" preload quality={75} />
          {home.heroVideo.kind === "file" && (
            <video
              ref={video}
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-[1500ms]"
              muted
              loop
              playsInline
              preload="none"
              aria-hidden
              tabIndex={-1}
              disablePictureInPicture
            />
          )}
        </div>
      </div>

      {/* ── Grade & contrast ── */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_40%,transparent_30%,rgb(8_8_8/0.7)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/40" />
      <div data-hero-dim className="pointer-events-none absolute inset-0 bg-ink opacity-0" />

      {/* ── Letterbox (2.39:1 feel) ── */}
      <div data-letterbox aria-hidden className="absolute inset-x-0 top-0 h-[7vh] origin-top bg-ink max-md:hidden" />
      <div data-letterbox aria-hidden className="absolute inset-x-0 bottom-0 h-[7vh] origin-bottom bg-ink max-md:hidden" />

      {/* ── Titles ── */}
      <div data-hero-content className="shell relative flex h-full flex-col justify-end pb-[max(2rem,6vh)] pt-[calc(var(--header-h)+2rem)]">
        <div data-hero-fade className="label mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 md:mb-10">
          <span className="text-paper">SC.01 — Take 01</span>
          <span className="hidden sm:inline">19°59′N 73°47′E · Maharashtra</span>
          <Timecode className="text-gold" />
        </div>

        <h1 id="hero-title" className="display text-[clamp(2.9rem,8.6vw,10.5rem)] uppercase leading-[0.88]">
          {/* real spaces between words keep the heading readable for screen readers and search engines */}
          {lines.map((line, i) => (
            <span key={i} className="block">
              {line.split(" ").map((w, j, arr) => (
                <span key={j}>
                  <span className="word-mask">
                    <span data-hero-word className="inline-block">
                      {w}
                    </span>
                  </span>
                  {j < arr.length - 1 ? " " : ""}
                </span>
              ))}{" "}
            </span>
          ))}
          <span className="block text-gold-soft">
            {home.heroAccentLine.split(" ").map((w, j, arr) => (
              <span key={j}>
                <span className="word-mask">
                  <span data-hero-word className="inline-block italic">
                    {w}
                  </span>
                </span>
                {j < arr.length - 1 ? " " : ""}
              </span>
            ))}
          </span>
        </h1>

        <div data-hero-rule className="mt-8 h-px origin-left bg-line-strong md:mt-12" />

        <div className="mt-6 grid items-end gap-8 md:mt-8 md:grid-cols-12">
          <p data-hero-fade className="max-w-md text-lead leading-snug text-paper/85 md:col-span-5">
            {home.heroSupporting}
          </p>
          <div data-hero-fade className="flex flex-wrap gap-3 md:col-span-5 md:col-start-8 md:justify-end">
            <ButtonLink href="/work" variant="solid">
              {home.primaryCtaLabel}
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline">
              {home.secondaryCtaLabel}
            </ButtonLink>
          </div>
        </div>

        <div data-hero-fade className="mt-10 hidden items-center justify-between md:flex">
          <a href="#story" className="label group flex items-center gap-4 text-paper" aria-label="Scroll to the story">
            <span className="relative block h-10 w-px overflow-hidden bg-paper/20">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_2.4s_var(--ease-cine)_infinite] bg-gold" />
            </span>
            Scroll to begin
          </a>
          {home.heroIsSample && <span className="label text-mute-2">Placeholder footage — replace via Studio</span>}
        </div>
      </div>
    </section>
  );
}
