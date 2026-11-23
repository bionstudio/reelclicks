"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import type { Project } from "@/types/content";
import { categoryLabel } from "@/lib/utils/category";
import { yearOf } from "@/lib/utils/cn";
import { useSmoothScroll } from "@/components/layout/SmoothScroll";
import { VideoPlayer } from "./VideoPlayer";

const ease = [0.76, 0, 0.24, 1] as const;

export function VideoLightbox({
  projects,
  index,
  onClose,
  onNavigate,
}: {
  projects: Project[];
  index: number | null;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  const { stop, start } = useSmoothScroll();
  const dialog = useRef<HTMLDivElement>(null);
  const open = index !== null;
  const project = index !== null ? projects[index] : null;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    stop();
    document.body.style.overflow = "hidden";
    const prev = document.activeElement as HTMLElement | null;
    const t = window.setTimeout(() => dialog.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus(), 100);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = "";
      start();
      prev?.focus?.();
    };
  }, [open, stop, start]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (index === null) return;
      const target = e.target as HTMLElement;
      if (target.closest("video, input")) return; // let the player handle its own keys
      if (e.key === "ArrowRight") onNavigate((index + 1) % projects.length);
      if (e.key === "ArrowLeft") onNavigate((index - 1 + projects.length) % projects.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, projects.length, onClose, onNavigate]);

  if (!mounted) return null;

  // Portal: escape <main>'s stacking context so the film sits above all chrome
  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          ref={dialog}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} — film`}
          className="fixed inset-0 z-[95] flex flex-col bg-ink/97 backdrop-blur-sm"
          initial={{ clipPath: "inset(50% 0% 50% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(50% 0% 50% 0%)" }}
          transition={{ duration: 0.9, ease }}
        >
          <div className="shell flex h-[var(--header-h)] shrink-0 items-center justify-between">
            <p className="label">
              <span className="text-paper">{String((index ?? 0) + 1).padStart(2, "0")}</span> / {String(projects.length).padStart(2, "0")}
            </p>
            <button
              type="button"
              onClick={onClose}
              data-autofocus
              className="label flex items-center gap-3 text-paper hover:text-gold"
              aria-label="Close film"
            >
              Close
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong">
                <X size={16} strokeWidth={1.5} />
              </span>
            </button>
          </div>

          <div className="shell flex min-h-0 flex-1 items-center justify-center py-4">
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
              className={
                project.orientation === "portrait"
                  ? "h-full max-h-[78svh] aspect-[9/16]"
                  : "w-full max-w-[min(100%,calc(78svh*16/9))]"
              }
            >
              {project.video ? (
                <VideoPlayer
                  video={project.video}
                  poster={project.cover}
                  title={project.title}
                  autoPlay
                  ratio={project.orientation === "portrait" ? "9 / 16" : "16 / 9"}
                  className="h-full w-full"
                />
              ) : (
                <div className="label flex aspect-video items-center justify-center bg-ink-2">Film coming soon</div>
              )}
            </motion.div>
          </div>

          <div className="shell flex shrink-0 flex-wrap items-end justify-between gap-4 pb-6 pt-2">
            <div>
              <p className="label">
                {categoryLabel(project.category)} · {yearOf(project.date)}
                {project.isSample && <span className="sample-badge ml-3">Sample</span>}
              </p>
              <h2 className="display mt-2 text-[clamp(1.75rem,3.5vw,3rem)]">{project.title}</h2>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/work/${project.slug}`}
                onClick={onClose}
                className="label mr-2 flex items-center gap-2 text-paper hover:text-gold"
              >
                Project details <ArrowUpRight size={14} />
              </Link>
              <button
                type="button"
                onClick={() => onNavigate(((index ?? 0) - 1 + projects.length) % projects.length)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong hover:border-gold"
                aria-label="Previous film"
              >
                <ArrowLeft size={16} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => onNavigate(((index ?? 0) + 1) % projects.length)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong hover:border-gold"
                aria-label="Next film"
              >
                <ArrowRight size={16} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
