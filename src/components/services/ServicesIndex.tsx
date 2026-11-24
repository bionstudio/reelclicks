"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/types/content";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { Picture } from "@/components/ui/Picture";
import { cn } from "@/lib/utils/cn";

/**
 * An index of services set like film credits. On desktop, a frame from each
 * service follows the cursor as you read down the list; on mobile each row
 * carries its own thumbnail.
 */
export function ServicesIndex({ services }: { services: Service[] }) {
  const root = useRef<HTMLDivElement>(null);
  const float = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  const { contextSafe } = useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-svc-row]", {
          autoAlpha: 0,
          y: 40,
          duration: 1.2,
          stagger: 0.07,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const move = contextSafe((e: React.PointerEvent) => {
    if (!float.current || !root.current) return;
    const r = root.current.getBoundingClientRect();
    gsap.to(float.current, { x: e.clientX - r.left, y: e.clientY - r.top, duration: 0.9, ease: "expo.out" });
  });

  return (
    <div ref={root} className="relative" onPointerMove={move} onPointerLeave={() => setActive(null)}>
      {/* floating frame (desktop, fine pointer only) */}
      <div
        ref={float}
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-0 top-0 z-20 hidden h-[22rem] w-[17rem] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[1.5rem] rotate-[-4deg] shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)] transition-[opacity,scale] duration-500 ease-[var(--ease-out-expo)] [@media(pointer:fine)]:lg:block",
          active === null ? "scale-75 opacity-0" : "scale-100 opacity-100",
        )}
      >
        {services.map((s, i) => (
          <div
            key={s.id}
            className={cn(
              "absolute inset-0 transition-[clip-path] duration-700 ease-[var(--ease-cine)]",
              active === i ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(100%_0_0_0)]",
            )}
          >
            <Picture image={s.image} sizes="272px" />
          </div>
        ))}
      </div>

      <ol className="space-y-2">
        {services.map((s, i) => (
          <li key={s.id} data-svc-row className="rounded-[1.5rem] border border-line bg-ink-2/60">
            <Link
              href={`/services/${s.slug}`}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className="group/svc grid grid-cols-[auto_1fr_auto] items-center gap-x-4 rounded-[1.5rem] px-4 py-4 transition-colors duration-300 hover:bg-lime hover:text-ink focus-visible:bg-lime focus-visible:text-ink md:grid-cols-12 md:gap-x-6 md:px-7 md:py-7"
            >
              <span className="font-mono text-xs text-mute transition-colors group-hover/svc:text-ink/60 md:col-span-1">{s.number}</span>

              <span className="flex items-center gap-4 md:col-span-7">
                <span className="relative h-16 w-12 shrink-0 overflow-hidden rounded-xl md:hidden">
                  <Picture image={s.image} sizes="48px" />
                </span>
                <span
                  className={cn(
                    "display text-[clamp(1.3rem,3.8vw,3.75rem)] leading-[0.95] tracking-[-0.025em] transition-[color,transform] duration-500 ease-[var(--ease-out-expo)] group-hover/svc:text-ink lg:group-hover/svc:translate-x-3",
                    active !== null && active !== i ? "lg:text-paper/35" : "text-paper",
                  )}
                >
                  {s.title}
                </span>
              </span>

              <span className="hidden text-sm font-medium leading-relaxed text-mute transition-colors group-hover/svc:text-ink/70 md:col-span-3 md:block">{s.tagline}</span>

              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-paper/10 transition-all duration-500 group-hover/svc:bg-ink group-hover/svc:text-lime md:col-span-1 md:justify-self-end">
                <ArrowUpRight size={18} strokeWidth={2.25} className="transition-transform duration-500 group-hover/svc:rotate-45" />
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
