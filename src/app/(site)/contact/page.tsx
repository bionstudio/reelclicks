import type { Metadata } from "next";
import { Suspense } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { getServices } from "@/lib/content";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { site, formatPhone, telHref, whatsappHref, mailHref } from "@/lib/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText } from "@/components/animations/RevealText";
import { FadeIn } from "@/components/animations/Motion";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";

export const metadata: Metadata = pageMetadata({
  title: "Contact — Book a Wedding Film, Reel or Brand Shoot",
  description:
    "Enquire with REELCLICKS.IN for wedding films, cinematic reels, brand, corporate and event shoots across Maharashtra. Call, WhatsApp or send an enquiry.",
  path: "/contact",
});

export default async function ContactPage() {
  const services = await getServices();
  const people = [site.people.founder, site.people.ceo];

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} />
      <section data-section="Contact" aria-labelledby="contact-title" className="pb-24 pt-[calc(var(--header-h)+5rem)] md:pb-36 md:pt-[calc(var(--header-h)+8rem)]">
        <div className="shell">
          <SectionLabel index="001" title="Contact" tone="gold" />
          <RevealText as="h1" id="contact-title" split="words" trigger="intro" className="display mt-10 max-w-[16ch] text-mega uppercase">
            Your story deserves to be <em className="text-gold-soft">seen.</em>
          </RevealText>
          <FadeIn className="mt-10 max-w-xl text-lead leading-snug text-paper/80" delay={0.3}>
            Have a moment, brand or story worth capturing? Let&apos;s create something unforgettable.
          </FadeIn>

          <div className="mt-20 grid gap-16 md:mt-28 lg:grid-cols-12">
            {/* Direct lines */}
            <aside className="lg:col-span-4" aria-label="Direct contact">
              <div className="space-y-10 lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
                {people.map((p) => (
                  <div key={p.phone} className="border-t border-line pt-6">
                    <p className="label text-gold">{p.role}</p>
                    <p className="display mt-2 text-3xl">{p.name}</p>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <a
                        href={telHref(p.phone)}
                        className="inline-flex h-11 items-center gap-2.5 rounded-full border border-line-strong px-5 font-mono text-[0.68rem] uppercase tracking-[0.14em] hover:border-gold hover:text-gold-soft"
                      >
                        <Phone size={14} strokeWidth={1.5} /> {formatPhone(p.phone)}
                      </a>
                      <a
                        href={whatsappHref(p.whatsapp)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`WhatsApp ${p.name}`}
                        className="inline-flex h-11 items-center gap-2.5 rounded-full bg-gold px-5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink hover:bg-gold-soft"
                      >
                        <WhatsAppIcon size={15} /> WhatsApp
                      </a>
                    </div>
                  </div>
                ))}

                <ul className="space-y-4 border-t border-line pt-6 text-mute">
                  <li>
                    <a href={mailHref()} className="flex items-center gap-3 break-all hover:text-paper">
                      <Mail size={16} strokeWidth={1.5} className="shrink-0 text-gold" /> {site.email}
                    </a>
                  </li>
                  <li>
                    <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-paper">
                      <InstagramIcon size={16} className="shrink-0 text-gold" /> {site.instagram.handle}
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin size={16} strokeWidth={1.5} className="mt-1 shrink-0 text-gold" />
                    <span>
                      {site.locations.join(", ")}
                      <br />
                      <span className="text-paper">Shooting all over Maharashtra</span>
                    </span>
                  </li>
                </ul>
              </div>
            </aside>

            {/* Form */}
            <div className="lg:col-span-7 lg:col-start-6">
              <p className="label mb-10">Enquiry form — every field helps us plan</p>
              <Suspense fallback={<div className="h-[40rem]" />}>
                <EnquiryForm services={services.map((s) => ({ slug: s.slug, title: s.title }))} />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
