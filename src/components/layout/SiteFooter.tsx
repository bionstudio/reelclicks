import Link from "next/link";
import { navLinks, site, telHref, formatPhone, whatsappHref, mailHref } from "@/lib/site";
import { getServices } from "@/lib/content";
import { InstagramIcon, WhatsAppIcon, Wordmark } from "@/components/ui/BrandIcons";
import { FooterReveal } from "./FooterReveal";
import { BackToTop } from "./BackToTop";

export async function SiteFooter() {
  const services = await getServices();
  const year = new Date().getFullYear();

  return (
    <FooterReveal>
      <footer className="relative overflow-hidden border-t border-line bg-ink-2" aria-labelledby="footer-heading">
        <div className="shell pt-24 md:pt-32">
          <p className="label mb-8 flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" /> End credits
          </p>
          <h2 id="footer-heading" className="display text-giant uppercase" data-footer-headline>
            Let&apos;s create
            <br />
            something <em className="text-gold-soft">timeless.</em>
          </h2>

          <div className="mt-14 flex flex-wrap gap-4">
            <a
              href={whatsappHref(site.people.founder.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-13 items-center gap-3 rounded-full bg-gold px-7 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-ink transition-colors hover:bg-gold-soft"
            >
              <WhatsAppIcon size={17} /> WhatsApp us
            </a>
            <Link
              href="/contact"
              className="inline-flex h-13 items-center rounded-full border border-line-strong px-7 font-mono text-[0.72rem] uppercase tracking-[0.18em] transition-colors hover:border-gold hover:text-gold-soft"
            >
              Start an enquiry
            </Link>
          </div>

          <div className="mt-24 grid gap-12 border-t border-line pt-14 sm:grid-cols-2 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Link href="/" className="text-3xl" aria-label="REELCLICKS.IN — home">
                <Wordmark />
              </Link>
              <p className="mt-4 max-w-xs text-mute">{site.tagline}</p>
              <p className="label mt-8">
                {site.locations.join(" · ")}
                <br />
                <span className="text-gold">{site.coverage}</span>
              </p>
            </div>

            <nav aria-label="Footer" className="lg:col-span-2">
              <p className="label mb-5 text-paper">Index</p>
              <ul className="space-y-2.5">
                {navLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="link-draw text-mute hover:text-paper">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="lg:col-span-3">
              <p className="label mb-5 text-paper">Services</p>
              <ul className="space-y-2.5">
                {services.map((s) => (
                  <li key={s.id}>
                    <Link href={`/services/${s.slug}`} className="link-draw text-mute hover:text-paper">
                      {s.shortTitle}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <address className="not-italic lg:col-span-3">
              <p className="label mb-5 text-paper">Contact</p>
              <ul className="space-y-4 text-mute">
                <li>
                  <span className="label block">Founder — {site.people.founder.name}</span>
                  <a href={telHref(site.people.founder.phone)} className="link-draw hover:text-paper">
                    {formatPhone(site.people.founder.phone)}
                  </a>
                </li>
                <li>
                  <span className="label block">CEO — {site.people.ceo.name}</span>
                  <a href={telHref(site.people.ceo.phone)} className="link-draw hover:text-paper">
                    {formatPhone(site.people.ceo.phone)}
                  </a>
                </li>
                <li>
                  <a href={mailHref()} className="link-draw break-all hover:text-paper">
                    {site.email}
                  </a>
                </li>
                <li className="flex gap-4 pt-1">
                  <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-gold">
                    <InstagramIcon size={20} />
                  </a>
                  <a
                    href={whatsappHref(site.people.founder.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="hover:text-gold"
                  >
                    <WhatsAppIcon size={20} />
                  </a>
                </li>
              </ul>
            </address>
          </div>
        </div>

        <div aria-hidden className="pointer-events-none mt-16 select-none overflow-hidden">
          <p className="display text-outline whitespace-nowrap text-center text-[19.5vw] leading-[0.78] uppercase">Reelclicks</p>
        </div>

        <div className="shell flex flex-col items-start justify-between gap-4 border-t border-line py-6 sm:flex-row sm:items-center">
          <p className="label">© {year} REELCLICKS.IN — All rights reserved.</p>
          <BackToTop />
        </div>
      </footer>
    </FooterReveal>
  );
}
