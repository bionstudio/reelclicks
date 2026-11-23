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
          "pointer-events-none absolute left-0 top-0 z-20 hidden h-[22rem] w-[17rem] -translate-x-1/2 -translate-y-1/2 overflow-hidden transition-[opacity,scale] duration-500 ease-[var(--ease-out-expo)] [@media(pointer:fine)]:lg:block",
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

      <ol className="border-t border-line">
        {services.map((s, i) => (
          <li key={s.id} data-svc-row className="border-b border-line">
            <Link
              href={`/services/${s.slug}`}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className="group/svc grid grid-cols-[auto_1fr_auto] items-center gap-x-5 py-6 md:grid-cols-12 md:gap-x-[var(--gutter)] md:py-9"
            >
              <span className="label md:col-span-1">{s.number}</span>

              <span className="flex items-center gap-4 md:col-span-7">
                <span className="relative h-16 w-12 shrink-0 overflow-hidden md:hidden">
                  <Picture image={s.image} sizes="48px" />
                </span>
                <span
                  className={cn(
                    "display text-[clamp(1.6rem,4.4vw,4.25rem)] leading-[0.95] transition-[color,transform] duration-700 ease-[var(--ease-out-expo)] lg:group-hover/svc:translate-x-4",
                    active !== null && active !== i ? "lg:text-paper/30" : "text-paper",
                  )}
                >
                  {s.title}
                </span>
              </span>

              <span className="hidden text-sm leading-relaxed text-mute md:col-span-3 md:block">{s.tagline}</span>

              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong transition-all duration-500 group-hover/svc:border-gold group-hover/svc:bg-gold group-hover/svc:text-ink md:col-span-1 md:justify-self-end">
                <ArrowUpRight size={16} strokeWidth={1.5} className="transition-transform duration-500 group-hover/svc:rotate-45" />
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
