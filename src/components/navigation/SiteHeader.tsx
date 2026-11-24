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
        className="label fixed left-4 top-4 z-[120] -translate-y-24 rounded-full bg-lime px-4 py-3 text-ink focus:translate-y-0"
      >
        Skip to content
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[80] transition-transform duration-700 ease-[var(--ease-out-expo)]",
          hidden && !open ? "-translate-y-[120%]" : "translate-y-0",
        )}
      >
        <div className="shell flex h-[var(--header-h)] items-center">
          <div
            className={cn(
              "flex w-full items-center justify-between gap-6 rounded-full border py-2 pl-5 pr-2 transition-[background-color,border-color,backdrop-filter] duration-700",
              scrolled && !open ? "border-line bg-ink/70 backdrop-blur-xl" : "border-transparent bg-transparent",
            )}
          >
            <Link href="/" className="relative z-[2] text-[1.35rem] leading-none md:text-[1.5rem]" aria-label="REELCLICKS.IN — home">
              <Wordmark />
            </Link>

            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-1 rounded-full border border-line bg-ink-2/80 p-1 backdrop-blur-xl">
                {navLinks.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      aria-current={isActive(l.href) ? "page" : undefined}
                      className={cn(
                        "group/nav relative flex h-10 items-center rounded-full px-4 text-[0.9rem] font-semibold transition-colors duration-300",
                        isActive(l.href) ? "bg-paper text-ink" : "text-paper/75 hover:bg-paper/10 hover:text-paper",
                      )}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden lg:block">
                <ButtonLink href="/contact" variant="lime" className="h-12">
                  Let&apos;s talk
                </ButtonLink>
              </div>
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                className="relative z-[2] flex h-12 w-12 items-center justify-center rounded-full bg-lime text-ink lg:hidden"
              >
                <span className="relative block h-3 w-5">
                  <span
                    className={cn(
                      "absolute left-0 h-[2px] w-5 rounded bg-ink transition-all duration-500 ease-[var(--ease-cine)]",
                      open ? "top-1.5 rotate-45" : "top-0",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute left-0 h-[2px] rounded bg-ink transition-all duration-500 ease-[var(--ease-cine)]",
                      open ? "top-1.5 w-5 -rotate-45" : "top-3 w-3",
                    )}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <MobileMenu open={open} onClose={() => setOpen(false)} isActive={isActive} />
    </>
  );
}
