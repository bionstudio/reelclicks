import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/types/content";
import { site, whatsappHref } from "@/lib/site";
import { RevealText } from "@/components/animations/RevealText";
import { FadeIn, Parallax, RevealMask } from "@/components/animations/Motion";
import { Picture } from "@/components/ui/Picture";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { cn } from "@/lib/utils/cn";

/**
 * One service as a "chapter". Three composition variants rotate so the page
 * never settles into a repetitive card grid.
 */
export function ServiceChapter({ service, variant }: { service: Service; variant: 0 | 1 | 2 }) {
  const flip = variant === 1;
  return (
    <section
      id={service.slug}
      data-section={service.shortTitle}
      aria-labelledby={`svc-${service.slug}`}
      className="relative border-t border-line py-20 md:py-32"
    >
      <div className="shell grid gap-y-12 md:grid-cols-12 md:gap-x-[var(--gutter)]">
        {/* Number + title */}
        <div className={cn("md:col-span-12", variant === 2 && "md:text-center")}>
          <p className="label flex items-center gap-3" aria-hidden>
            <span className="text-gold">{service.number}</span>
            <span className="h-px w-10 bg-line-strong" />
            Chapter {service.number}
          </p>
          <RevealText
            as="h2"
            id={`svc-${service.slug}`}
            split="words"
            className={cn("display mt-6 text-giant uppercase", variant === 2 ? "mx-auto max-w-[16ch]" : "max-w-[14ch]")}
          >
            {service.title}
          </RevealText>
        </div>

        {/* Images */}
        <div
          className={cn(
            "relative",
            variant === 0 && "md:col-span-7",
            variant === 1 && "md:col-span-6 md:col-start-7 md:row-start-2",
            variant === 2 && "md:col-span-10 md:col-start-2",
          )}
        >
          <RevealMask
            className={cn("w-full", variant === 2 ? "aspect-[4/5] sm:aspect-[21/9]" : "aspect-[4/5] sm:aspect-[4/3]")}
            parallax={6}
            direction={flip ? "left" : "right"}
          >
            <Picture image={service.image} sizes="(min-width: 768px) 60vw, 100vw" />
          </RevealMask>
          {service.secondaryImage && variant !== 2 && (
            <Parallax
              speed={22}
              className={cn(
                "absolute -bottom-10 hidden w-[38%] md:block",
                flip ? "-left-[14%]" : "-right-[12%]",
              )}
            >
              <RevealMask className="aspect-[3/4] w-full border-[6px] border-ink" delay={0.2}>
                <Picture image={service.secondaryImage} sizes="20vw" />
              </RevealMask>
            </Parallax>
          )}
        </div>

        {/* Copy */}
        <div
          className={cn(
            "flex flex-col justify-end",
            variant === 0 && "md:col-span-4 md:col-start-9",
            variant === 1 && "md:col-span-5 md:col-start-1 md:row-start-2",
            variant === 2 && "md:col-span-10 md:col-start-2 md:grid md:grid-cols-2 md:gap-[var(--gutter)]",
          )}
        >
          <FadeIn>
            <p className="display text-[clamp(1.5rem,2.2vw,2.1rem)] italic leading-tight text-gold-soft">{service.tagline}</p>
            {service.description.map((p, i) => (
              <p key={i} className="mt-5 leading-relaxed text-mute">
                {p}
              </p>
            ))}
          </FadeIn>
          <FadeIn className={cn("mt-10", variant === 2 && "md:mt-0")} selector="[data-li]" stagger={0.05}>
            <p className="label mb-4 text-paper">What&apos;s included</p>
            <ul className="border-t border-line">
              {service.included.map((item) => (
                <li key={item} data-li className="flex gap-4 border-b border-line py-3 text-paper/90">
                  <span aria-hidden className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="label mt-8 mb-3 text-paper">Suitable for</p>
            <p className="text-mute">{service.audience.join(" · ")}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href={`/contact?service=${service.slug}`} variant="solid">
                Enquire
              </ButtonLink>
              <ButtonLink
                href={whatsappHref(site.people.founder.whatsapp, service.title.toLowerCase())}
                variant="outline"
                icon={<WhatsAppIcon size={16} />}
                magnetic={false}
              >
                WhatsApp
              </ButtonLink>
              <Link href={`/services/${service.slug}`} className="label inline-flex items-center gap-2 px-2 text-paper hover:text-gold">
                Details <ArrowUpRight size={14} />
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
