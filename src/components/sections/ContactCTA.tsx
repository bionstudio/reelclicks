import { Phone } from "lucide-react";
import { site, formatPhone, telHref, whatsappHref, mailHref } from "@/lib/site";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText } from "@/components/animations/RevealText";
import { ButtonLink } from "@/components/ui/Button";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";
import { FadeIn } from "@/components/animations/Motion";

export function ContactCTA({ index = "008", context }: { index?: string; context?: string }) {
  return (
    <section data-section="Your story" aria-labelledby="cta-title" className="relative overflow-hidden py-28 md:py-44">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_70%_60%,rgb(198_167_106/0.08),transparent_70%)]" />
      <div className="shell relative">
        <SectionLabel index={index} title="Your story" tone="gold" />
        <RevealText as="h2" id="cta-title" split="words" className="display mt-10 text-mega uppercase">
          Your story deserves to be <em className="text-gold-soft">seen.</em>
        </RevealText>

        <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-12">
          <p className="text-lead leading-snug text-paper/85 md:col-span-5">
            Have a moment, brand or story worth capturing? Let&apos;s create something unforgettable.
          </p>

          <FadeIn className="md:col-span-6 md:col-start-7" selector="[data-cta-item]" stagger={0.06}>
            <div data-cta-item className="flex flex-wrap gap-3">
              <ButtonLink href="/contact" variant="gold">
                Start your enquiry
              </ButtonLink>
              <ButtonLink
                href={whatsappHref(site.people.founder.whatsapp, context)}
                variant="outline"
                icon={<WhatsAppIcon size={16} />}
              >
                WhatsApp
              </ButtonLink>
            </div>
            <dl data-cta-item className="mt-12 grid grid-cols-1 gap-8 border-t border-line pt-8 sm:grid-cols-2">
              <div>
                <dt className="label">Founder — {site.people.founder.name}</dt>
                <dd className="mt-2">
                  <a href={telHref(site.people.founder.phone)} className="link-draw inline-flex items-center gap-2 text-lg">
                    <Phone size={15} strokeWidth={1.5} className="text-gold" /> {formatPhone(site.people.founder.phone)}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="label">CEO — {site.people.ceo.name}</dt>
                <dd className="mt-2">
                  <a href={telHref(site.people.ceo.phone)} className="link-draw inline-flex items-center gap-2 text-lg">
                    <Phone size={15} strokeWidth={1.5} className="text-gold" /> {formatPhone(site.people.ceo.phone)}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="label">Email</dt>
                <dd className="mt-2">
                  <a href={mailHref()} className="link-draw break-all text-lg">
                    {site.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="label">Instagram</dt>
                <dd className="mt-2">
                  <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="link-draw inline-flex items-center gap-2 text-lg">
                    <InstagramIcon size={16} className="text-gold" /> {site.instagram.handle}
                  </a>
                </dd>
              </div>
            </dl>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
