import { Phone } from "lucide-react";
import { site, formatPhone, telHref, whatsappHref, mailHref } from "@/lib/site";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText } from "@/components/animations/RevealText";
import { ButtonLink } from "@/components/ui/Button";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";
import { FadeIn } from "@/components/animations/Motion";

export function ContactCTA({ index = "008", context }: { index?: string; context?: string }) {
  const contacts = [
    {
      label: `Founder — ${site.people.founder.name}`,
      href: telHref(site.people.founder.phone),
      text: formatPhone(site.people.founder.phone),
      icon: <Phone size={16} strokeWidth={2} />,
    },
    {
      label: `CEO — ${site.people.ceo.name}`,
      href: telHref(site.people.ceo.phone),
      text: formatPhone(site.people.ceo.phone),
      icon: <Phone size={16} strokeWidth={2} />,
    },
    { label: "Email", href: mailHref(), text: site.email },
    {
      label: "Instagram",
      href: site.instagram.url,
      text: site.instagram.handle,
      icon: <InstagramIcon size={17} />,
      external: true,
    },
  ];

  return (
    <section data-section="Your story" aria-labelledby="cta-title" className="relative py-16 md:py-24">
      <div className="shell">
        <div className="relative overflow-hidden rounded-[2rem] bg-lime px-6 py-14 text-ink md:rounded-[2.75rem] md:px-14 md:py-20">
          {/* decorative play mark */}
          <svg aria-hidden viewBox="0 0 100 100" className="pointer-events-none absolute -right-16 -top-16 h-[22rem] w-[22rem] text-ink/[0.07] md:h-[34rem] md:w-[34rem]">
            <circle cx="50" cy="50" r="48" fill="currentColor" />
            <path d="M40 30 L72 50 L40 70 Z" fill="var(--color-lime)" />
          </svg>

          <div className="relative">
            <SectionLabel index={index} title="Your story" tone="dark" />
            <RevealText as="h2" id="cta-title" split="words" className="display mt-8 max-w-[13ch] text-mega">
              Got a story? Let&apos;s shoot it.
            </RevealText>

            <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-12">
              <p className="text-lead font-medium leading-snug text-ink/80 md:col-span-5">
                Have a moment, brand or story worth capturing? Let&apos;s create something unforgettable.
              </p>

              <FadeIn className="md:col-span-7 md:col-start-6 lg:col-span-6 lg:col-start-7" selector="[data-cta-item]" stagger={0.06}>
                <div data-cta-item className="flex flex-wrap gap-3">
                  <ButtonLink href="/contact" variant="dark">
                    Start your enquiry
                  </ButtonLink>
                  <ButtonLink
                    href={whatsappHref(site.people.founder.whatsapp, context)}
                    variant="outline-dark"
                    icon={<WhatsAppIcon size={17} />}
                  >
                    WhatsApp
                  </ButtonLink>
                </div>
                <dl data-cta-item className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {contacts.map((c) => (
                    <div key={c.label} className="rounded-2xl bg-ink/[0.07] p-4 transition-colors hover:bg-ink/[0.12]">
                      <dt className="text-xs font-bold uppercase tracking-[0.06em] text-ink/60">{c.label}</dt>
                      <dd className="mt-1.5">
                        <a
                          href={c.href}
                          {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className="inline-flex items-center gap-2 break-all text-lg font-bold"
                        >
                          {c.icon} {c.text}
                        </a>
                      </dd>
                    </div>
                  ))}
                </dl>
              </FadeIn>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
