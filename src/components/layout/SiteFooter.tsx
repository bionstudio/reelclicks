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
      <footer className="relative overflow-hidden rounded-t-[2rem] border-t border-line bg-ink-2 md:rounded-t-[3rem]" aria-labelledby="footer-heading">
        <div className="shell pt-24 md:pt-32">
          <p className="chip mb-8 w-fit">
            <span className="h-2 w-2 rounded-full bg-lime" /> That&apos;s a wrap
          </p>
          <h2 id="footer-heading" className="display text-giant" data-footer-headline>
            Let&apos;s create
            <br />
            something <span className="mark">epic.</span>
          </h2>

          <div className="mt-14 flex flex-wrap gap-4">
            <a
              href={whatsappHref(site.people.founder.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-13 items-center gap-3 rounded-full bg-lime px-7 text-[0.95rem] font-bold text-ink transition-colors hover:bg-paper"
            >
              <WhatsAppIcon size={17} /> WhatsApp us
            </a>
            <Link
              href="/contact"
              className="inline-flex h-13 items-center rounded-full border border-line-strong px-7 text-[0.95rem] font-bold transition-colors hover:border-paper hover:bg-paper hover:text-ink"
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
                <span className="text-lime">{site.coverage}</span>
              </p>
            </div>

            <nav aria-label="Footer" className="lg:col-span-2">
              <p className="label mb-5 text-paper">Explore</p>
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
                  <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-lime">
                    <InstagramIcon size={20} />
                  </a>
                  <a
                    href={whatsappHref(site.people.founder.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="hover:text-lime"
                  >
                    <WhatsAppIcon size={20} />
                  </a>
                </li>
              </ul>
            </address>
          </div>
        </div>

        <div aria-hidden className="pointer-events-none mt-16 select-none overflow-hidden">
          <p className="display whitespace-nowrap text-center text-[21vw] leading-[0.8] tracking-[-0.06em] text-lime">reelclicks</p>
        </div>

        <div className="shell flex flex-col items-start justify-between gap-4 border-t border-line py-6 sm:flex-row sm:items-center">
          <p className="label">© {year} REELCLICKS.IN — All rights reserved.</p>
          <BackToTop />
        </div>
      </footer>
    </FooterReveal>
  );
}
