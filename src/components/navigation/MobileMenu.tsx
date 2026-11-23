"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { navLinks, site, telHref, formatPhone, whatsappHref } from "@/lib/site";
import { useSmoothScroll } from "@/components/layout/SmoothScroll";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";
import { cn } from "@/lib/utils/cn";

const ease = [0.76, 0, 0.24, 1] as const;

export function MobileMenu({
  open,
  onClose,
  isActive,
}: {
  open: boolean;
  onClose: () => void;
  isActive: (href: string) => boolean;
}) {
  const { stop, start } = useSmoothScroll();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    stop();
    document.body.style.overflow = "hidden";
    const prevFocus = document.activeElement as HTMLElement | null;
    const t = window.setTimeout(() => panel.current?.querySelector<HTMLElement>("a")?.focus(), 350);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        // keep focus inside the menu
        const f = panel.current.querySelectorAll<HTMLElement>("a, button");
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      start();
      prevFocus?.focus?.();
    };
  }, [open, onClose, stop, start]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-[70] flex flex-col bg-ink-2 lg:hidden"
          initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 0.8, ease }}
        >
          <div className="shell flex flex-1 flex-col justify-between overflow-y-auto pb-8 pt-[calc(var(--header-h)+2rem)]">
            <nav aria-label="Mobile">
              <ul className="border-t border-line">
                {navLinks.map((l, i) => (
                  <li key={l.href} className="overflow-hidden border-b border-line">
                    <motion.div
                      initial={{ y: "110%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "110%" }}
                      transition={{ duration: 0.8, ease, delay: 0.15 + i * 0.05 }}
                    >
                      <Link
                        href={l.href}
                        onClick={onClose}
                        aria-current={isActive(l.href) ? "page" : undefined}
                        className="flex items-baseline justify-between py-3.5"
                      >
                        <span className={cn("display text-[clamp(2.4rem,11vw,4rem)]", isActive(l.href) && "italic text-gold-soft")}>
                          {l.label}
                        </span>
                        <span className="label">0{i + 1}</span>
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </nav>

            <motion.div
              className="mt-10 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <a
                href={whatsappHref(site.people.founder.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-gold font-mono text-xs uppercase tracking-[0.18em] text-ink"
              >
                <WhatsAppIcon /> Enquire on WhatsApp
              </a>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <a href={telHref(site.people.founder.phone)} className="text-mute">
                  <span className="label block text-paper">Founder</span>
                  {formatPhone(site.people.founder.phone)}
                </a>
                <a href={telHref(site.people.ceo.phone)} className="text-mute">
                  <span className="label block text-paper">CEO</span>
                  {formatPhone(site.people.ceo.phone)}
                </a>
              </div>
              <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="label flex items-center gap-2 text-paper">
                <InstagramIcon size={16} /> {site.instagram.handle}
              </a>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
