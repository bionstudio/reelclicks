"use client";

import Link from "next/link";
import { useRef } from "react";
import type { Project } from "@/types/content";
import { categoryLabel } from "@/lib/utils/category";
import { yearOf } from "@/lib/utils/cn";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { Picture } from "@/components/ui/Picture";
import { cn } from "@/lib/utils/cn";

/**
 * Portfolio tile. On desktop, hovering plays a silent preview of the film and a
 * cursor label follows the pointer. Clicking the frame opens the lightbox;
 * the title links to the full project page.
 */
export function WorkCard({
  project,
  index,
  onPlay,
  sizes,
  className,
  frameClassName,
}: {
  project: Project;
  index: number;
  onPlay: () => void;
  sizes: string;
  className?: string;
  frameClassName?: string;
}) {
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLVideoElement>(null);
  const cursor = useRef<HTMLSpanElement>(null);
  const canPreview = project.video?.kind === "file";

  const { contextSafe } = useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          root.current!.querySelector("[data-card-frame]"),
          { clipPath: "inset(18% 0% 0% 0% round 1.75rem)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 1.75rem)",
            duration: 1.6,
            ease: "expo.out",
            scrollTrigger: { trigger: root.current, start: "top 92%", once: true },
          },
        );
        gsap.from(root.current!.querySelectorAll("[data-card-meta]"), {
          autoAlpha: 0,
          y: 16,
          duration: 1,
          stagger: 0.06,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "top 92%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const fine = () => typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

  const enter = contextSafe(() => {
    if (!fine()) return;
    const v = preview.current;
    if (v && canPreview && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (!v.src) v.src = project.video!.src;
      v.play().then(() => v.classList.add("opacity-100")).catch(() => {});
    }
    gsap.to(cursor.current, { scale: 1, autoAlpha: 1, duration: 0.5, ease: "expo.out" });
  });

  const leave = contextSafe(() => {
    const v = preview.current;
    if (v) {
      v.classList.remove("opacity-100");
      v.pause();
    }
    gsap.to(cursor.current, { scale: 0.4, autoAlpha: 0, duration: 0.4 });
  });

  const move = contextSafe((e: React.PointerEvent) => {
    if (!fine() || !cursor.current) return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    gsap.to(cursor.current, { x: e.clientX - r.left, y: e.clientY - r.top, duration: 0.6, ease: "expo.out" });
  });

  const portrait = project.orientation === "portrait";

  return (
    <article ref={root} className={cn("group/card relative", className)}>
      <div
        data-card-frame
        className={cn("card relative bg-ink-2", portrait ? "aspect-[4/5]" : "aspect-[3/2]", frameClassName)}
        onPointerEnter={enter}
        onPointerLeave={leave}
        onPointerMove={move}
      >
        <div className="absolute inset-0 transition-transform duration-[1.6s] ease-[var(--ease-out-expo)] group-hover/card:scale-[1.04]">
          <Picture image={project.cover} sizes={sizes} />
          {canPreview && (
            <video
              ref={preview}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden
              tabIndex={-1}
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700"
            />
          )}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-80" />

        <button
          type="button"
          onClick={onPlay}
          className="absolute inset-0 z-[1] cursor-none max-md:cursor-pointer"
          aria-label={`Play ${project.title}`}
        />

        {/* cursor label (desktop) */}
        <span
          ref={cursor}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-[2] -ml-12 -mt-12 flex h-24 w-24 scale-40 items-center justify-center gap-1.5 rounded-full bg-lime text-sm font-extrabold text-ink opacity-0"
        >
          <span className="h-0 w-0 border-y-[5px] border-l-[8px] border-y-transparent border-l-ink" /> Play
        </span>

        <span className="chip pointer-events-none absolute left-4 top-4 z-[2] h-8 border-paper/20 bg-ink/50 px-3 font-mono text-xs backdrop-blur-md">
          {String(index + 1).padStart(2, "0")}
        </span>
        {project.isSample && <span className="sample-badge pointer-events-none absolute right-4 top-4 z-[2]">Sample</span>}
        {/* mobile play affordance */}
        <span className="pointer-events-none absolute bottom-4 left-4 z-[2] flex h-10 items-center gap-2 rounded-full bg-lime px-4 text-sm font-bold text-ink md:hidden">
          <span className="h-0 w-0 border-y-[5px] border-l-[8px] border-y-transparent border-l-ink" /> Play
        </span>
      </div>

      <div className="mt-5 flex items-start justify-between gap-6">
        <div>
          <p data-card-meta className="label">
            {categoryLabel(project.category)}
          </p>
          <h3 data-card-meta className="display mt-2 text-[clamp(1.6rem,2.4vw,2.5rem)] leading-none tracking-[-0.035em]">
            <Link href={`/work/${project.slug}`} className="transition-colors duration-300 hover:text-lime">
              {project.title}
            </Link>
          </h3>
        </div>
        <p data-card-meta className="chip h-8 shrink-0 px-3 font-mono text-xs text-mute">
          {yearOf(project.date)}
        </p>
      </div>
    </article>
  );
}
