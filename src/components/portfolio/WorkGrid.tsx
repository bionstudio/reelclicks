"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PROJECT_CATEGORIES, type Project, type ProjectCategory } from "@/types/content";
import { ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils/cn";
import { WorkCard } from "./WorkCard";
import { VideoLightbox } from "./VideoLightbox";

/*
 * Bento grid on 12 columns: a wide + narrow pair, then a row of three.
 * Every tile in a row shares one height so the grid stays tight.
 */
// Tablet: two equal columns (the fifth tile spans the row); desktop: the full bento.
const TALL = "md:aspect-auto md:h-[clamp(20rem,38vw,38rem)]";
const SHORT = "md:aspect-auto md:h-[20rem] lg:h-[clamp(18rem,30vw,30rem)]";
const SLOTS = [
  { cls: "md:col-span-6 lg:col-span-7", frame: TALL, sizes: "(min-width: 1024px) 58vw, (min-width: 768px) 50vw, 100vw" },
  { cls: "md:col-span-6 lg:col-span-5", frame: TALL, sizes: "(min-width: 1024px) 42vw, (min-width: 768px) 50vw, 100vw" },
  { cls: "md:col-span-6 lg:col-span-4", frame: SHORT, sizes: "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" },
  { cls: "md:col-span-6 lg:col-span-4", frame: SHORT, sizes: "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" },
  { cls: "md:col-span-12 lg:col-span-4", frame: SHORT, sizes: "(min-width: 1024px) 33vw, 100vw" },
] as const;

export function WorkGrid({ projects, showFilters = true }: { projects: Project[]; showFilters?: boolean }) {
  const [filter, setFilter] = useState<ProjectCategory | "all">("all");
  const [active, setActive] = useState<number | null>(null);

  const categories = useMemo(
    () => PROJECT_CATEGORIES.filter((c) => projects.some((p) => p.category === c.value)),
    [projects],
  );
  const visible = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.category === filter)),
    [filter, projects],
  );

  const close = useCallback(() => setActive(null), []);

  const choose = (value: ProjectCategory | "all") => {
    setFilter(value);
    window.setTimeout(() => ScrollTrigger.refresh(), 900);
  };

  return (
    <>
      {showFilters && categories.length > 1 && (
        <div role="toolbar" aria-label="Filter films by category" className="-mx-[var(--gutter)] mb-14 overflow-x-auto px-[var(--gutter)] md:mb-20">
          <ul className="flex min-w-max gap-2">
            {[{ value: "all" as const, label: "All films" }, ...categories].map((c) => {
              const count = c.value === "all" ? projects.length : projects.filter((p) => p.category === c.value).length;
              const on = filter === c.value;
              return (
                <li key={c.value}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => choose(c.value)}
                    className={cn(
                      "relative h-11 rounded-full border px-5 text-[0.9rem] font-semibold transition-colors duration-300",
                      on ? "border-lime bg-lime text-ink" : "border-line-strong text-paper/75 hover:border-paper hover:text-paper",
                    )}
                  >
                    {c.label}
                    <sup className={cn("ml-1.5 font-mono", on ? "text-ink/60" : "text-lime")}>{count}</sup>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "film" : "films"}
      </p>

      <motion.ul layout className="grid grid-cols-1 gap-x-4 gap-y-10 md:grid-cols-12 md:gap-x-5 md:gap-y-14">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((p, i) => {
            const slot = SLOTS[i % SLOTS.length]!;
            return (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: Math.min(i, 6) * 0.04 }}
                className={slot.cls}
              >
                <WorkCard
                  project={p}
                  index={projects.indexOf(p)}
                  sizes={slot.sizes}
                  frameClassName={slot.frame}
                  onPlay={() => setActive(i)}
                />
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>

      {visible.length === 0 && <p className="label py-24 text-center">New films in this category are on their way.</p>}

      <VideoLightbox projects={visible} index={active} onClose={close} onNavigate={setActive} />
    </>
  );
}
