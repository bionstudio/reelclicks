"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navLinks } from "@/lib/site";
import { cn } from "@/lib/utils/cn";
import { Wordmark } from "@/components/ui/BrandIcons";
import { ButtonLink } from "@/components/ui/Button";
import { MobileMenu } from "./MobileMenu";

/**
 * Transparent over the hero, gains a background after scrolling, hides while
 * scrolling down and returns when scrolling up.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 240 && y > lastY.current + 4 ? true : y < lastY.current - 4 ? false : (h) => h);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <a
        href="#main"
        className="label fixed left-4 top-4 z-[120] -translate-y-24 bg-paper px-4 py-3 text-ink focus:translate-y-0"
      >
        Skip to content
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[80] transition-[transform,background-color,border-color,backdrop-filter] duration-700 ease-[var(--ease-out-expo)]",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
          scrolled && !open ? "border-b border-line bg-ink/75 backdrop-blur-xl" : "border-b border-transparent",
        )}
      >
        <div className="shell flex h-[var(--header-h)] items-center justify-between gap-6">
          <Link href="/" className="relative z-[2] text-[1.45rem] leading-none md:text-[1.6rem]" aria-label="REELCLICKS.IN — home">
            <Wordmark />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={isActive(l.href) ? "page" : undefined}
                    className="group/nav relative flex items-center gap-2 py-2 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-paper/80 transition-colors hover:text-paper"
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "h-1 w-1 rounded-full bg-gold transition-all duration-500",
                        isActive(l.href) ? "scale-100 opacity-100" : "scale-0 opacity-0 group-hover/nav:scale-100 group-hover/nav:opacity-100",
                      )}
                    />
                    <span className="relative block overflow-hidden">
                      <span className="block transition-transform duration-500 ease-[var(--ease-cine)] group-hover/nav:-translate-y-full">
                        {l.label}
                      </span>
                      <span
                        aria-hidden
                        className="absolute inset-0 block translate-y-full text-gold-soft transition-transform duration-500 ease-[var(--ease-cine)] group-hover/nav:translate-y-0"
                      >
                        {l.label}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden lg:block">
              <ButtonLink href="/contact" variant="outline" className="h-11 px-6">
                Let&apos;s talk
              </ButtonLink>
            </div>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative z-[2] flex h-11 w-11 items-center justify-center rounded-full border border-line-strong lg:hidden"
            >
              <span className="relative block h-3 w-5">
                <span
                  className={cn(
                    "absolute left-0 h-px w-5 bg-paper transition-all duration-500 ease-[var(--ease-cine)]",
                    open ? "top-1.5 rotate-45" : "top-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 h-px bg-paper transition-all duration-500 ease-[var(--ease-cine)]",
                    open ? "top-1.5 w-5 -rotate-45" : "top-3 w-3",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={open} onClose={() => setOpen(false)} isActive={isActive} />
    </>
  );
}
