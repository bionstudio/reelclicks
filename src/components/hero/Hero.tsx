"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { HomeContent, Project } from "@/types/content";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { whenIntroDone } from "@/components/animations/RevealText";
import { Picture } from "@/components/ui/Picture";
import { ButtonLink } from "@/components/ui/Button";
import { Timecode } from "./Timecode";
import { cn } from "@/lib/utils/cn";

export function Hero({ home, reels = [] }: { home: HomeContent; reels?: Project[] }) {
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
        gsap.set(q("[data-hero-card]"), { clipPath: "inset(18% 6% 0% 6% round 2rem)" });
        gsap.set(q("[data-hero-media]"), { scale: 1.25 });
        gsap.set(q("[data-hero-sticker]"), { scale: 0, rotate: -90 });
        gsap.set(q("[data-hero-reel]"), { y: 0, yPercent: 40, autoAlpha: 0 });

        const intro = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
        intro
          .to(q("[data-hero-word]"), { yPercent: 0, duration: 1.3, stagger: 0.06 }, 0.05)
          .to(q("[data-hero-card]"), { clipPath: "inset(0% 0% 0% 0% round 2rem)", duration: 1.8, ease: "expo.inOut" }, 0.2)
          .to(q("[data-hero-media]"), { scale: 1, duration: 2.4 }, 0.2)
          .to(q("[data-hero-fade]"), { autoAlpha: 1, y: 0, duration: 1, stagger: 0.07 }, 0.6)
          .to(q("[data-hero-reel]"), { yPercent: 0, autoAlpha: 1, duration: 1.4, stagger: 0.1 }, 0.35)
          .to(q("[data-hero-sticker]"), { scale: 1, rotate: 0, duration: 1.4, ease: "back.out(1.6)" }, 1.1);
        whenIntroDone(() => intro.play());

        // Scroll: the shot drifts inside its frame and the titles lift away
        const scroll = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });
        scroll
          .to(q("[data-hero-zoom]"), { yPercent: 12, scale: 1.08, ease: "none" }, 0)
          .to(q("[data-hero-content]"), { yPercent: -12, autoAlpha: 0.2, ease: "none" }, 0);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const lines = home.heroHeadingLines;
  const word = (w: string) => (
    <span className="word-mask">
      <span data-hero-word className="inline-block">
        {w}
      </span>
    </span>
  );

  return (
    <section
      ref={root}
      data-section="Intro"
      aria-labelledby="hero-title"
      className="relative w-full overflow-hidden bg-ink pb-6 pt-[calc(var(--header-h)+1.5rem)] md:pb-10 md:pt-[calc(var(--header-h)+2.5rem)]"
    >
      {/* soft lime glow behind the headline */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[38rem] w-[70rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(215_255_58/0.13),transparent)]"
      />

      <div data-hero-content className="shell relative">
        {/* ── tags ── */}
        <div data-hero-fade className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip border-lime/40 bg-lime/10 font-mono text-[0.75rem] text-lime">
              <Timecode />
            </span>
            {["Weddings", "Reels", "Brand films"].map((t) => (
              <span key={t} className="chip hidden text-paper/80 sm:inline-flex">
                {t}
              </span>
            ))}
          </div>
          <span className="label hidden md:block">Maharashtra, India</span>
        </div>

        {/* ── reel stack (desktop) ── */}
        {reels.length > 0 && (
          <div aria-hidden className="pointer-events-none absolute right-[calc(var(--gutter)+3rem)] top-20 hidden h-[22rem] w-[27rem] xl:block 2xl:h-[25rem] 2xl:w-[31rem]">
            {reels.slice(0, 3).map((p, i) => (
              <div
                key={p.id}
                data-hero-reel
                className="absolute top-0 w-[10.5rem] 2xl:w-[13rem]"
                style={{ left: `${i * 30}%`, zIndex: i === 1 ? 3 : 1, translate: `0 ${i === 1 ? -0.5 : 2.5}rem` }}
              >
                <div
                  className={cn(
                    "card relative aspect-[9/16] border border-paper/10 bg-ink-2 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)]",
                    i === 0 && "-rotate-[8deg]",
                    i === 2 && "rotate-[8deg]",
                  )}
                >
                  <Picture image={p.cover} sizes="208px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                  <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-lime">
                    <span className="ml-0.5 h-0 w-0 border-y-[5px] border-l-[8px] border-y-transparent border-l-ink" />
                  </span>
                  <span className="absolute inset-x-3 bottom-3 text-[0.8rem] font-bold leading-tight text-paper">
                    {p.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── headline ── */}
        <h1 id="hero-title" className="display relative mt-8 text-[13vw] leading-[0.88] md:mt-10 md:text-[clamp(3rem,9.2vw,10.5rem)]">
          {/* real spaces between words keep the heading readable for screen readers and search engines */}
          {lines.map((line, i) => (
            <span key={i} className="block">
              {line.split(" ").map((w, j, arr) => (
                <span key={j}>
                  {word(w)}
                  {j < arr.length - 1 ? " " : ""}
                </span>
              ))}{" "}
            </span>
          ))}
          <span className="block">
            <span className="word-mask">
              <span data-hero-word className="mark inline-block px-[0.14em] pb-[0.04em]">
                {home.heroAccentLine}
              </span>
            </span>
          </span>
        </h1>

        {/* ── supporting row ── */}
        <div className="mt-8 grid items-end gap-6 md:mt-12 md:grid-cols-12">
          <p data-hero-fade className="max-w-md text-lead leading-snug text-paper/75 md:col-span-5">
            {home.heroSupporting}
          </p>
          <div data-hero-fade className="flex flex-wrap gap-3 md:col-span-6 md:col-start-7 md:justify-end">
            <ButtonLink href="/work" variant="lime">
              {home.primaryCtaLabel}
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline">
              {home.secondaryCtaLabel}
            </ButtonLink>
          </div>
        </div>
      </div>

      {/* ── Media card ── */}
      <div className="shell relative mt-10 md:mt-14">
        <div
          data-hero-card
          className="card relative aspect-[4/5] w-full bg-ink-2 sm:aspect-[16/10] md:aspect-[21/9] md:max-h-[78vh]"
        >
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
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/10" />

          {home.heroIsSample && <span className="sample-badge absolute right-5 top-5 md:right-8 md:top-8">Placeholder footage</span>}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-8">
            <a
              href="#story"
              className="chip border-paper/25 bg-ink/40 backdrop-blur-md transition-colors hover:bg-paper hover:text-ink"
              aria-label="Scroll to the story"
            >
              <span className="relative block h-4 w-[2px] overflow-hidden rounded bg-paper/25">
                <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_2.4s_var(--ease-cine)_infinite] bg-lime" />
              </span>
              Scroll
            </a>
          </div>
        </div>

        {/* rotating sticker */}
        <Link
          href="/contact"
          data-hero-sticker
          aria-label="Book a shoot"
          className="absolute bottom-5 right-[calc(var(--gutter)+1.25rem)] h-24 w-24 md:bottom-8 md:right-[calc(var(--gutter)+2rem)] md:h-32 md:w-32"
        >
          <div className="relative h-full w-full rounded-full bg-lime text-ink transition-transform duration-500 hover:scale-110 shadow-[0_20px_60px_-20px_rgb(215_255_58/0.6)]">
            <svg aria-hidden viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-[spin_14s_linear_infinite]">
              <defs>
                <path id="hero-circle" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
              </defs>
              <text className="fill-ink font-sans text-[10.5px] font-extrabold uppercase tracking-[0.18em]">
                <textPath href="#hero-circle">Book a shoot • Book a shoot •</textPath>
              </text>
            </svg>
            <span className="absolute inset-0 m-auto flex h-9 w-9 items-center justify-center rounded-full bg-ink md:h-11 md:w-11">
              <span className="ml-1 h-0 w-0 border-y-[7px] border-l-[11px] border-y-transparent border-l-lime" />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
