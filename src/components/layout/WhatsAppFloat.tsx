"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site, whatsappHref } from "@/lib/site";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { cn } from "@/lib/utils/cn";

/** Discreet WhatsApp shortcut that appears after the hero (hidden on the contact page). */
export function WhatsAppFloat() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const nearEnd = window.scrollY + window.innerHeight > document.documentElement.scrollHeight - 700;
      // the footer carries its own WhatsApp buttons, so step aside there
      setVisible(window.scrollY > window.innerHeight * 0.8 && !nearEnd);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  if (pathname === "/contact") return null;

  return (
    <a
      href={whatsappHref(site.people.founder.whatsapp)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Enquire on WhatsApp"
      tabIndex={visible ? 0 : -1}
      className={cn(
        "fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-ink/80 text-gold-soft backdrop-blur-md transition-all duration-700 ease-[var(--ease-out-expo)] hover:bg-gold hover:text-ink md:bottom-8 md:right-8",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
      )}
    >
      <WhatsAppIcon size={22} />
    </a>
  );
}
