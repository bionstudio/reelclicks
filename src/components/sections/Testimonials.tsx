"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Testimonial } from "@/types/content";
import { SectionLabel } from "@/components/ui/SectionLabel";

/**
 * Verified client words only (managed in the Studio with a "verified" switch).
 * The section is not rendered at all when there are none.
 */
export function Testimonials({ items, index = "007" }: { items: Testimonial[]; index?: string }) {
  const [i, setI] = useState(0);
  if (!items.length) return null;
  const t = items[i]!;
  return (
    <section data-section="Kind words" aria-labelledby="testimonials-title" className="relative py-16 md:py-28">
      <div className="shell">
        <SectionLabel index={index} title="Kind words" />
        <h2 id="testimonials-title" className="sr-only">
          Client testimonials
        </h2>
        <div className="mt-14 grid gap-10 md:grid-cols-12">
          <span aria-hidden className="display text-[8rem] leading-[0.6] text-lime md:col-span-1">
            “
          </span>
          <div className="min-h-[16rem] md:col-span-10" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.figure
                key={t.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <blockquote className="display text-[clamp(1.75rem,3.6vw,3.5rem)] leading-[1.08]">{t.quote}</blockquote>
                <figcaption className="label mt-10">
                  <span className="text-paper">{t.name}</span>
                  {t.context && <> — {t.context}</>}
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
        </div>
        {items.length > 1 && (
          <div className="mt-12 flex items-center gap-4 md:ml-[calc(100%/12)]">
            <button
              type="button"
              onClick={() => setI((i - 1 + items.length) % items.length)}
              aria-label="Previous testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong hover:border-lime"
            >
              <ArrowLeft size={16} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => setI((i + 1) % items.length)}
              aria-label="Next testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong hover:border-lime"
            >
              <ArrowRight size={16} strokeWidth={1.5} />
            </button>
            <span className="label ml-2">
              {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
